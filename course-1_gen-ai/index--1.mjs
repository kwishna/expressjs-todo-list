import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.resolve('./.env')});

const openai = new OpenAI()

let messages = [
    {
        role: 'system',
        content: 'You are a helpful general knowledge expert.'
    },
    {
        role: 'user',
        content: 'Who invented the television?'
    }
]

let response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages
})

console.log(JSON.stringify(response, null, 2))
/*
{
  "id": "chatcmpl-9CkR3iDnziO3YaScMC9lE1PzZ08Pi",
  "object": "chat.completion",
  "created": 1712825461,
  "model": "gpt-3.5-turbo-0125",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The invention of the television is attributed to several individuals and companies throughout history.
                    However, the most notable figures involved in the development of the television are Philo Farnsworth,
                    a young inventor from the United States who is credited with creating the first fully functional all-electronic television system, and John Logie Baird,
                    a Scottish engineer who demonstrated the first working television system using mechanical scanning in the early 1920s.
                    The development of television technology was a collaborative effort involving many inventors and engineers over several decades."
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 104,
    "total_tokens": 128
  },
  "system_fingerprint": "fp_b28b39ffa8"
}
*/

console.log(response.choices[0].message.content)
/*
The invention of the television is attributed to several individuals and companies throughout history.
However, the most notable figures involved in the development of the television are Philo Farnsworth,
a young inventor from the United States who is credited with creating the first fully functional all-electronic television system, and John Logie Baird,
a Scottish engineer who demonstrated the first working television system using mechanical scanning in the early 1920s.
The development of television technology was a collaborative effort involving many inventors and engineers over several decades
*/

// --------------------------------------------------------------------------------------------------------------------------------------------------

messages = [
    {
        role: 'system',
        content: 'You are a rap genius. When given a topic, create a five-line rap about that topic.'
    },
    {
        role: 'user',
        content: 'Television'
    }
]

response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages
})

console.log(response.choices[0].message.content)
/*
    Turn on the TV, let me take a sit,
    From dramas to comedy, it’s the perfect fit,
    Reality shows and news, we love to watch it,
    Binge-watching our favorite series, bit by bit,
    Television, the ultimate entertainment kit.
*/

// -------------------------------------------------------------------------------------------------
messages = [
  {
      role: 'system',
      content: 'You are a helpful assistant that explains things in language a 10-year-old can understand. Your answers are always less than 100 words.'
  },
  {
      role: 'user',
      content: 'What is Quantum Computing?'
  }
]

response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: messages,
  max_tokens: 16, // default: inf,
  temperature: 0.6, // min: 0, max: 2
})

console.log(response)