import { listModels } from "@huggingface/hub";

const token = process.env.HF_TOKEN

// HuggingFace.js Hub Docs: https://huggingface.co/docs/huggingface.js/hub/README

for await (const model of listModels({
    credentials: {
        accessToken: token
    },
    search: {
        task: "text-generation"
    }
})) {
    console.log(model)
    // Output:    
    /* {
        id: '621ffdc036468d709f174340',
        name: 'Salesforce/ctrl',
        private: false,
        task: 'text-generation',
        downloads: 10709,
        gated: false,
        likes: 8,
        updatedAt: 2024-02-19T11:09:30.000Z
      }
    */      
    break
}

 //---------------------------------------------------------------------------------- 
async function isModelInferenceEnabled(modelName) {
    const response = await fetch(`https://api-inference.huggingface.co/status/${modelName}`)
    const data = await response.json()
    return data.state == "Loadable"
}

const models = []

for await (const model of listModels({
    credentials: {
        accessToken: token
    },
    search: {
        task: "text-to-image"
    }
})) {

    // Filter Models:-
    if (model.likes < 2000) {
        continue
    } 
    
    if (await isModelInferenceEnabled(model.name)) {
        models.push(model)
    }
}

// Sort Model:-

models.sort((model1, model2) => model2.likes - model1.likes)
for (const model of models) {
    console.log(`${model.likes} Likes: https://huggingface.co/${model.name}`)
}