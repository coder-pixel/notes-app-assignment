import { openDB } from "idb";
import type { Note } from "../types/note";

const DB_NAME = "notes-db";
const STORE_NAME = "notes";

// initialization - read docs: https://www.npmjs.com/package/idb#api
const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    //upgrade (optional): Called if this version of the database has never been opened before - docs
    db.createObjectStore(STORE_NAME, { keyPath: "id" });
  },
});

// defining db fn calls, to be used in services
export const getAllNotes = async (): Promise<Note[]> => {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
};

export const saveNote = async (note: Note) => {
  const db = await dbPromise;
  return db.put(STORE_NAME, note);
};

export const deleteNote = async (id: string) => {
  const db = await dbPromise;
  return db.delete(STORE_NAME, id);
};
