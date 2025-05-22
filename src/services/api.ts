import axios from "axios";
import type { Note } from "../types/note";
import { BACKEND_BASE_URL } from "../config";

export const fetchNotes = () => axios.get<Note[]>(`${BACKEND_BASE_URL}/notes`);

// api endpoints to be called for fetching, setting, updating and deleting notes fro mthe mock backend
export const createNote = (note: Note) =>
  axios.post(`${BACKEND_BASE_URL}/notes`, note);

export const updateNote = (note: Note) =>
  axios.put(`${BACKEND_BASE_URL}/notes/${note?.id}`, note);

export const deleteRemoteNote = (id: string) =>
  axios.delete(`${BACKEND_BASE_URL}/notes/${id}`);
