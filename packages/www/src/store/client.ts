"use client";
import { atom } from "jotai";

type Note = {
  id: string;
  title: string;
  content: string;
};

export const notesAtom = atom<Note[]>([]);
