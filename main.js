console.log("main.js 실행됨");

// 배경 비디오 자동재생 보조
document.addEventListener('DOMContentLoaded', () => {
  const bgVideo = document.querySelector('.bg-video');
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.playsInline = true;
    bgVideo.play().catch((e) => {
      console.warn('자동재생 차단됨. 사용자 인터랙션 필요');
    });
  }
});

window.addEventListener("load", () => {
  const bgm = document.getElementById("bgm");
  bgm.muted = true;
  bgm.volume = 0.7;
});

// 비주얼라이저 클릭으로 음악 재생 & intro 제거
const bgm = document.getElementById('bgm');
const intro = document.querySelector('.intro');
const visualizer = document.getElementById('audio-visualizer');

visualizer.addEventListener('click', () => {
  bgm.muted = false;
  bgm.play();
  intro.style.display = 'none';
});

// ENTER 버튼도 intro 제거 (선택사항)
const enterBtn = document.querySelector('.enter-button');
enterBtn.addEventListener('click', () => {
  intro.style.display = 'none';
});

// 캐릭터 애니메이션
document.addEventListener('DOMContentLoaded', function () {
  const enterButton = document.querySelector('.enter-button');
  const character = document.querySelector('.character');
  const introContainer = document.querySelector('.intro');
  const portfolioContainer = document.querySelector('.container');

  enterButton.addEventListener('click', function () {
    enterButton.style.transition = 'opacity 0.5s';
    introContainer.style.transition = 'opacity 0.5s';
    enterButton.style.opacity = '0';
    introContainer.style.opacity = '0';

    character.style.transition = 'left 1s ease, transform 1s ease';
    character.style.left = '80%';
    character.style.transform = 'translate(-50%, -50%) scale(0.95)';

    setTimeout(() => {
      introContainer.style.display = 'none';
      portfolioContainer.style.display = 'flex';
      setTimeout(() => {
        portfolioContainer.style.opacity = '1';
      }, 10);
    }, 1000);
  });
});

// 오디오 비주얼라이저
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
    const scaledValue = Math.min(1, value / 600, 0.7);
    bar.style.transform = `scaleY(${scaledValue})`;
  });
}

audioElement.addEventListener("play", () => {
  audioCtx.resume();
  animate();
});