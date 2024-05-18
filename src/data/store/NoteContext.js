import { useContext, useReducer } from "react";
import React from "react";
import { NOTES, TRASH, COLORS, LABELS } from "../dummy-data";
import { add } from "date-fns";
import { de } from "date-fns/locale";

const NoteContext = React.createContext({
  notes: NOTES,
  trash: TRASH,
  colors: COLORS,
  labels: LABELS,
  addNote: ({ colors, labels, content, updatedAt, isBookmarked }) => {},
  editNote: (id, { colors, labels, content, updatedAt, isBookmarked }) => {},
  deleteNote: (id) => {},
  restoreNote: ({
    id,
    color,
    labelIds,
    content,
    updatedAt,
    isBookmarked,
  }) => {},
  trashNote: (id) => {},
  addLabel: ({ label }) => {},
  updateLabel: (id, { label }) => {},
  deleteLabel: (id) => {},
});

function noteReducer(state, action) {
  switch (action.type) {
    case "ADD_NOTE":
      const id = new Date().toString() + Math.random().toString();
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            id,
            colors: action.payload.colors,
            labels: action.payload.labels,
            content: action.payload.content,
            updatedAt: action.payload.updatedAt,
            isBookmarked: action.payload.isBookmarked,
          },
        ],
      };
    case "EDIT_NOTE":
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id
            ? { ...note, ...action.payload.data }
            : note
        ),
      };
    case "DELETE_NOTE":
      const deletedNote = state.notes.find(
        (note) => note.id === action.payload.id
      );
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload.id),
        trash: [...state.trash, deletedNote],
      };
    case "RESTORE_NOTE":
      return {
        ...state,
        trash: state.trash.filter((note) => note.id !== action.payload.id),
        notes: [...state.notes, action.payload],
      };
    case "TRASH_NOTE":
      const trashedNote = state.notes.find(
        (note) => note.id === action.payload.id
      );
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload.id),
        trash: [...state.trash, trashedNote],
      };
    case "ADD_LABEL":
      return {
        ...state,
        labels: [
          ...state.labels,
          {
            id: new Date().toString() + Math.random().toString(),
            label: action.payload.label,
          },
        ],
      };
    case "UPDATE_LABEL":
      return {
        ...state,
        labels: state.labels.map((label) =>
          label.id === action.payload.id
            ? { ...label, label: action.payload.label }
            : label
        ),
      };
    case "DELETE_LABEL":
      return {
        ...state,
        labels: state.labels.filter((label) => label.id !== action.payload.id),
      };

    default:
      return state;
  }
}

function NoteProvider({ children }) {
  const [state, dispatch] = useReducer(noteReducer, {
    notes: NOTES,
    trash: TRASH,
    colors: COLORS,
    labels: LABELS,
  });

  function addNote({ colors, labels, content, updatedAt, isBookmarked }) {
    dispatch({
      type: "ADD_NOTE",
      payload: { colors, labels, content, updatedAt, isBookmarked },
    });
  }

  function editNote(id, data) {
    dispatch({
      type: "EDIT_NOTE",
      payload: { id, data },
    });
  }

  function deleteNote(id) {
    dispatch({
      type: "DELETE_NOTE",
      payload: { id },
    });
  }

  function restoreNote(note) {
    dispatch({
      type: "RESTORE_NOTE",
      payload: note,
    });
  }

  function trashNote(id) {
    dispatch({
      type: "TRASH_NOTE",
      payload: { id },
    });
  }
  function addLabel({ label }) {
    dispatch({
      type: "ADD_LABEL",
      payload: { label },
    });
  }

  function updateLabel(id, { label }) {
    dispatch({
      type: "UPDATE_LABEL",
      payload: { id, label },
    });
  }

  function deleteLabel(id) {
    dispatch({
      type: "DELETE_LABEL",
      payload: { id },
    });
  }

  return (
    <NoteContext.Provider
      value={{
        notes: state.notes,
        trash: state.trash,
        colors: state.colors,
        labels: state.labels,
        addNote,
        editNote,
        deleteNote,
        restoreNote,
        trashNote,
        addLabel,
        updateLabel,
        deleteLabel,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}

export { NoteProvider, NoteContext };
