-- Quizzes: Mental/emotional wellness assessments
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  result_intro TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  options JSONB NOT NULL DEFAULT '[]'
);

-- Quiz results (user submissions)
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  result_type TEXT,
  result_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz ON quiz_results(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON quizzes(slug);

-- RLS: Public read for quizzes/questions, insert for results
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Public can read quiz_questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can submit quiz result" ON quiz_results FOR INSERT WITH CHECK (true);

-- Seed: Loneliness self-assessment quiz
INSERT INTO quizzes (id, title, slug, description, result_intro, sort_order) VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'अकेलेपन का आकलन',
    'loneliness-assessment',
    'यह छोटा assessment आपको अपनी emotional state समझने में मदद करेगा। सभी सवालों के ईमानदार जवाब दें।',
    'आपके जवाबों के आधार पर यहाँ आपकी स्थिति का संक्षिप्त विश्लेषण है। याद रखें: यह पेशेवर निदान नहीं है।',
    1
  )
ON CONFLICT (slug) DO NOTHING;

-- Quiz questions for loneliness assessment
INSERT INTO quiz_questions (quiz_id, question_text, sort_order, options) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'आपको कितनी बार लगता है कि आप किसी के करीब नहीं हैं?', 1, '[
    {"value": "1", "label": "कभी नहीं", "score": 0},
    {"value": "2", "label": "कभी-कभी", "score": 1},
    {"value": "3", "label": "अक्सर", "score": 2},
    {"value": "4", "label": "हमेशा", "score": 3}
  ]'::jsonb),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'क्या आपको अपनी feelings share करने के लिए कोई मिलता है?', 2, '[
    {"value": "1", "label": "हाँ, आसानी से", "score": 0},
    {"value": "2", "label": "कभी-कभी", "score": 1},
    {"value": "3", "label": "शायद ही कभी", "score": 2},
    {"value": "4", "label": "नहीं, किसी के साथ नहीं", "score": 3}
  ]'::jsonb),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'आप अपने दिन के बारे में कैसा महसूस करते हैं?', 3, '[
    {"value": "1", "label": "संतुष्ट और खुश", "score": 0},
    {"value": "2", "label": "ठीक-ठाक", "score": 1},
    {"value": "3", "label": "खाली या उदास", "score": 2},
    {"value": "4", "label": "बहुत अकेला", "score": 3}
  ]'::jsonb),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'क्या आपको लगता है कि लोग आपको समझते हैं?', 4, '[
    {"value": "1", "label": "हाँ, पूरी तरह", "score": 0},
    {"value": "2", "label": "कुछ हद तक", "score": 1},
    {"value": "3", "label": "बहुत कम", "score": 2},
    {"value": "4", "label": "बिल्कुल नहीं", "score": 3}
  ]'::jsonb),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'आप अपने social connections से कितने संतुष्ट हैं?', 5, '[
    {"value": "1", "label": "बहुत संतुष्ट", "score": 0},
    {"value": "2", "label": "संतुष्ट", "score": 1},
    {"value": "3", "label": "कम संतुष्ट", "score": 2},
    {"value": "4", "label": "बिल्कुल संतुष्ट नहीं", "score": 3}
  ]'::jsonb);
