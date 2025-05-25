-- users.sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
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