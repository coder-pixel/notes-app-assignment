// service used to sync all the notes that are updated / created while offline and needs to be synced with the server when online

import { getAllNotes, saveNote } from "../db/indexedDB";
import { createNote, updateNote } from "./api";

export const syncNotes = async () => {
  const notes = await getAllNotes();

  for (const note of notes) {
    try {
      if (!note?.synced) {
        await (note.id.startsWith("temp-")
          ? createNote(note)
          : updateNote(note));
        await saveNote({ ...note, synced: true });
      }
    } catch (error) {
      console.error("Sync error for note: ", note?.id, error);
    }
  }
};
