import { getRelativeTime } from "../helper-methods";
import type { Note } from "../types/note";

type NoteListProps = {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const NoteList = ({
  notes,
  selectedId,
  onSelect,
  searchQuery,
  setSearchQuery,
}: NoteListProps) => {
  return (
    <aside className="w-full border-r border-gray-200 bg-white overflow-y-auto">
      {/* Search Input */}
      <div className="sticky top-0 p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {notes?.length ? (
        notes?.map((note) => (
          <div
            key={note?.id}
            onClick={() => onSelect(note?.id)}
            className={`p-4 border-b cursor-pointer text-sm hover:bg-gray-50 transition-colors ${
              selectedId === note?.id ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold truncate flex-1">
                {note?.title || "Untitled"}
              </h3>
              <div className="flex items-center gap-2">
                {note?.updatedAt ? (
                  <span className="text-xs text-blue-500 flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Edited
                  </span>
                ) : null}
                <span className="text-xs text-blue-500 flex items-center ">
                  <span
                    className={`text-xs inline-block rounded-full w-2 h-2 mr-2 ${
                      note?.synced
                        ? "bg-green-500"
                        : "bg-yellow-500 animate-pulse"
                    }`}
                    title={note?.synced ? "Synced" : "Unsynced"}
                  />
                  {note?.synced ? "Synced" : "Unsynced"}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 truncate mb-2">
              {note?.content}
            </p>

            <div className="flex items-center text-xs text-gray-400">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {note?.updatedAt || note?.createdAt
                ? getRelativeTime(
                    new Date(
                      note?.updatedAt ? note?.updatedAt : note?.createdAt
                    )
                  )
                : null}
            </div>
          </div>
        ))
      ) : (
        <p className="p-4 text-gray-500 text-sm">No notes found.</p>
      )}
    </aside>
  );
};

export default NoteList;
