import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.resolve('./.env')});

let openai = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY
    }
)

const response = await openai.images.generate({
    model: 'dall-e-3', // default dall-e-2
    prompt: "A 16th-century woman with long brown hair standing in front of a green vista with cloudy skies. She's looking at the viewer with a faint smile on her lips",
    n: 1, //default 1 
    size: '1024x1024', //default 1024x1024
    style: 'vivid', //default vivid (other option: natural)
    response_format: 'url' //default url
})

console.log(response)

/* 
{
    created: 1700237567,
    data: [
            {
                revised_prompt: "A Hispanic woman from the 16th-century with long brown hair stands in front of a sprawling green vista with cloudy skies. Her gaze meets the viewer's, a subtle smile playing on her lips. She embodies the grace and elegance of the era, her attire reflecting the styles prevalent then. This tranquil scene serves as a window into the peaceful simplicity of life during the 16th-century.",
                url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-hILmMJhWE2V3rB3oGuJuRWMy/user-I0qPVFPrrQZwfgP5K9Y2F5yN/img-INu2UYiVwWiStxqueMwk79WR.png?st=2023-11-17T15%3A12%3A47Z&se=2023-11-17T17%3A12%3A47Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-11-17T02%3A36%3A47Z&ske=2023-11-18T02%3A36%3A47Z&sks=b&skv=2021-08-06&sig=SuYbsaRv5yLp35j2nBWfDT%2BzB5/Rnya2JoiIr3qUwdE%3D"
            }
        ]
}
*/

// -------------------------------------------------------------------------------------------------------------------------------------------------------------


const response1 = await openai.images.generate({
    model: 'dall-e-2', // default dall-e-2
    prompt: prompt, //required
    n: 1, //default 1 
    size: '256x256', //default 1024x1024
    // style: 'natural', //default vivid (other option: natural)
    response_format: 'b64_json' //default url
})
console.log(response1)
base_64_image = `data:image/png;base64,${response1.data[0].b64_json}`
