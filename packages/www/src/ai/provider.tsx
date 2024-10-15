'use server'
import { createAI } from 'ai/rsc'
import OpenAI from 'openai'
import type { ReactNode } from 'react'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

export async function confirmPurchase (
  symbol: string,
  price: number,
  amount: number
) {
  'use server'
  // todo
}

export async function submitUserMessage (content: string) {
  'use server'
  // todo
}

const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id?: string;
  name?: string;
}[] = []

const initialUIState: {
  id: number;
  display: ReactNode;
}[] = []

export const AI = createAI({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState,
  initialAIState
})
