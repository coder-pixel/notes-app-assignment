// src/components/NoteEditor.tsx

import { useEffect, useState } from "react";
import type { Note } from "../types/note";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import Swal from "sweetalert2";

type NoteEditorProps = {
  note: Note;
  onUpdate: (updated: Note) => void;
  onDelete: (id: string) => void;
};

const NoteEditor = ({ note, onUpdate, onDelete }: NoteEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  // Save changes with debounce, to minimize unneccessary api calls on every text change
  useDebouncedEffect(
    () => {
      if (title !== note?.title || content !== note?.content) {
        onUpdate({
          ...note,
          title,
          content,
          updatedAt: new Date(),
          synced: false,
        });
      }
    },
    [title, content],
    500
  );

  useEffect(() => {
    setTitle(note?.title);
    setContent(note?.content);
  }, [note]);

  const _onDeleteAlert = (noteId: string) => {
    if (!noteId) return;

    Swal.fire({
      title: "Error!",
      text: "Are you sure you want to delete this note?",
      icon: "error",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    })?.then((result) => {
      if (result?.isConfirmed) {
        onDelete(noteId);
      }
    });
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      {/* Title Input */}
      <div className="flex flex-1 items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold border-b p-2 flex-1"
        />

        {/* Delete Button */}
        <button
          onClick={() => _onDeleteAlert(note?.id)}
          className="text-red-600 hover:text-red-800 cursor-pointer p-2"
          aria-label="Delete Note"
          title="Delete Note"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Markdown Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 border p-2 resize-none mb-4 min-h-[500px]"
        placeholder="Write your markdown content here..."
      />

      {/* Markdown Preview */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-semibold mb-2 text-gray-600">Preview:</h4>
        <div className="prose max-w-none text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
