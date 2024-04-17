import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HF_TOKEN)

const model = "ghoskno/Color-Canny-Controlnet-model"

const oldImageUrl = "/old-photo.jpeg"

const oldImageResponse = await fetch(oldImageUrl)
const oldImageBlob = await oldImageResponse.blob()

const newImageBlob = await hf.imageToImage({
  model: model,
  inputs: oldImageBlob
})

// const newImageBase64 = Buffer.from(newImageBlob).toString('base64');

// ----------------------------------------------------------------------

const model1 = "ghoskno/Color-Canny-Controlnet-model"

const oldImageUrl1 = "/old-photo.jpeg"
const oldImageResponse1 = await fetch(oldImageUrl1)
const oldImageBlob1 = await oldImageResponse1.blob()

const prompt = `An elderly couple walks together on a gravel path with green 
grass and trees on each side. Wearing neutral-colored clothes, they face away
 from the camera as they carry their bags.`

const newImageBlob1 = await hf.imageToImage({
  model: model1,
  inputs: oldImageBlob1,
  parameters: {
    prompt: prompt,
    negative_prompt: "Black and white photo. text, bad anatomy, blurry, low quality",
    // Between 0 and 1
    strength: 0,
  }
})

const newImageBase64 = await blobToBase64(newImageBlob1)
// const newImageBase64 = Buffer.from(newImageBase64).toString('base64');