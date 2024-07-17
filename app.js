// 모델 URL (Teachable Machine에서 복사한 모델 URL을 사용하세요)

const URL = "https://teachablemachine.withgoogle.com/models/YwuqaZUnd/";

let model, webcam, maxPredictions;

// 모델을 로드하고 웹캠을 설정하는 비동기 함수
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // 모델을 로드합니다
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // 웹캠을 설정합니다
    const flip = true; // 웹캠 이미지를 좌우 반전합니다
    webcam = new tmImage.Webcam(640, 480, flip); // width, height, flip
    await webcam.setup(); // 웹캠 설정 (카메라 접근 권한 필요)
    await webcam.play();
    window.requestAnimationFrame(loop);

    // 웹캠을 HTML 요소에 연결합니다
    document.getElementById("webcam").appendChild(webcam.canvas);
}

// 예측을 반복적으로 수행하는 함수
async function loop() {
    webcam.update(); // 웹캠 이미지를 업데이트합니다
    await predict();
    window.requestAnimationFrame(loop);
}

// 예측을 수행하는 함수
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let highestPrediction = prediction[0];
    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > highestPrediction.probability) {
            highestPrediction = prediction[i];
        }
    }
    document.getElementById("result").innerText = `결과: ${highestPrediction.className} (${(highestPrediction.probability * 100).toFixed(2)}%)`;
}

// 페이지 로드 후 init 함수를 호출합니다
window.addEventListener("load", init);
