import { useEffect, useMemo, useState } from "react";
import type { Note } from "../types/note";
import useOnlineStatus from "./useOnlineStatus";
import {
  getAllNotes,
  saveNote,
  deleteNote as removeNote,
} from "../db/indexedDB";
import { v4 as uuidv4 } from "uuid";

import {
  createNote as apiCreate,
  updateNote as apiUpdate,
  deleteNote as apiDelete,
  fetchNotes as apiFetch,
} from "../services/api";
import { errorHandler } from "../helper-methods/index";

const useNotesApp = () => {
  const [notes, setNotes] = useState<Note[]>([]); // list of all notes
  const [selectedId, setSelectedId] = useState<string | null>(null); // to track note for editing
  const [searchQuery, setSearchQuery] = useState(""); // for searching

  const isOnline = useOnlineStatus(); // custom hook to track online / offline status

  const _handleCreate = async () => {
    const newNote: Note = {
      id: uuidv4(),
      title: "",
      content: "",
      createdAt: new Date(),
      synced: false,
    };

    await saveNote(newNote); // updating indexedDb
    setNotes((prev) => [newNote, ...prev]); // optimistic updations
    setSelectedId(newNote?.id);
  };

  const _handleUpdate = async (updated: Note) => {
    await saveNote(updated); // updating indexedDb
    setNotes((prev) => prev?.map((n) => (n?.id === updated?.id ? updated : n))); // optimistic updations
  };

  const _handleDelete = async (id: string) => {
    await removeNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
    try {
      if (isOnline) {
        await apiDelete(id);
      }
    } catch (err) {
      console.error("Failed to delete on server:", err);
    }
  };

  const _handleSearchQuery = (str: string | null) => {
    setSearchQuery(str || "");
  };

  const _handleSelectedId = (id: string | null) => {
    setSelectedId(id || null);
  };

  // Filter notes by title/content
  const filteredNotes = useMemo(
    () =>
      notes?.filter(
        (note) =>
          note?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          note?.content?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      ),
    [notes, searchQuery]
  );

  const selectedNote = useMemo(
    () => notes?.find((note) => note?.id === selectedId),
    [notes, selectedId]
  );

  // Load notes from IndexedDB on startup
  useEffect(() => {
    const loadNotes = async () => {
      const stored = await getAllNotes();
      // Sort by last updated
      setNotes(
        stored?.sort((a, b) => {
          const dateA = a?.updatedAt
            ? new Date(a.updatedAt)
            : new Date(a.createdAt);
          const dateB = b?.updatedAt
            ? new Date(b.updatedAt)
            : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        })
      );
    };

    loadNotes();
  }, []);

  // Sync local unsynced notes when online
  useEffect(() => {
    if (isOnline) {
      const syncNotes = async () => {
        for (const note of notes) {
          try {
            if (!note?.synced) {
              if (note?.title === "" && note?.content === "") continue; // Skip empty
              const response = await apiFetch();
              const existingNote = response?.data?.find(
                (n: Note) => n?.id === note?.id
              );

              if (existingNote) {
                await apiUpdate(note);
              } else {
                await apiCreate(note);
              }

              const updatedNote = { ...note, synced: true };
              await saveNote(updatedNote);

              setNotes((prev) =>
                prev?.map((n) => (n?.id === note?.id ? updatedNote : n))
              );
            }
          } catch (err) {
            errorHandler(err);
            console.error("Sync error:", err);
          }
        }
      };
      syncNotes();
    }
  }, [isOnline, notes]);

  // useEffect(() => {
  //   setSelectedId(null);
  // }, [filteredNotes]);

  return {
    filteredNotes,
    selectedNote,
    searchQuery,
    selectedId,
    isOnline,
    handleSelectedId: _handleSelectedId,
    handleCreate: _handleCreate,
    handleUpdate: _handleUpdate,
    handleDelete: _handleDelete,
    handleSearchQuery: _handleSearchQuery,
  };
};

export default useNotesApp;
