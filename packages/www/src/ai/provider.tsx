"use server";
import { createAI } from "ai/rsc";

const initialAIState = {}

const initialUIState = {}

export const AI = createAI({
  actions: {},
  initialUIState,
  initialAIState,
});
