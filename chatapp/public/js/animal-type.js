// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel

let model, animalTypeContainer, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init(gender) {
  let URL;
  if (gender === 'man') URL = "https://teachablemachine.withgoogle.com/models/KKFX8PVPV/"
  else URL = "https://teachablemachine.withgoogle.com/models/WDy6sw0EE/";
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  labelContainer = document.getElementById("label-container");
  animalTypeContainer = document.getElementById("animal-type-container");
}

async function predict(inputImage) {
  // inputImage = new Image();
  // inputImage.src = "https://newsimg.sedaily.com/2019/09/24/1VODDC54BJ_1.jpg"
  // animalTypeContainer.appendChild(inputImage);
  // inputImage = document.getElementById("inputImage");

  const prediction = await model.predict(inputImage);
  let maxProbability = 0;
  let bestPrediction = undefined;
  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability > maxProbability) {
      maxProbability = prediction[i].probability;
      bestPrediction = prediction[i].className;
    }
  }

  return bestPrediction;
}

// function waitForModel() {
//   if (typeof model !== "undefined") {
//     return;
//   }
//   else {
//     console.log("waiting for tensorflow model initialization...");
//     setTimeout(waitForModel, 250);
//   }
// }


async function predictImage(inputImage, gender) {
  await init(gender);
  const prediction = await predict(inputImage);
  return prediction;
}
