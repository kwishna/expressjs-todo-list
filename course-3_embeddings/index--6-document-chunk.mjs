import { resolve } from 'path'
import fs from 'fs'

/*
    We should chunk the documents into smaller parts so that the embedding models could understand the context better.
    In a very large texts, it is difficult to understand the context correctly.

    OpenAI embedding model `max input token` is 8191 tokens, and `output diumensions` is 1536 tokens.

    Effective chunking:-
     - Ensure the content is free from irrelevant informations.
     - It doesn't have HTML tags, unwanted symbols.
     - No Spelling mistakes.
     - No repeated texts, correct formattings.
     - Free from Hate, Biases, violence, threats etc.
 */


import { CharacterTextSplitter } from "langchain/text_splitter";

// LangChain text splitter
/**
* Splits a document into smaller chunks of text.
*
* This function reads a text file located at `./course-3_embeddings/podcast.txt`, splits the text into smaller chunks using a `CharacterTextSplitter`, and logs the number of resulting chunks.
*
* @returns {Promise<void>} - A Promise that resolves when the document has been split and the chunk count has been logged.
*/
async function splitDocument() {
    const text = fs.readFileSync(resolve('./course-3_embeddings/podcast.txt')).toString('utf-8');

    const splitter = new CharacterTextSplitter({
        separator: " ", // The separator property is used to specify the character that will be used to split the input text into chunks.
        chunkSize: 150, // The chunkSize property specifies the maximum size of each text chunk that will be generated when splitting the input document.
        chunkOverlap: 15, // The chunkOverlap property in the JavaScript code snippet controls the amount of overlap between consecutive text chunks when splitting the input document.
        // This overlap helps provide more context when processing consecutive chunks, compared to no overlap.
    });
    const output = await splitter.createDocuments([text]);
    console.log(output.length);
    console.log(output[0]);
}
splitDocument()

// ------------------------------------------------------------------------

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// LangChain text splitter
async function splitDocumentRecursive() {
  const response = await fetch('podcasts.txt');
  const text = await response.text();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 150,
    chunkOverlap: 15,
  });
  const output = await splitter.createDocuments([text]);
  console.log(output);
}
splitDocumentRecursive()

/*
    The main differences between RecursiveCharacterTextSplitter and CharacterTextSplitter in LangChain are:

    RecursiveCharacterTextSplitter splits text recursively into chunks, while CharacterTextSplitter does it in a single pass.

    RecursiveCharacterTextSplitter can handle very large documents better by recursively splitting into smaller chunks. CharacterTextSplitter may struggle with very large docs.

    RecursiveCharacterTextSplitter is slower as it has to recursively split text multiple times. CharacterTextSplitter is faster in a single pass.

    RecursiveCharacterTextSplitter allows more fine-grained control over the chunking process through parameters like chunkSize and chunkOverlap. CharacterTextSplitter has less flexibility.

    The main advantages of RecursiveCharacterTextSplitter:

    Handles very large documents better through recursive splitting.

    More flexibility in controlling chunk size and overlap.

    Can generate more coherent chunks by recursively splitting.

    The main advantages of CharacterTextSplitter:

    Faster and simpler single pass splitting.

    Easier to use with just separator and chunkSize parameters.

    May be sufficient for smaller documents.
*/