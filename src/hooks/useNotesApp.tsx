import { useEffect, useMemo, useState } from "react";
import type { Note } from "../types/note";
import useOnlineStatus from "./useOnlineStatus";
import {
  saveNote,
  deleteNote as removeNote,
  getAllNotes,
} from "../db/indexedDB";
import { v4 as uuidv4 } from "uuid";

import {
  createNote as apiCreate,
  updateNote as apiUpdate,
  deleteNote as apiDelete,
  fetchNotes as apiFetch,
} from "../services/api";
import { errorHandler, toastSuccess } from "../helper-methods/index";
import { BACKEND_BASE_URL } from "../config";
import { mergeRemoteNotes } from "../helper-methods/mergeRemoteNotes";

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

  const _initNotes = async () => {
    if (isOnline) {
      // 1. Try to fetch and merge from backend
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/notes`);
        const remoteNotes = await res?.json();

        await mergeRemoteNotes(remoteNotes);
        toastSuccess("Merged remote notes into local DB");
      } catch (err) {
        errorHandler({ message: `Error syncing from backend: ${err}` });
      }
    }

    // 2. Load merged notes from local
    const stored = await getAllNotes();
    // console.log({ stored });
    setNotes(
      stored?.sort((a, b) => {
        const dateA = new Date(a.updatedAt ?? a.createdAt);
        const dateB = new Date(b.updatedAt ?? b.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
    );
  };

  // First Sync notes from backend (deployed on render) and merge into IndexedDB
  // Then load from IndexedDB and set state again
  useEffect(() => {
    _initNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load notes from IndexedDB on startup
  // useEffect(() => {
  //   const loadNotes = async () => {
  //     const stored = await getAllNotes();
  //     // Sort by last updated
  //     setNotes(
  //       stored?.sort((a, b) => {
  //         const dateA = a?.updatedAt
  //           ? new Date(a.updatedAt)
  //           : new Date(a.createdAt);
  //         const dateB = b?.updatedAt
  //           ? new Date(b.updatedAt)
  //           : new Date(b.createdAt);
  //         return dateB.getTime() - dateA.getTime();
  //       })
  //     );
  //   };

  //   loadNotes();
  // }, []);

  // useEffect(() => {
  //   const syncFromBackend = async () => {
  //     if (navigator.onLine) {
  //       const res = await fetch("https://your-backend.onrender.com/notes");
  //       const remoteNotes = await res.json();
  //       await localNoteService.mergeRemoteNotes(remoteNotes); // logic needed
  //     }
  //   };
  //   syncFromBackend();
  // }, []);

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
