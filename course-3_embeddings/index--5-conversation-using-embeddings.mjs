import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve('./.env') });


// SUPABASE VECTOR DB CONNECTION
// vector extsnion in SUPABASE DB enabled.

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// ------------------------------------------------


const openai = new OpenAI();

// User query about podcasts
const query = "An episode Elon Musk would enjoy";
main(query);

// Bring all function calls together
/**
 * Performs a series of actions to find the nearest match to a given input query in a vector database, and then generates a chat completion response based on that match.
 *
 * @param {string} input - The user's input query to search for in the vector database.
 * @returns {Promise<void>} - A Promise that resolves when the chat completion response has been generated.
 */
async function main(input) {
  const embedding = await createEmbedding(input);
  const match = await findNearestMatch(embedding);
  await getChatCompletion(match, input);
}

// Create an embedding vector representing the input text
/**
 * Creates an embedding vector representation of the given input text using the OpenAI text-embedding-ada-002 model.
 *
 * @param {string} input - The input text to create an embedding for.
 * @returns {Promise<number[]>} - A Promise that resolves to the embedding vector for the input text.
 */
async function createEmbedding(input) {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input
  });
  return embeddingResponse.data[0].embedding;
}

// Query Supabase and return a semantically matching text chunk
/**
 * Finds the nearest matching text content in the Supabase vector database based on the provided embedding vector.
 *
 * @param {number[]} embedding - The embedding vector to use for finding the nearest match.
 * @returns {Promise<string>} - A Promise that resolves to the content of the nearest matching text in the vector database.
 */
async function findNearestMatch(embedding) {
  const { data } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: 0.50,
    match_count: 1
  });
  return data[0].content;
}

// Use OpenAI to make the response conversational
/**
 * Defines the initial system message for the chat completion response, which sets the tone and expectations for the AI assistant.
 */
const chatMessages = [{
  role: 'system',
  content: `You are an enthusiastic podcast expert who loves recommending podcasts to people You will be given two pieces of information - some context about podcasts episodes and a question.
   Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer.
   Please do not make up the answer.`
}];

/**
 * Generates a chat completion response using the OpenAI API based on the provided context and query.
 *
 * @param {string} text - The context text to use for generating the chat completion.
 * @param {string} query - The user's query to generate the chat completion for.
 * @returns {Promise<void>} - A Promise that resolves when the chat completion response has been generated and logged to the console.
 */
async function getChatCompletion(text, query) {
  chatMessages.push({
    role: 'user',
    content: `Context: ${text} Question: ${query}`
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: chatMessages,
    temperature: 0.5,
    frequency_penalty: 0.5
  });

  console.log(response.choices[0].message.content);
}




