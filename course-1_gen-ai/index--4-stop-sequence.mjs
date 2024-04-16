import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'

/*
Stop sequence: A sequence of characters that, when encountered, will cause the AI to stop generating further responses.
 */

dotenv.config({path: path.resolve('./.env')});

let openai = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY
    }
)

const messages = [
    {
        role: 'system',
        content: 'You are a helpful assistant that knows a lot about books.'
    },
    {
        role: 'user',
        content: 'Recommend me some books about learning to code.'
    }
]

const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages,
})

console.log(response.choices[0].message.content)
/*
    Sure! Here are some highly recommended books for learning how to code:

    1. "Python Crash Course" by Eric Matthes - A beginner-friendly guide to Python, one of the most popular programming languages.

    2. "Eloquent JavaScript" by Marijn Haverbeke - A comprehensive introduction to JavaScript, perfect for beginners.

    3. "Automate the Boring Stuff with Python" by Al Sweigart - Teaches practical programming for total beginners using Python.

    4. "Clean Code: A Handbook of Agile Software Craftsmanship" by Robert C. Martin - Focuses on writing clean, maintainable code principles that every coder should know.

    5. "JavaScript: The Good Parts" by Douglas Crockford - A concise guide to the most important parts of JavaScript programming language.

    6. "HTML and CSS: Design and Build Websites" by Jon Duckett - A beautifully designed book that covers the fundamentals of HTML and CSS for web development.

    These books cover a range of programming languages and concepts, so hopefully, you can find one that suits your needs!
*/

 // -----------------------------------------------------------------------------------------------------------------------------------------

 const messages1 = [
    {
        role: 'system',
        content: 'You are a helpful assistant that knows a lot about books.'
    },
    {
        role: 'user',
        content: 'Recommend me some books about learning to code.'
    }
]

const response1 = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages1,
    stop: ['3.']
})

console.log(response1.choices[0].message.content)
/*
Sure! Here are some highly recommended books for learning to code:

1. "Python Crash Course" by Eric Matthes - This book is perfect for beginners and covers the basics of Python programming language in a clear and concise manner.

2. "Eloquent JavaScript" by Marijn Haverbeke - This book is great for those interested in learning JavaScript, a popular programming language for web development.
*/

 // -----------------------------------------------------------------------------------------------------------------------------------------

 const messages2 = [
    {
        role: 'system',
        content: 'You are a helpful assistant that knows a lot about books.'
    },
    {
        role: 'user',
        content: 'Recommend me some books about learning to code.'
    }
]

const response2 = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages2,
    stop: ['\n']
})

console.log(response2.choices[0].message.content)
/*
    Certainly! Here are some highly recommended books for learning to code:
*/