delete from public.project_submissions
where week_id in (
  select id
  from public.project_weeks
  where week_number = 1
    and title_zh = 'Math is Everything'
);
