// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// imputImageId: img element id
// resultId: 결과값 받을 element id, innerHTML로 넣어줌
// labelDivId(선택): 모든 라벨에 대한 결과값 출력해줄 Div element id,
//                   라벨수만큼 child Div 만들어서 넣어줌, 안 넣어도 됨
async function predictAnimalType(gender, inputImageId, resultId, labelDivId = "") {
    const image = document.getElementById(inputImageId);
    const resultElement = document.getElementById(resultId);
    const labelContainer = document.getElementById(labelDivId);
    // 모델 더 학습시켜서 URL만 바꿔주면 됨
    let URL;
    if(gender = "man") URL = "https://teachablemachine.withgoogle.com/models/nSBlmAddW/";
    else URL = "https://teachablemachine.withgoogle.com/models/nSBlmAddW/";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    const model = await tmImage.load(modelURL, metadataURL);
    const maxPredictions = model.getTotalClasses();

    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(image, false);

    // 가장 높은 라벨 찾아서 element에 넣어줌
    let maxProb = 0;
    let result = "";
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability <= maxProb) continue;
        maxProb = prediction[i].probability;
        result = prediction[i].className;
    }
    resultElement.innerHTML = result;

    // 전체 결과에 대해 label element에 넣어줌
    if(!labelContainer) return;
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.appendChild(document.createElement("div"));
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}