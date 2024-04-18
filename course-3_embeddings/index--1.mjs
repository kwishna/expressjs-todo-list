import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.resolve('./.env')});

const openai = new OpenAI();

/**
 * Generates an embedding for the input text using the "text-embedding-ada-002" model from OpenAI.
 *
 * @return {Promise<Object>} A promise that resolves to an object containing the embedding of the input text.
 */
async function generateEmbedding() {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: "Hello World!",
  });
  console.log(embedding);
}
generateEmbedding();

// ------------------------------------------------

/**
 * Asynchronously creates an embedding for the input text using the "text-embedding-ada-002" model from OpenAI and logs the length of the embedding.
 *
 * @return {Promise<void>} A promise that resolves when the embedding is created and the length of the embedding is logged.
 */
async function embeddingLength() {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: "Hello World!", // For any input. Embedding length will always be same = 1536.
    });
    console.log(embedding.data[0].embedding.length);
  }
  embeddingLength();

  // ------------------------------------------------


  const texts = [
    "Hello World!",
    "Puppy",
    "Loreum Ipsum",
  ]


/**
 * Asynchronously creates embeddings for an array of input texts using the "text-embedding-ada-002" model from OpenAI and logs the number of embeddings created.
 *
 * @param {string[]} texts - An array of input texts to generate embeddings for.
 * @return {Promise<void>} A promise that resolves when the embeddings are created and the number of embeddings is logged.
 */
async function embeddingArray() {
    const embedding = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: texts, // Generates embeddings for all.
    });
    console.log(embedding.data.length); // 3
}
  embeddingArray();

// -------------------------------------------------------------
