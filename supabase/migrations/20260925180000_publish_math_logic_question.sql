update public.project_weeks
set question_zh = '課程裡的邏輯題中，你是怎麼一步一步從「不知道答案」推理到「確定答案」的？',
    question_en = 'In the logic puzzle from the lesson, how did you reason step by step from not knowing the answer to being certain of it?'
where week_number = 1
  and title_zh = 'Math is Everything';
