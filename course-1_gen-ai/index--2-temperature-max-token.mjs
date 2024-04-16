import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.resolve('./.env')});

const openai = new OpenAI()

let messages = [
  {
      role: 'system',
      content: 'You are a helpful assistant that explains things in language a 10-year-old can understand. Your answers are always less than 100 words.'
  },
  {
      role: 'user',
      content: 'What is Quantum Computing?'
  }
]

let response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: messages,
  max_tokens: 16, // default: inf,
  temperature: 2, // min: 0, max: 2
})

console.log(response.choices[0].message.content) // Quantum Computing is like, a Super Sorcerer-focused secret_switch designing–mix