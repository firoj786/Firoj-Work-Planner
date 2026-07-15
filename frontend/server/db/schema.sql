CREATE TABLE IF NOT EXISTS wp_users (
    pk_id              BIGSERIAL PRIMARY KEY,
    name               VARCHAR(255) NOT NULL,
    email              VARCHAR(255) NOT NULL UNIQUE,
    password_hash      VARCHAR(255),
    subscription       VARCHAR(50) NOT NULL DEFAULT 'FREE',
    role               VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wp_tasks (
    pk_id              BIGSERIAL PRIMARY KEY,
    fk_user            BIGINT NOT NULL REFERENCES wp_users(pk_id) ON DELETE CASCADE,
    title              VARCHAR(500) NOT NULL,
    description        TEXT,
    priority           VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status             VARCHAR(50) NOT NULL DEFAULT 'TODO',
    due_date           DATE,
    reminder_at        TIMESTAMPTZ,
    labels             VARCHAR(500),
    color              VARCHAR(50),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wp_tasks_user ON wp_tasks(fk_user);
CREATE INDEX IF NOT EXISTS idx_wp_tasks_status ON wp_tasks(status);
CREATE INDEX IF NOT EXISTS idx_wp_tasks_due ON wp_tasks(due_date);

CREATE TABLE IF NOT EXISTS wp_notes (
    pk_id              BIGSERIAL PRIMARY KEY,
    fk_user            BIGINT NOT NULL REFERENCES wp_users(pk_id) ON DELETE CASCADE,
    title              VARCHAR(500) NOT NULL,
    content            TEXT,
    tags               VARCHAR(500),
    category           VARCHAR(255),
    pinned             BOOLEAN NOT NULL DEFAULT FALSE,
    favorite           BOOLEAN NOT NULL DEFAULT FALSE,
    archived           BOOLEAN NOT NULL DEFAULT FALSE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wp_notes_user ON wp_notes(fk_user);

CREATE TABLE IF NOT EXISTS wp_knowledge (
    pk_id              BIGSERIAL PRIMARY KEY,
    fk_user            BIGINT NOT NULL REFERENCES wp_users(pk_id) ON DELETE CASCADE,
    title              VARCHAR(500) NOT NULL,
    content            TEXT,
    category           VARCHAR(255),
    tags               VARCHAR(500),
    version            INT NOT NULL DEFAULT 1,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wp_knowledge_user ON wp_knowledge(fk_user);
