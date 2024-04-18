import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./.env') });

const openai = new OpenAI();

/*
  Challenge: Pair text with its embedding
    - For each text input, create an object with 
      a 'content' and 'embedding' property
    - The value of 'content' should be the text
    - The value of 'embedding' should be the vector embedding for that text
*/

const content = [
  "Beyond Mars: speculating life on distant planets.",
  "Jazz under stars: a night in New Orleans' music scene.",
  "Mysteries of the deep: exploring uncharted ocean caves.",
  "Rediscovering lost melodies: the rebirth of vinyl culture.",
  "Tales from the tech frontier: decoding AI ethics.",
];


/**
 * Generates embeddings for a list of text inputs using the OpenAI API.
 *
 * @param {string[]} input - An array of text inputs to generate embeddings for.
 * @returns {Promise<{ content: string, embedding: number[] }[]>} - An array of objects containing the text input and its corresponding embedding.
 */
async function encode1(input) {
  input.map(async (textChunk) => {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: textChunk,
    });
    const data = { content: textChunk, embedding: embeddingResponse.data[0].embedding }
    console.log(data);
  })
}
// encode1(content).then();

// ----------------------------------------------------------------
/**
 * Generates vector embeddings for a list of text inputs using the OpenAI API.
 *
 * @param {string[]} input - An array of text inputs to generate embeddings for.
 * @returns {Promise<{ content: string, embedding: number[] }[]>} - An array of objects containing the original text and its corresponding vector embedding.
 */
async function encode2(input) {
  return await Promise.all(
    input.map(async (textChunk) => {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: textChunk,
      });
      return { content: textChunk, embedding: embeddingResponse.data[0].embedding };
    })
  );
}
// encode2(content).then((data) => console.log(data));

// ------------------------------------------------