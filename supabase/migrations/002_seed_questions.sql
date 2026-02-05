-- Insert categories
INSERT INTO categories (name, emoji, display_order) VALUES
  ('Pregame', '🏈', 1),
  ('Game Outcome', '🎯', 2),
  ('Scoring', '🏃', 3),
  ('Halftime Show', '🎤', 4),
  ('Commercials & Broadcast', '📺', 5),
  ('Player Props', '⭐', 6),
  ('Fun Props', '🎉', 7);

-- Get category IDs for reference
DO $$
DECLARE
  pregame_id UUID;
  outcome_id UUID;
  scoring_id UUID;
  halftime_id UUID;
  commercials_id UUID;
  player_id UUID;
  fun_id UUID;
BEGIN
  SELECT id INTO pregame_id FROM categories WHERE name = 'Pregame';
  SELECT id INTO outcome_id FROM categories WHERE name = 'Game Outcome';
  SELECT id INTO scoring_id FROM categories WHERE name = 'Scoring';
  SELECT id INTO halftime_id FROM categories WHERE name = 'Halftime Show';
  SELECT id INTO commercials_id FROM categories WHERE name = 'Commercials & Broadcast';
  SELECT id INTO player_id FROM categories WHERE name = 'Player Props';
  SELECT id INTO fun_id FROM categories WHERE name = 'Fun Props';

  -- Pregame questions (5)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (pregame_id, 'What will the coin toss result be?', 1, 'MULTIPLE_CHOICE', 
     '{"type": "MULTIPLE_CHOICE", "choices": ["Heads", "Tails"]}', 1),
    (pregame_id, 'Will the National Anthem be over or under 2 minutes 5 seconds?', 2, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 125, "label": "2:05"}}', 2),
    (pregame_id, 'Which team will win the coin toss?', 3, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A", "Team B"]}', 3),
    (pregame_id, 'What will happen on the opening kickoff?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Touchback", "Return inside 25", "Return past 25", "Fumble/Penalty"]}', 4),
    (pregame_id, 'What will be the first penalty of the game?', 5, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["False Start", "Holding", "Pass Interference", "Other"]}', 5);

  -- Game Outcome questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (outcome_id, 'Which team will win the game?', 1, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A", "Team B"]}', 1),
    (outcome_id, 'Will total points scored be over or under 50.5?', 2, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 50.5, "label": "50.5 points"}}', 2),
    (outcome_id, 'Will the game go to overtime?', 3, 'YES_NO',
     '{"type": "YES_NO"}', 3),
    (outcome_id, 'What will be the winning margin?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["1-3 points", "4-7 points", "8-14 points", "15+ points"]}', 4);

  -- Scoring questions (5)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (scoring_id, 'Which team will score first?', 1, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A", "Team B"]}', 1),
    (scoring_id, 'Which team will score last?', 2, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A", "Team B"]}', 2),
    (scoring_id, 'Will there be a safety in the game?', 3, 'YES_NO',
     '{"type": "YES_NO"}', 3),
    (scoring_id, 'Total field goals made - over or under 3.5?', 4, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 3.5, "label": "3.5 field goals"}}', 4),
    (scoring_id, 'Longest touchdown - over or under 45.5 yards?', 5, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 45.5, "label": "45.5 yards"}}', 5);

  -- Halftime Show questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (halftime_id, 'How many songs will be performed?', 1, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 8, "label": "8 songs"}}', 1),
    (halftime_id, 'Will there be a surprise guest performer?', 2, 'YES_NO',
     '{"type": "YES_NO"}', 2),
    (halftime_id, 'How many costume changes will the performer have?', 3, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 2.5, "label": "2.5 changes"}}', 3),
    (halftime_id, 'What will be the primary stage color?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Red/Pink", "Blue/Purple", "Gold/Yellow", "Green", "Black/White"]}', 4);

  -- Commercials & Broadcast questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (commercials_id, 'First commercial type aired?', 1, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Car", "Beer", "Tech", "Food", "Movie/TV"]}', 1),
    (commercials_id, 'Will announcers mention "dynasty" during the game?', 2, 'YES_NO',
     '{"type": "YES_NO"}', 2),
    (commercials_id, 'First celebrity shown in the stands?', 3, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Athlete", "Musician", "Actor", "Politician"]}', 3),
    (commercials_id, 'What color will the winning team's Gatorade bath be?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Orange", "Yellow/Green", "Blue/Purple", "Red", "Clear"]}', 4);

  -- Player Props questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (player_id, 'Which QB will throw more touchdowns?', 1, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Team A QB", "Team B QB", "Tie"]}', 1),
    (player_id, 'Will either QB throw an interception?', 2, 'YES_NO',
     '{"type": "YES_NO"}', 2),
    (player_id, 'Total rushing touchdowns - over or under 1.5?', 3, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 1.5, "label": "1.5 rushing TDs"}}', 3),
    (player_id, 'What position will the MVP play?', 4, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["Quarterback", "Running Back", "Wide Receiver", "Defensive Player"]}', 4);

  -- Fun Props questions (4)
  INSERT INTO questions (category_id, question_text, question_number, question_type, options, display_order) VALUES
    (fun_id, 'Will either head coach be shown crying?', 1, 'YES_NO',
     '{"type": "YES_NO"}', 1),
    (fun_id, 'Total penalty flags thrown - over or under 12.5?', 2, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 12.5, "label": "12.5 flags"}}', 2),
    (fun_id, 'What will be the last digit of the final score total?', 3, 'MULTIPLE_CHOICE',
     '{"type": "MULTIPLE_CHOICE", "choices": ["0-2", "3-4", "5-6", "7-9"]}', 3),
    (fun_id, 'Length of MVP''s acceptance speech - over or under 90 seconds?', 4, 'OVER_UNDER',
     '{"type": "OVER_UNDER", "overUnder": {"value": 90, "label": "90 seconds"}}', 4);
END $$;
