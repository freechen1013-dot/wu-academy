update public.project_weeks
set status = 'closed'
where status = 'active';

insert into public.project_weeks (
  week_number,
  title_zh,
  title_en,
  question_zh,
  question_en,
  assigned_instructor,
  materials,
  status
)
values (
  1,
  'Math is Everything',
  'Math is Everything',
  'test',
  'test',
  'Test Lecturer',
  '[]'::jsonb,
  'active'
)
on conflict (week_number) do update
set title_zh = excluded.title_zh,
    title_en = excluded.title_en,
    question_zh = excluded.question_zh,
    question_en = excluded.question_en,
    assigned_instructor = excluded.assigned_instructor,
    materials = excluded.materials,
    status = excluded.status;
