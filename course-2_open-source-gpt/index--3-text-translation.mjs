import { HfInference } from '@huggingface/inference'

// Create your Hugging Face Token: https://huggingface.co/settings/tokens
const hf = new HfInference(process.env.HF_TOKEN)

const textToTranslate = "It's an exciting time to be an AI engineer"

const textTranslationResponse3 = await hf.translation({
  model: 'facebook/mbart-large-50-many-to-many-mmt',
  inputs: textToTranslate,
  parameters: {
      src_lang: "en_US",
      tgt_lang: "hi_IN"
  }
})

const translation = textTranslationResponse3.translation_text
console.log("\ntranslation:\n")
console.log(translation)