CREATE TABLE IF NOT EXISTS canvas_workspaces (
  conversation_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  template TEXT NOT NULL,
  files_json TEXT NOT NULL,
  active_file TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_canvas_workspaces_user_updated
  ON canvas_workspaces(user_id, updated_at DESC);
