alter table public.project_submissions
  drop constraint if exists project_submissions_week_id_nickname_key;

alter table public.project_submissions
  alter column question_number set not null;

alter table public.project_submissions
  add constraint project_submissions_week_question_nickname_key
  unique (week_id, question_number, nickname);
