// src/session.ts
export function getSessionId(): string {
  let id = localStorage.getItem("tirus.sid");
  if (!id) {
    id = (crypto?.randomUUID?.() || Math.random().toString(36).slice(2)) + Date.now();
    localStorage.setItem("tirus.sid", id);
  }
  return id;
}