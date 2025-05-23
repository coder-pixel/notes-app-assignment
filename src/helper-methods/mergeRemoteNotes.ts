// import { getTimestamp } from ".";
import { saveNote } from "../db/indexedDB";
import { fetchNotes } from "../services/api"; // adjust if needed
import type { Note } from "../types/note";

export const mergeRemoteNotes = async (remoteNotes: Note[]) => {
  const localNotes = await fetchNotes();
  //   console.log({ localNotes });
  const localMap = new Map(
    localNotes.data?.map((note: Note) => [note?.id, note])
  );

  for (const remoteNote of remoteNotes) {
    const localNote = localMap?.get(remoteNote?.id);
    // console.log({ localNote });

    // If note doesn't exist locally, save it
    if (!localNote) {
      await saveNote(remoteNote);
    } else {
      // If remote note is newer, overwrite local

      //   console.log("Comparing dates:", { remoteUpdated, localUpdated });
      //   const remoteTime = getTimestamp(remoteNote);
      //   const localTime = getTimestamp(localNote);

      //   console.log("REMOTE:", remoteNote);
      //   console.log("LOCAL:", localNote);
      // //   console.log("Time difference (remote - local):", remoteTime - localTime);

      //   if (remoteTime > localTime) {
      //   console.log("Remote note is newer, updating:", { remoteNote });
      await saveNote(remoteNote);
      //   }
      // If local is newer, do nothing (we'll sync that later from mock backend)
    }
  }
};
