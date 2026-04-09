-- V16: Outbox table for event-driven architecture
CREATE TABLE ib.outbox_event (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    payload TEXT,
    status VARCHAR(20) DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for processing NEW events
CREATE INDEX idx_outbox_status ON ib.outbox_event(status) WHERE status = 'NEW';
