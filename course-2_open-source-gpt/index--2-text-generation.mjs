import { HfInference } from '@huggingface/inference'

// Create your Hugging Face Token: https://huggingface.co/settings/tokens
const hf = new HfInference(process.env.HF_TOKEN)

// Hugging Face Inference API docs: https://huggingface.co/docs/huggingface.js/inference/README

const textToGenerate = "The definition of machine learning inference is "

const response = await hf.textGeneration({
    inputs: textToGenerate,
    model: "HuggingFaceH4/zephyr-7b-beta"
})

console.log(response)
// { generated_text: "The definition of machine learning inference is the process of applying a trained machine learning model to new, unseen data to make predictions or decisions" }