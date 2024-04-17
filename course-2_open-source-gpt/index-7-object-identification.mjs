
import { pipeline } from '@xenova/transformers'

const image = "./images.png"

const detector = await pipeline('object-detection', 'Xenova/yolos-tiny')

const detectedObjects = await detector(image, {
    threshold: 0.5,
    percentage: true
})

detectedObjects.forEach(object => {
    console.log(object)
})

// -------------------------------------------

const detector1 = await pipeline('object-detection', 'Xenova/yolos-tiny')

const detectedObjects1 = await detector1(image.src, {
    threshold: 0.95,
    percentage: true
});

detectedObjects1.forEach(obj => {
    console.log(obj)
})