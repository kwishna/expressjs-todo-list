import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

dotenv.config({ path: path.resolve('./.env') });


// SUPABASE VECTOR DB CONNECTION
// vector extsnion in SUPABASE DB enabled.

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const openai = new OpenAI();

/*
  Challenge: Text Splitters, Embeddings, and Vector Databases!
    1. Use LangChain to split the content in movies.txt into smaller chunks.
    2. Use OpenAI's Embedding model to create an embedding for each chunk.
    3. Insert all text chunks and their corresponding embedding
       into a Supabase database table.
 */

/* Split movies.txt into text chunks.
Return LangChain's "output" – the array of Document objects. */
async function splitDocument(document) {
    const text = fs.readFileSync(resolve('./course-3_embeddings/movies.txt')).toString('utf-8');
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 250,
        chunkOverlap: 35,
    });
    const output = await splitter.createDocuments([text]);
    return output;
}

/* Create an embedding from each text chunk.
Store all embeddings and corresponding text in Supabase. */
async function createAndStoreEmbeddings() {
    const chunkData = await splitDocument("movies.txt");
    const data = await Promise.all(
        chunkData.map(async (chunk) => {
            const embeddingResponse = await openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: chunk.pageContent
            });
            return {
                content: chunk.pageContent,
                embedding: embeddingResponse.data[0].embedding
            }
        })
    );
    await supabase.from('movies').insert(data);
    console.log('SUCCESS!');
}
createAndStoreEmbeddings();

// ------------------------------- Retriveing information from Supabase Vector DB -------------------------------

// Query about our movie data
const query = "Which movies can I take my child to?";
main(query);

async function main(input) {
    const embedding = await createEmbedding(input);
    const match = await findNearestMatch(embedding);
    await getChatCompletion(match, input);
}

// Create an embedding vector representing the query
async function createEmbedding(input) {
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input
    });
    return embeddingResponse.data[0].embedding;
}

/*
  Challenge: Return and manage multiple matches
    - Return at least 3 matches from the database table
    - Combine all of the matching text into 1 string
*/

// Query Supabase and return a semantically matching text chunk
/**
* Finds the nearest movie matches to the provided embedding.
*
* @param {number[]} embedding - The embedding vector to match against.
* @returns {string} - A string containing the matched movie titles, separated by newlines.
*/
async function findNearestMatch(embedding) {
    const { data } = await supabase.rpc('match_movies', {
        query_embedding: embedding,
        match_threshold: 0.50,
        match_count: 4
    });

    // Manage multiple returned matches
    const match = data.map(obj => obj.content).join('\n');
    console.log(match);
    return match;
}

// Use OpenAI to make the response conversational
const chatMessages = [{
    role: 'system',
    content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a question. Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.`
}];

/**
* Generates a conversational response using OpenAI's GPT-4 model based on the provided context and query.
*
* @param {string} text - The context text to include in the chat message.
* @param {string} query - The user's query to respond to.
* @returns {Promise<void>} - A Promise that resolves when the response has been logged to the console.
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