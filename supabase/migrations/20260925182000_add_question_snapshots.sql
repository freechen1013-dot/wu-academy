alter table public.project_weeks
  add column if not exists question_number integer not null default 1 check (question_number > 0);

alter table public.project_submissions
  add column if not exists question_number integer,
  add column if not exists question_zh_snapshot text,
  add column if not exists question_en_snapshot text;

update public.project_submissions
set question_number = 1,
    question_zh_snapshot = '課程裡的邏輯題中，你是怎麼一步一步從「不知道答案」推理到「確定答案」的？',
    question_en_snapshot = 'In the logic puzzle from the lesson, how did you reason step by step from not knowing the answer to being certain of it?'
where week_id in (
  select id from public.project_weeks
  where week_number = 1 and title_zh = 'Math is Everything'
)
  and question_number is null;

update public.project_weeks
set question_number = 2
where week_number = 1
  and title_zh = 'Math is Everything';
