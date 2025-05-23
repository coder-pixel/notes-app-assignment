import Header from "./components/Header";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import useNotesApp from "./hooks/useNotesApp";

const NotesApp = () => {
  const {
    filteredNotes,
    selectedNote,
    searchQuery,
    selectedId,
    isOnline,
    handleSelectedId,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSearchQuery,
  } = useNotesApp();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header onCreate={handleCreate} isOnline={isOnline} />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <div
          className={`${
            selectedNote ? "hidden md:block" : "block"
          } w-full md:w-1/3 h-full overflow-y-auto border-r border-gray-200`}
        >
          <NoteList
            notes={filteredNotes}
            selectedId={selectedId}
            onSelect={handleSelectedId}
            searchQuery={searchQuery}
            setSearchQuery={handleSearchQuery}
          />
        </div>

        {selectedNote ? (
          <div className="w-full md:w-2/3 h-full overflow-y-auto bg-white">
            {/* below part hidden for mid or large devices */}
            <div className="md:hidden sticky top-0 z-10 bg-white border-b border-gray-200 p-2">
              <button
                onClick={() => handleSelectedId(null)}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Notes
              </button>
            </div>

            <NoteEditor
              note={selectedNote}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm p-4 text-center">
            <div>
              <p className="mb-2">No note selected</p>
              <p className="text-xs">
                Select a note from the list or create a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;
