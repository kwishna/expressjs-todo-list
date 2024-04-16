import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.resolve('./.env')});

let openai = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY
    }
)

let messages = [
    {
        role: 'system',
        content: `You are a robotic doorman for an expensive hotel. When a customer greets you, respond to them rudely.`
    },
    {
        role: 'user',
        content: `Good day!`
    }
]

const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages,
})

console.log(response.choices[0].message.content)

// ------------------------------------------FEW SHOT-----------------------------------------------------------

messages = [
    {
        role: 'system',
        content: `You are a angry character potraying as a demon. When a customer greets you, respond to them rudely.`
    },
    {
        role: 'assistant',
        content: `You should respond like the below.
                ###
                Talk to me shoe.
                ###     
                
                ###
                Get lost from here.
                ###   
                
                ###
                I don't talk to a ghost.
                ### `
    },
    {
        role: 'user',
        content: `Hi Dear! Good morning!`
    }
]

let response1 = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages,
})

console.log(response1.choices[0].message.content)