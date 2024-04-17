import { HfInference } from '@huggingface/inference'

// Create your Hugging Face Token: https://huggingface.co/settings/tokens
const hf = new HfInference(process.env.HF_TOKEN)
const textToClassify = "I just bought a new camera. It's the best camera I've ever owned!"

const response = await hf.textClassification({
    model: "distilbert-base-uncased-finetuned-sst-2-english",
    inputs: textToClassify
})

console.log(response)
// [{label: "POSITIVE", score: 0.9998621940612793}, {label: "NEGATIVE", score: 0.00013772840611636639}]


// ------------------------------------------------------------------------------------------------

const textToClassify1 = "I just bought a new camera. It's been a real disappointment."

const response1 = await hf.textClassification({
    model: "distilbert-base1-uncased-finetuned-sst-2-english",
    inputs: textToClassify1
})

console.log(response1[0].label)
console.log(response1)

// ---------------------------------------------------------------------------------------------------

const textToClassify2 = "I just bought a new camera. It's been a real disappointment."

const response2 = await hf.textClassification({
    model: "SamLowe/roberta-base-go_emotions",
    inputs: textToClassify2
})

console.log(response2[0].label)
console.log(response2)

// ----------------------------------------------------------------------------------------------------

const textToTranslate = "It's an exciting time to be an AI engineer"

// https://huggingface.co/facebook/mbart-large-50-many-to-many-mmt#languages-covered

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