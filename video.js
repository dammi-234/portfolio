document.addEventListener('DOMContentLoaded', () => {
  const thumbList = document.querySelector('.thumb-list');
  const background1 = document.getElementById('bg1');
  const background2 = document.getElementById('bg2');
  const titleKor = document.querySelector('.main-title-kor');
  const titleEng = document.querySelector('.main-title-eng');
  const desc = document.querySelector('.main-desc');
  const popupOverlay = document.getElementById("popupOverlay");
  const popupVideo = document.getElementById("popupVideo");
  const indicator = document.getElementById("indicator");

  const TOTAL_CARDS = 7;
  const TOTAL_INDICATORS = 3;
  const CARD_WIDTH = 280;
  const CARD_HEIGHT = 200;
  const CARD_GAP = 40;
  const SCROLL_SENSITIVITY = 0.002;
  const FRICTION = 0.08;

  let position = 0;
  let velocity = 0;
  let prevCenterIndex = -1;

  const cardsData = [
    {
      img: 'video3.jpg',
      url: 'https://www.youtube.com/embed/rAplQ2J7Uno?autoplay=1',
      titleKor: 'interview',
      titleEng: 'TEN TO THE TEN',
      desc: '이 영상은 10년 후 나의 미래를 예측해서 대답하는 영상입니다.'
    },
    {
      img: 'video2.jpg',
      url: 'https://www.youtube.com/embed/agbyIR5VqHQ?autoplay=1',
      titleKor: 'VLOG',
      titleEng: '경성대 기숙사',
      desc: '낮부터 밤까지 해가 뜨고 지는 모습을 촬영한 타임랩스 영상입니다.'
    },
    {
      img: 'video4.jpg',
      url: 'https://www.youtube.com/embed/RR_Mq_6kpyI?autoplay=1',
      titleKor: 'SHORT DRAMA',
      titleEng: '지식과 사랑을 동시에 얻는 방법',
      desc: '이 영상은 보수동 책방 골목에서 촬영한 단편 드라마입니다.'
    },
    {
      img: 'video5.jpg',
      url: 'https://www.youtube.com/embed/Cogbt75XTAM?autoplay=1',
      titleKor: 'VIDEO',
      titleEng: '갑골문으로 배우는 사자성어',
      desc: '갑골문을 그림으로 쉽게 배울 수 있도록 제작한 영상입니다.'
    },
    {
      img: 'video6.jpg',
      url: 'https://www.youtube.com/embed/7mcCJENbYl4?autoplay=1',
      titleKor: 'documentary',
      titleEng: '변하지 않는 밥톨나라 이야기',
      desc: '학교 교내식당을 다큐멘터리 형식으로 촬영한 영상입니다.'
    },
    {
      img: 'video1.jpg',
      url: 'https://www.youtube.com/embed/sFAsZ8vlsaM?autoplay=1',
      titleKor: 'MUSICVIDEO',
      titleEng: '지친하루를 보내고 있는 당신에게',
      desc: '경성대 재학생을 위한 뮤직비디오영상입니다.'
    },
    {
      img: 'video7.jpg',
      url: '',
      titleKor: 'TO be continued',
      titleEng: 'Coming Soon',
      desc: '새로운 영상이 곧 공개됩니다.'
    }
  ];

  // ✅ 인디케이터 3개 생성
  for (let i = 0; i < TOTAL_INDICATORS; i++) {
    const dot = document.createElement("div");
    dot.className = "indicator-dot";
    indicator.appendChild(dot);
  }
  const dots = document.querySelectorAll('.indicator-dot');

  function createCards() {
    cardsData.forEach((data, index) => {
      const card = document.createElement('div');
      card.className = 'thumb-card';

      const img = document.createElement('img');
      img.src = data.img;
      img.alt = `Video ${index + 1}`;

      card.appendChild(img);
      thumbList.appendChild(card);

      card.addEventListener("click", () => {
        if (data.url) {
          popupVideo.src = data.url;
          popupOverlay.classList.remove("hidden");
        }
      });
    });

    thumbList.style.height = `${TOTAL_CARDS * (CARD_HEIGHT + CARD_GAP)}px`;
  }

  createCards();

  const cards = document.querySelectorAll('.thumb-card');
  const centerY = 150;

  const POSITION_MAP = {
    "-2": { yOffset: -170, scale: 0.6, opacity: 0.4 },
    "-1": { yOffset: -90,  scale: 0.8, opacity: 0.7 },
     "0": { yOffset: 100,  scale: 0.8, opacity: 1.0 },
     "1": { yOffset: 300,  scale: 0.8, opacity: 0.7 },
     "2": { yOffset: 380,  scale: 0.6, opacity: 0.4 }
  };

  function update() {
    velocity *= (1 - FRICTION);
    position += velocity;

    if (position < 0) position += TOTAL_CARDS;
    if (position >= TOTAL_CARDS) position -= TOTAL_CARDS;

    const centerIndex = Math.round(position) % TOTAL_CARDS;

    // 배경 및 텍스트 업데이트
    if (centerIndex !== prevCenterIndex) {
      prevCenterIndex = centerIndex;
      const currentData = cardsData[centerIndex];
      background2.src = currentData.img;
      background2.style.opacity = 0;
      setTimeout(() => {
        background1.src = currentData.img;
        background2.style.opacity = 1;
      }, 100);
      titleKor.textContent = currentData.titleKor;
      titleEng.textContent = currentData.titleEng;
      desc.innerHTML = currentData.desc;
    }

    cards.forEach((card, i) => {
      let offset = i - centerIndex;
      if (offset > TOTAL_CARDS / 2) offset -= TOTAL_CARDS;
      if (offset < -TOTAL_CARDS / 2) offset += TOTAL_CARDS;

      if (Math.abs(offset) <= 2) {
        const pos = POSITION_MAP[offset.toString()];
        const y = centerY + pos.yOffset;
        card.style.display = 'flex';
        card.style.transform = `translateY(${y}px) scale(${pos.scale})`;
        card.style.opacity = pos.opacity;
        card.style.zIndex = 100 - Math.abs(offset);
        card.classList.toggle('center', offset === 0);
      } else {
        card.style.display = 'none';
        card.style.opacity = 0;
      }
    });

    // ✅ 인디케이터 계산 3개용
    const indicatorIndex = Math.floor(centerIndex / (TOTAL_CARDS / TOTAL_INDICATORS));
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === indicatorIndex);
    });

    requestAnimationFrame(update);
  }

  thumbList.addEventListener('wheel', e => {
    e.preventDefault();
    velocity += e.deltaY * SCROLL_SENSITIVITY;
  }, { passive: false });

  popupOverlay.addEventListener("click", () => {
    popupVideo.src = "";
    popupOverlay.classList.add("hidden");
  });

  update();
});