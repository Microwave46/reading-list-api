CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo'
        CHECK (status IN ('todo', 'reading', 'done'))
);

INSERT INTO books (title, author, status) VALUES
  ('Atomic Habits', 'James Clear', 'reading'),
  ('Clean Code', 'Robert C. Martin', 'todo');