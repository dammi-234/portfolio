console.log("main.js 실행됨");
// main.js
window.addEventListener("load", () => {
  const bgm = document.getElementById("bgm");
  bgm.muted = false;
  bgm.volume = 0.7;

  bgm.play().catch((err) => {
    console.warn("브라우저가 자동재생을 차단했어요:", err);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const enterButton = document.querySelector('.enter-button');
  const character = document.querySelector('.character');
  const introContainer = document.querySelector('.intro');
  const portfolioContainer = document.querySelector('.container');

  enterButton.addEventListener('click', function () {
    // 텍스트와 버튼 서서히 사라짐
    enterButton.style.transition = 'opacity 0.5s';
    introContainer.style.transition = 'opacity 0.5s';
    enterButton.style.opacity = '0';
    introContainer.style.opacity = '0';

    // 캐릭터 이동
    character.style.transition = 'left 1s ease, transform 1s ease';
    character.style.left = '80%';
    character.style.transform = 'translate(-50%, -50%) scale(0.95)';

    // 일정 시간 후 Intro 제거 + 포트폴리오 등장
    setTimeout(() => {
      introContainer.style.display = 'none';
      portfolioContainer.style.display = 'flex';
      setTimeout(() => {
        portfolioContainer.style.opacity = '1';
      }, 10); // display 전환 후 opacity transition 작동 위해 delay
    }, 1000);
  });
});

// visualizer.js

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audioElement = document.getElementById("bgm");
const source = audioCtx.createMediaElementSource(audioElement);
const analyser = audioCtx.createAnalyser();

source.connect(analyser);
analyser.connect(audioCtx.destination);

const bars = document.querySelectorAll(".bar");
const dataArray = new Uint8Array(bars.length);

function animate() {
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

bars.forEach((bar, i) => {
  const step = Math.floor(dataArray.length / bars.length);
  const value = dataArray[i * step];
  const scaledValue = Math.min(1, value / 600, 0.7); // 0~1 사이 값으로 스케일 조정
  bar.style.transform = `scaleY(${scaledValue})`;
});
}
audioElement.addEventListener("play", () => {
  audioCtx.resume();
  animate();
});