ALTER TABLE users
    ADD COLUMN responsibility TEXT;

UPDATE users
SET responsibility = CASE
    WHEN role = 'ROLE_HR' THEN 'Сопровождение адаптации, назначение наставников, работа со стажёрами'
    WHEN role = 'ROLE_TRAINEE' THEN 'Прохождение программы адаптации и выполнение учебных задач'
    WHEN position ILIKE '%lead%' OR position ILIKE '%manager%' THEN 'Руководство командой, постановка задач, код-ревью'
    WHEN position ILIKE '%dev%' OR position ILIKE '%engineer%' THEN 'Разработка и сопровождение продуктовых задач'
    WHEN position ILIKE '%qa%' OR position ILIKE '%test%' THEN 'Качество релизов, тестирование и автоматизация'
    WHEN position ILIKE '%design%' OR position ILIKE '%ux%' THEN 'Продуктовый UX/UI и дизайн-система'
    WHEN position ILIKE '%analyst%' OR position ILIKE '%data%' THEN 'Аналитика, метрики и отчётность'
    WHEN position ILIKE '%devops%' OR position ILIKE '%sre%' OR position ILIKE '%admin%' THEN 'Инфраструктура, CI/CD и доступы'
    WHEN position ILIKE '%hr%' OR position ILIKE '%recruit%' THEN 'Подбор, адаптация и кадровые процессы'
    ELSE 'Рабочие задачи в рамках отдела ' || COALESCE(department, 'компании')
END
WHERE responsibility IS NULL;
