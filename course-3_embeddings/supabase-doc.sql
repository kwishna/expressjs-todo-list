/**
 * Creates a table to store documents, with a unique identifier, the document content, and a vector representation of the document (e.g. an embedding).
 * The `id` column is a unique primary key for each document.
 * The `content` column stores the full text of the document.
 * The `embedding` column stores a vector representation of the document, which can be used for tasks like semantic search or document clustering.
 * The vector size of 1536 is suitable for OpenAI embeddings, but may need to be adjusted for other embedding models.
 */
create table documents (
    id bigserial primary key,
    content text,
    -- corresponds to the "text chunk"
    embedding vector(1536) -- 1536 works for OpenAI embeddings
);

-- Run the above command in SQL Editor in Supabase

--------------------------------------------------------------------------------------------
-- Create a function to search for documents
/**
 * Searches the `documents` table for the `match_count` documents that have the closest vector similarity to the provided `query_embedding`.
 * 
 * @param query_embedding - A vector representation of the search query.
 * @param match_threshold - The minimum cosine similarity score required for a document to be considered a match.
 * @param match_count - The maximum number of matching documents to return.
 * @returns A set of document IDs that match the search criteria.
 */
create or replace function match_documents (
        query_embedding vector(1536),
        match_threshold float,
        match_count int
    )
/**
* Returns a set of document IDs, their content, and the similarity score between the query embedding and the document embedding.
* The `id` column is the unique identifier for the document.
* The `content` column contains the full text of the document.
* The `similarity` column is the cosine similarity score between the query embedding and the document embedding, which ranges from 0 to 1.
* The results are ordered by the similarity score in descending order, with the most similar documents first.
*/
returns table (
    id bigint,
    content text,
    similarity float
)

language sql stable

/**
* Searches the `documents` table for the `match_count` documents that have the closest vector similarity to the provided `query_embedding`.
* 
* @param query_embedding - A vector representation of the search query.
* @param match_threshold - The minimum cosine similarity score required for a document to be considered a match.
* @param match_count - The maximum number of matching documents to return.
* @returns A set of document IDs, their content, and the similarity score between the query embedding and the document embedding. The results are ordered by the similarity score in descending order, with the most similar documents first.
*/
as $$
select documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) as similarity
from documents
where 1 - (documents.embedding <=> query_embedding) > match_threshold
order by similarity desc
  limit match_count;
$$;

-------------------------------------------------------------------