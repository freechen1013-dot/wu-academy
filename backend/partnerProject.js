import crypto from 'crypto';
import { Buffer } from 'node:buffer';
import process from 'node:process';
import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';

const BUCKET = 'borderless-submissions';
const MAX_FILES = 5;
const MAX_TOTAL_BYTES = 150 * 1024 * 1024;
const SIGNED_URL_SECONDS = 300;
const ALLOWED_TYPES = new Map([
  ['image/jpeg', ['.jpg', '.jpeg']],
  ['image/png', ['.png']],
  ['image/webp', ['.webp']],
  ['video/mp4', ['.mp4']],
  ['video/quicktime', ['.mov']],
  ['application/pdf', ['.pdf']],
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: MAX_FILES, fileSize: MAX_TOTAL_BYTES },
  fileFilter: (_req, file, callback) => {
    const extension = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
    const extensions = ALLOWED_TYPES.get(file.mimetype);
    callback(extensions?.includes(extension) ? null : new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
  },
});

function apiError(res, status, error) {
  return res.status(status).json({ error });
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value.trim();
}

function safeEqual(left, right) {
  const a = Buffer.from(left || '');
  const b = Buffer.from(right || '');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function submissionCodeHash(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

function parseLecturers() {
  try {
    const lecturers = JSON.parse(requiredEnv('PARTNER_LECTURERS'));
    if (!Array.isArray(lecturers)) throw new Error('must be an array');
    return lecturers.filter(({ name, code, email, active }) => name && code && email && active === true);
  } catch (error) {
    throw new Error(`PARTNER_LECTURERS is invalid: ${error.message}`, { cause: error });
  }
}

function sessionSecret() {
  return requiredEnv('PARTNER_SESSION_SECRET');
}

function signSession(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', sessionSecret()).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function readSession(req) {
  const cookie = req.headers.cookie?.split(';').map((value) => value.trim())
    .find((value) => value.startsWith('partner_session='))?.slice('partner_session='.length);
  if (!cookie) return null;
  const [encoded, signature] = cookie.split('.');
  if (!encoded || !signature) return null;
  const expected = crypto.createHmac('sha256', sessionSecret()).update(encoded).digest('base64url');
  if (!safeEqual(signature, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return ['student', 'director', 'lecturer'].includes(session.role) ? session : null;
  } catch {
    return null;
  }
}

function sessionCookie(value, maxAge) {
  const parts = [`partner_session=${value}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  if (maxAge !== undefined) parts.push(`Max-Age=${maxAge}`);
  return parts.join('; ');
}

function sanitizeText(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength
    ? value.trim()
    : null;
}

function storagePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

function supabaseRequest(path, options = {}) {
  const url = `${requiredEnv('SUPABASE_URL').replace(/\/$/, '')}${path}`;
  const apiKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');
  return fetch(url, {
    ...options,
    headers: {
      apikey: apiKey,
      // New Supabase secret keys are not JWTs and must not be sent as Bearer tokens.
      ...(apiKey.startsWith('sb_') ? {} : { Authorization: `Bearer ${apiKey}` }),
      ...options.headers,
    },
  });
}

async function rest(path, options = {}) {
  const response = await supabaseRequest(`/rest/v1/${path}`, options);
  if (!response.ok) throw new Error(`Supabase request failed (${response.status}): ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

async function insertEvent(submissionId, actor, eventType, note = null) {
  await rest('submission_events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ submission_id: submissionId, actor, event_type: eventType, note }),
  });
}

async function signedAttachments(attachments = []) {
  return Promise.all(attachments.map(async (attachment) => {
    const response = await supabaseRequest(`/storage/v1/object/sign/${BUCKET}/${storagePath(attachment.storage_path)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiresIn: SIGNED_URL_SECONDS }),
    });
    if (!response.ok) throw new Error(`Could not sign attachment (${response.status})`);
    const { signedURL } = await response.json();
    return {
      id: attachment.id,
      fileName: attachment.file_name,
      contentType: attachment.content_type,
      fileSize: attachment.file_size,
      url: `${requiredEnv('SUPABASE_URL').replace(/\/$/, '')}/storage/v1${signedURL}`,
      expiresIn: SIGNED_URL_SECONDS,
    };
  }));
}

async function sendNotification(subject, text, lecturerEmail) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) return;
  const recipients = [process.env.PARTNER_NOTIFICATION_EMAIL, lecturerEmail].filter(Boolean);
  if (!recipients.length) return;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  await transporter.sendMail({ from: process.env.SMTP_FROM, to: recipients.join(','), subject, text });
}

function requireSession(roles) {
  return (req, res, next) => {
    try {
      const session = readSession(req);
      if (!session) return apiError(res, 401, 'Login required');
      if (!roles.includes(session.role)) return apiError(res, 403, 'Insufficient permissions');
      if (session.role === 'lecturer' && !parseLecturers().some((person) => person.name === session.name && person.email === session.email)) {
        return apiError(res, 403, 'Instructor access is no longer active');
      }
      req.partnerSession = session;
      return next();
    } catch {
      return apiError(res, 503, 'Partner project authentication is not configured');
    }
  };
}

export function createPartnerProjectRouter() {
  const router = express.Router();

  router.post('/login', (req, res) => {
    try {
      const code = typeof req.body?.code === 'string' ? req.body.code : '';
      let session;
      if (safeEqual(code, requiredEnv('PARTNER_STUDENT_CODE'))) session = { role: 'student' };
      else if (safeEqual(code, requiredEnv('PARTNER_DIRECTOR_CODE'))) session = { role: 'director' };
      else {
        const lecturer = parseLecturers().find((person) => safeEqual(code, person.code));
        if (lecturer) session = { role: 'lecturer', name: lecturer.name, email: lecturer.email };
      }
      if (!session) return apiError(res, 401, 'Invalid login code');
      res.setHeader('Set-Cookie', sessionCookie(signSession(session)));
      return res.json({ role: session.role, name: session.name });
    } catch {
      return apiError(res, 503, 'Partner project authentication is not configured');
    }
  });

  router.post('/logout', (_req, res) => {
    res.setHeader('Set-Cookie', sessionCookie('', 0));
    res.status(204).end();
  });

  router.get('/', async (_req, res) => {
    try {
      const [weeks, submissions] = await Promise.all([
        rest('project_weeks?status=in.(active,closed)&order=week_number.asc'),
        rest('project_submissions?status=eq.approved&select=id,week_id,nickname,response,feedback,created_at,submission_attachments(id,storage_path,file_name,content_type,file_size)&order=created_at.desc'),
      ]);
      const outcomes = await Promise.all(submissions.map(async (submission) => ({
        id: submission.id,
        weekId: submission.week_id,
        nickname: submission.nickname,
        response: submission.response,
        feedback: submission.feedback,
        approved: true,
        createdAt: submission.created_at,
        attachments: await signedAttachments(submission.submission_attachments),
      })));
      const mappedWeeks = weeks.map((week) => ({
        id: week.id, weekNumber: week.week_number, title: week.title_zh, titleEn: week.title_en,
        question: week.question_zh, questionEn: week.question_en, materials: week.materials, status: week.status,
      }));
      res.json({ weeks: mappedWeeks, activeWeek: mappedWeeks.find((week) => week.status === 'active') || null, outcomes });
    } catch (error) {
      console.error('Unable to load partner project', error);
      apiError(res, 503, 'Project data is temporarily unavailable');
    }
  });

  router.get('/review-queue', requireSession(['director', 'lecturer']), async (req, res) => {
    try {
      const [weeks, submissions] = await Promise.all([
        rest('project_weeks?select=id,week_number,title_zh,assigned_instructor,status&order=week_number.asc'),
        rest('project_submissions?select=id,week_id,nickname,response,status,consented_at,review_note,feedback,created_at,submission_attachments(id,storage_path,file_name,content_type,file_size)&order=created_at.asc'),
      ]);
      const allowedWeeks = req.partnerSession.role === 'director'
        ? weeks
        : weeks.filter((week) => [req.partnerSession.name, req.partnerSession.email].includes(week.assigned_instructor));
      const allowedIds = new Set(allowedWeeks.map((week) => week.id));
      const queue = await Promise.all(submissions.filter((submission) => allowedIds.has(submission.week_id)).map(async (submission) => ({
        ...submission,
        attachments: await signedAttachments(submission.submission_attachments),
        submission_attachments: undefined,
      })));
      res.json({ weeks: allowedWeeks, submissions: queue });
    } catch (error) {
      console.error('Unable to load review queue', error);
      apiError(res, 503, 'Review queue is temporarily unavailable');
    }
  });

  // The edit code is the sole capability required to read this student's submission.
  router.get('/submissions/:id/status', async (req, res) => {
    const editCode = typeof req.query.editCode === 'string' ? req.query.editCode : '';
    try {
      const submissions = await rest(`project_submissions?id=eq.${encodeURIComponent(req.params.id)}&select=id,status,nickname,response,review_note,feedback,submission_code_hash`);
      const submission = submissions[0];
      if (!submission || !safeEqual(submission.submission_code_hash, submissionCodeHash(editCode))) return apiError(res, 404, 'Submission not found');
      return res.json({
        id: submission.id,
        status: submission.status,
        nickname: submission.nickname,
        response: submission.response,
        reviewNote: submission.review_note,
        feedback: submission.feedback,
      });
    } catch (error) {
      console.error('Unable to load submission status', error);
      return apiError(res, 503, 'Submission status is temporarily unavailable');
    }
  });

  router.post('/submissions', requireSession(['student']), upload.array('files', MAX_FILES), async (req, res) => {
    const files = req.files || [];
    const response = sanitizeText(req.body.response, 4000);
    const nickname = sanitizeText(req.body.nickname, 40);
    const consent = req.body.consent === true || req.body.consent === 'true';
    const weekId = typeof req.body.weekId === 'string' ? req.body.weekId : '';
    if (!response || !nickname || !consent || !/^[0-9a-f-]{36}$/i.test(weekId)) return apiError(res, 400, 'weekId, response, nickname, and consent are required');
    if (files.length > MAX_FILES || files.some((file) => !ALLOWED_TYPES.get(file.mimetype)?.includes(file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase()))) return apiError(res, 400, 'Files must be JPG, PNG, WebP, MP4, MOV, or PDF');
    if (files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_BYTES) return apiError(res, 413, 'Attachments may total at most 150MB');
    try {
      const weeks = await rest(`project_weeks?id=eq.${encodeURIComponent(weekId)}&status=eq.active&select=id,week_number,assigned_instructor`);
      if (!weeks.length) return apiError(res, 409, 'This week is not accepting submissions');
      const editCode = crypto.randomBytes(18).toString('base64url');
      const [submission] = await rest('project_submissions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
        body: JSON.stringify({ week_id: weekId, nickname, response, consented_at: new Date().toISOString(), submission_code_hash: submissionCodeHash(editCode) }),
      });
      const storedPaths = [];
      try {
        const attachments = [];
        for (const file of files) {
          const path = `${submission.id}/${crypto.randomUUID()}${file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase()}`;
          const uploadResponse = await supabaseRequest(`/storage/v1/object/${BUCKET}/${storagePath(path)}`, { method: 'POST', headers: { 'Content-Type': file.mimetype, 'x-upsert': 'false' }, body: file.buffer });
          if (!uploadResponse.ok) throw new Error(`Upload failed (${uploadResponse.status})`);
          storedPaths.push(path);
          attachments.push({ submission_id: submission.id, storage_path: path, file_name: file.originalname.slice(0, 255), content_type: file.mimetype, file_size: file.size });
        }
        if (attachments.length) await rest('submission_attachments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(attachments) });
        await insertEvent(submission.id, 'student', 'submitted');
      } catch (error) {
        await Promise.allSettled(storedPaths.map((path) => supabaseRequest(`/storage/v1/object/${BUCKET}/${storagePath(path)}`, { method: 'DELETE' })));
        await rest(`project_submissions?id=eq.${submission.id}`, { method: 'DELETE' });
        throw error;
      }
      const lecturer = parseLecturers().find((person) => [person.name, person.email].includes(weeks[0].assigned_instructor));
      sendNotification('New Borderless Project submission', `Week ${weeks[0].week_number} has a new submission from ${nickname}.`, lecturer?.email).catch((error) => console.error('Submission notification failed', error));
      res.status(201).json({ id: submission.id, editCode, message: 'Keep this code to edit or withdraw your unapproved submission.' });
    } catch (error) {
      if (error.message?.includes('duplicate key')) return apiError(res, 409, 'This nickname has already submitted for this week');
      console.error('Unable to create submission', error);
      apiError(res, 503, 'Submission could not be saved');
    }
  });

  // The high-entropy edit code is the authorization capability for a submission.
  router.patch('/submissions/:id', async (req, res) => {
    const editCode = typeof req.body?.editCode === 'string' ? req.body.editCode : '';
    try {
      const submissions = await rest(`project_submissions?id=eq.${encodeURIComponent(req.params.id)}&select=id,status,submission_code_hash`);
      const submission = submissions[0];
      if (!submission || !safeEqual(submission.submission_code_hash, submissionCodeHash(editCode))) return apiError(res, 404, 'Submission not found');
      if (submission.status === 'approved') return apiError(res, 409, 'Approved submissions cannot be changed');
      if (req.body.action === 'withdraw') {
        await rest(`project_submissions?id=eq.${submission.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'withdrawn' }) });
        await insertEvent(submission.id, 'student', 'withdrawn');
        return res.json({ status: 'withdrawn' });
      }
      const response = sanitizeText(req.body.response, 4000);
      const nickname = sanitizeText(req.body.nickname, 40);
      if (!response || !nickname || submission.status === 'withdrawn') return apiError(res, 400, 'An active response and nickname are required');
      await rest(`project_submissions?id=eq.${submission.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ response, nickname, status: 'pending', review_note: null, feedback: null, reviewed_by: null, reviewed_at: null }) });
      await insertEvent(submission.id, 'student', 'updated');
      return res.json({ status: 'pending' });
    } catch (error) {
      if (error.message?.includes('duplicate key')) return apiError(res, 409, 'This nickname has already submitted for this week');
      console.error('Unable to update submission', error);
      return apiError(res, 503, 'Submission could not be updated');
    }
  });

  router.patch('/submissions/:id/review', requireSession(['director', 'lecturer']), async (req, res) => {
    const status = req.body?.status;
    const note = typeof req.body?.note === 'string' ? req.body.note.trim().slice(0, 4000) || null : null;
    const feedback = typeof req.body?.feedback === 'string' ? req.body.feedback.trim().slice(0, 4000) || null : null;
    if (!['approved', 'revision_requested'].includes(status)) return apiError(res, 400, 'status must be approved or revision_requested');
    try {
      const submissions = await rest(`project_submissions?id=eq.${encodeURIComponent(req.params.id)}&select=id,week_id,status`);
      const submission = submissions[0];
      if (!submission || submission.status === 'withdrawn') return apiError(res, 404, 'Submission not found');
      if (submission.status === 'approved') return apiError(res, 409, 'Approved submissions cannot be reviewed again');
      if (req.partnerSession.role === 'lecturer') {
        const weeks = await rest(`project_weeks?id=eq.${submission.week_id}&select=assigned_instructor`);
        if (!weeks.length || ![req.partnerSession.name, req.partnerSession.email].includes(weeks[0].assigned_instructor)) return apiError(res, 403, 'This week is not assigned to you');
      }
      const actor = req.partnerSession.role === 'director' ? 'director' : `lecturer:${req.partnerSession.email}`;
      await rest(`project_submissions?id=eq.${submission.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, review_note: note, feedback, reviewed_by: actor, reviewed_at: new Date().toISOString() }) });
      await insertEvent(submission.id, actor, status, note || feedback);
      return res.json({ status });
    } catch (error) {
      console.error('Unable to review submission', error);
      return apiError(res, 503, 'Submission could not be reviewed');
    }
  });

  return router;
}
