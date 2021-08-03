import * as faceapi from 'face-api.js';

export const loadModels = async () => {
    const MODEL_URL = process.env.PUBLIC_URL + '/models';
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    await faceapi.loadMtcnnModel(MODEL_URL);
}

export const getFullFaceDescriptions = async (blob, inputSize = 512) => {
    const mtcnnForwardParams = {
        minFaceSize: 50,
    }
    console.log(blob)
    const options = new faceapi.MtcnnOptions(mtcnnForwardParams);

    let img = await faceapi.fetchImage(blob)


    const fullFaceDescriptions = await faceapi.detectAllFaces(img, options)
        .withFaceLandmarks().withFaceDescriptors();

    /*  if (!fullFaceDescription) {
         throw new Error(`no faces detected for ${label}`)
     } */
    return fullFaceDescriptions;
}


export const createMatcher = (data) => {

    let labeledDescriptors = data.map((member) => (
        new faceapi.LabeledFaceDescriptors(
            member.name,
            member.descriptors.map((descriptor) => (
                new Float32Array(descriptor)
            ))
        )
    ));

    console.log('labeled descriptors', labeledDescriptors)

    let faceMatcher = new faceapi.FaceMatcher(
        labeledDescriptors,
        0.5
    );
    return faceMatcher;
}