update public.project_weeks
set status = 'closed'
where status = 'active';

insert into public.project_weeks (
  week_number,
  question_number,
  title_zh,
  title_en,
  question_zh,
  question_en,
  assigned_instructor,
  materials,
  status
)
values (
  4,
  1,
  '網站實作與 AI 生活任務',
  'Website Completion & AI Life Task',
  '1. 完成課堂中未完成的網站。\n2. 這週用 AI 幫你完成一件生活事務，並寫下過程。',
  '1. Complete the website left unfinished in class.\n2. Use AI to complete one everyday task this week and write down the process.',
  'August',
  '[]'::jsonb,
  'active'
)
on conflict (week_number) do update
set question_number = excluded.question_number,
    title_zh = excluded.title_zh,
    title_en = excluded.title_en,
    question_zh = excluded.question_zh,
    question_en = excluded.question_en,
    assigned_instructor = excluded.assigned_instructor,
    materials = excluded.materials,
    status = excluded.status;
