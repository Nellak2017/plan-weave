-- users.sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE
);
-- tasks.sql
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY, -- TaskID = int64
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- UserID = UUID

    task TEXT NOT NULL CHECK (char_length(task) <= 50),
    selected BOOLEAN NOT NULL DEFAULT false,

    ttc DOUBLE PRECISION NOT NULL,           -- time to complete
    live_time DOUBLE PRECISION NOT NULL,     -- Time spent working
    due_date TIMESTAMPTZ NOT NULL,           -- ISOTime

    efficiency DOUBLE PRECISION NOT NULL,    -- 1.0 = 100%
    parent_thread TEXT NOT NULL,             -- ThreadID
    waste DOUBLE PRECISION NOT NULL,         -- Time wasted

    eta TIMESTAMPTZ NOT NULL,                -- Projected finish
    weight INTEGER NOT NULL,                 -- Weight

    status TEXT NOT NULL,                    -- TaskStatus, ENUM optional
    live_time_stamp TIMESTAMPTZ,             -- Optional; maybe remove

    last_complete_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_incomplete_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    is_live BOOLEAN NOT NULL DEFAULT false
);

-- task_dependencies.sql
CREATE TABLE task_dependencies (
    task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    depends_on_task_id BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,

    PRIMARY KEY (task_id, depends_on_task_id)
);

-- Triggers

-- 1. Function that runs after auth.users insert
CREATE OR REPLACE FUNCTION public.sync_auth_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (user_id, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Attach it to auth.users
CREATE TRIGGER trigger_sync_auth_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_auth_user();