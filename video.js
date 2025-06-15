document.addEventListener('DOMContentLoaded', () => {
  const thumbList = document.querySelector('.thumb-list');
  const background1 = document.getElementById('bg1');
  const background2 = document.getElementById('bg2');
  const popupOverlay = document.getElementById("popupOverlay");
  const popupVideo = document.getElementById("popupVideo");
  const indicator = document.getElementById("indicator");

  const TOTAL_CARDS = 7;
  const CARD_WIDTH = 280;
  const CARD_HEIGHT = 200;
  const CARD_GAP = 40;
  const SCROLL_SENSITIVITY = 0.002;
  const FRICTION = 0.08;

  let position = 0;
  let velocity = 0;
  let prevCenterIndex = -1;

  const cardsData = [
    { img: 'video3.jpg', url: 'https://www.youtube.com/embed/rAplQ2J7Uno?autoplay=1' },
    { img: 'video2.jpg', url: 'https://www.youtube.com/embed/agbyIR5VqHQ?autoplay=1' },
    { img: 'video4.jpg', url: 'https://www.youtube.com/embed/RR_Mq_6kpyI?autoplay=1' },
    { img: 'video5.jpg', url: 'https://www.youtube.com/embed/Cogbt75XTAM?autoplay=1' },
    { img: 'video6.jpg', url: 'https://www.youtube.com/embed/7mcCJENbYl4?autoplay=1' },
    { img: 'video1.jpg', url: 'https://www.youtube.com/embed/sFAsZ8vlsaM?autoplay=1' },
    { img: 'video7.jpg', url: '' }
  ];

  // 인디케이터 생성
  for (let i = 0; i < cardsData.length; i++) {
    const dot = document.createElement("div");
    dot.className = "indicator-dot";
    indicator.appendChild(dot);
  }
  const dots = document.querySelectorAll('.indicator-dot');

  // 카드 생성
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

    // 배경 업데이트
    if (centerIndex !== prevCenterIndex) {
      prevCenterIndex = centerIndex;
      const currentData = cardsData[centerIndex];
      background2.src = currentData.img;
      background2.style.opacity = 0;
      setTimeout(() => {
        background1.src = currentData.img;
        background2.style.opacity = 1;
      }, 100);
    }

    // 카드 위치
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

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === centerIndex);
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