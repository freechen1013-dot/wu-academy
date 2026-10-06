update public.project_weeks
set question_zh = '你認為在處理這些問題時，什麼樣的思考方式或順序最重要？為什麼？',
    question_en = 'When working through these problems, what way or order of thinking do you believe is most important, and why?'
where week_number = 1
  and title_zh = 'Math is Everything';
