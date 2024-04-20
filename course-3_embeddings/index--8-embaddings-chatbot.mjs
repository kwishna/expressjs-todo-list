import { dates } from '/utils/dates'
import OpenAI from "openai"
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve('./.env') });

const form = document.querySelector('form');
const input = document.querySelector('input');
const reply = document.querySelector('.reply');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    main(input.value);
    input.value = '';
});

/**
 * Executes the main function.
 *
 * @param {any} input - the input parameter for the main function
 * @return {Promise<void>} - a Promise that resolves when the main function completes
 */
async function main(input) {
  try {
    reply.innerHTML = "Thinking..."
    const embedding = await createEmbedding(input);
    const match = await findNearestMatch(embedding);
    await getChatCompletion(match, input);
  } catch (error) {
     console.error('Error in main function.', error.message);
     reply.innerHTML = "Sorry, something went wrong. Please try again.";
  }
}

// Create an embedding vector representing the query
async function createEmbedding(input) {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input
  });
  return embeddingResponse.data[0].embedding;
}

// Query Supabase and return a semantically matching text chunk
async function findNearestMatch(embedding) {
  const { data } = await supabase.rpc('match_movies', {
    query_embedding: embedding,
    match_threshold: 0.50,
    match_count: 4
  });
  
  // Manage multiple returned matches
  const match = data.map(obj => obj.content).join('\n');
  return match;
}

// Use OpenAI to make the response conversational
const chatMessages = [{
    role: 'system',
    content: `You are an enthusiastic chatbot who loves answering to the queries of the people.
    You will be given two pieces of information - some context and a question.
    Your main job is to formulate a short answer to the question using the provided context.
    If the answer is not given in the context, find the answer in the conversation history if possible.
    If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.` 
}];

async function getChatCompletion(text, query) {
  chatMessages.push({
    role: 'user',
    content: `Context: ${text} Question: ${query}`
  });
  
  const { choices } = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: chatMessages,
    temperature: 0.65,
    frequency_penalty: 0.5
  });

  chatMessages.push(choices[0].message);
  reply.innerHTML = choices[0].message.content;
}
