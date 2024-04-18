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

// Run the above command in SQL Editor in Supabase to create document/table.

// ------------------------------------------------


const openai = new OpenAI();

const content = [
  "Beyond Mars (1 hr 15 min): Join space enthusiasts as they speculate about extraterrestrial life and the mysteries of distant planets.",
  "Jazz under stars (55 min): Experience a captivating night in New Orleans, where jazz melodies echo under the moonlit sky.",
  "Mysteries of the deep (1 hr 30 min): Dive with marine explorers into the uncharted caves of our oceans and uncover their hidden wonders.",
  "Rediscovering lost melodies (48 min): Journey through time to explore the resurgence of vinyl culture and its timeless appeal.",
  "Tales from the tech frontier (1 hr 5 min): Navigate the complex terrain of AI ethics, understanding its implications and challenges.",
  "The soundscape of silence (30 min): Traverse the globe with sonic explorers to find the world's most serene and silent spots.",
  "Decoding dreams (1 hr 22 min): Step into the realm of the subconscious, deciphering the intricate narratives woven by our dreams.",
  "Time capsules (50 min): Revel in the bizarre, endearing, and profound discoveries that unveil the quirks of a century past.",
  "Frozen in time (1 hr 40 min): Embark on an icy expedition, unearthing secrets hidden within the majestic ancient glaciers.",
  "Songs of the Sea (1 hr): Dive deep with marine biologists to understand the intricate whale songs echoing in our vast oceans."
];

// async function storeEmbeddingInSupabaseVectorDB(input) {
//   await Promise.all(
//     input.map(async (textChunk) => {
//       const embeddingResponse = await openai.embeddings.create({
//         model: "text-embedding-ada-002",
//         input: textChunk
//       });

//       // 'document' is created in the supabase db.
//       await supabase.from('documents').insert({
//         content: textChunk,
//         embedding: embeddingResponse.data[0].embedding
//       });
//     })
//   );
//   console.log('Embedding complete!');
// }
// storeEmbeddingInSupabaseVectorDB(content).then();

/**
 * Stores text embeddings in a Supabase vector database.
 *
 * This function takes an array of text content, generates embeddings for each
 * using the OpenAI text-embedding-ada-002 model, and inserts the content and
 * embeddings into a Supabase database table named 'documents'.
 *
 * @param {string[]} input - An array of text content to be embedded and stored.
 * @returns {Promise<void>} - A promise that resolves when the embedding and
 *                           storage process is complete.
 */
async function storeEmbeddingInSupabaseVectorDB(input) {
  const data = await Promise.all(
    input.map(async (textChunk) => {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: textChunk
      });
      return {
        content: textChunk,
        embedding: embeddingResponse.data[0].embedding
      }
    })
  );
  // Insert content and embedding into Supabase
  await supabase.from('documents').insert(data);// We can insert single data or an array of data.
  console.log('Embedding and storing complete!');
}

storeEmbeddingInSupabaseVectorDB(content)

/*

Read all rows:-

let { data: documents, error } = await supabase
  .from('documents')
  .select('*')

  ---------------------------------------

Read specific columns:-

let { data: documents, error } = await supabase
  .from('documents')
  .select('some_column,other_column')

  ----------------------------------------

Read referenced tables:-

let { data: documents, error } = await supabase
  .from('documents')
  .select(`
    some_column,
    other_table (
      foreign_key
    )
  `)
  ------------------------------------------

With pagination:-

let { data: documents, error } = await supabase
  .from('documents')
  .select('*')
  .range(0, 9)

  ------------------------------------------

Filtering
Documentation
Supabase provides a wide range of filters

With filtering:-

let { data: documents, error } = await supabase
  .from('documents')
  .select("*")

  // Filters
  .eq('column', 'Equal to')
  .gt('column', 'Greater than')
  .lt('column', 'Less than')
  .gte('column', 'Greater than or equal to')
  .lte('column', 'Less than or equal to')
  .like('column', '%CaseSensitive%')
  .ilike('column', '%CaseInsensitive%')
  .is('column', null)
  .in('column', ['Array', 'Values'])
  .neq('column', 'Not equal to')

  // Arrays
  .contains('array_column', ['array', 'contains'])
  .containedBy('array_column', ['contained', 'by'])

  ------------------------------------------

Insert rows
Documentation
insert lets you insert into your tables. You can also insert in bulk and do UPSERT.

insert will also return the replaced values for UPSERT.

Insert a row:-

const { data, error } = await supabase
  .from('documents')
  .insert([
    { some_column: 'someValue', other_column: 'otherValue' },
  ])
  .select()

  ------------------------------------------

Insert many rows:-

const { data, error } = await supabase
  .from('documents')
  .insert([
    { some_column: 'someValue' },
    { some_column: 'otherValue' },
  ])
  .select()

  ------------------------------------------

Upsert matching rows:-

const { data, error } = await supabase
  .from('documents')
  .upsert({ some_column: 'someValue' })
  .select()

  ------------------------------------------

Update rows
Documentation
update lets you update rows. update will match all rows by default. You can update specific rows using horizontal filters, e.g. eq, lt, and is.

update will also return the replaced values for UPDATE.

Update matching rows:-

const { data, error } = await supabase
  .from('documents')
  .update({ other_column: 'otherValue' })
  .eq('some_column', 'someValue')
  .select()

  ------------------------------------------
Delete rows
Documentation
delete lets you delete rows. delete will match all rows by default, so remember to specify your filters!

Delete matching rows:-

const { error } = await supabase
  .from('documents')
  .delete()
  .eq('some_column', 'someValue')

  ------------------------------------------

Subscribe to changes
Documentation
Supabase provides realtime functionality and broadcasts database changes to authorized users depending on Row Level Security (RLS) policies.

Subscribe to all events:-

const channels = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'documents' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

  ------------------------------------------
Subscribe to inserts:-

const channels = supabase.channel('custom-insert-channel')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'documents' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

  ------------------------------------------
Subscribe to updates:-

const channels = supabase.channel('custom-update-channel')
  .on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'documents' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

  ------------------------------------------
Subscribe to deletes:-

const channels = supabase.channel('custom-delete-channel')
  .on(
    'postgres_changes',
    { event: 'DELETE', schema: 'public', table: 'documents' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

  ------------------------------------------
Subscribe to specific rows:-

const channels = supabase.channel('custom-filter-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'documents', filter: 'some_column=eq.some_value' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

*/