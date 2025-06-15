document.addEventListener('DOMContentLoaded', () => {
  const thumbList = document.querySelector('.thumb-list');
  const background1 = document.getElementById('bg1');
  const background2 = document.getElementById('bg2');
  const titleKor = document.querySelector('.main-title-kor');
  const titleEng = document.querySelector('.main-title-eng');
  const desc = document.querySelector('.main-desc');
  const popupOverlay = document.getElementById("popupOverlay");
  const popupImage = document.getElementById("popupImage");
  const indicator = document.getElementById("indicator");

  const TOTAL_CARDS = 15;
  const TOTAL_INDICATORS = 5;
  const CARD_WIDTH = 280;
  const CARD_HEIGHT = 200;
  const CARD_GAP = 40;
  const SCROLL_SENSITIVITY = 0.002;
  const FRICTION = 0.08;

  let position = 0;
  let velocity = 0;
  let prevCenterIndex = -1;

  // 카드 데이터 (15개)
  const cardsData = Array.from({ length: TOTAL_CARDS }, (_, i) => ({
    img: `project${i + 1}.jpg`,
    titleKor: `한글 제목 ${i+1}`,
    titleEng: `English Title ${i+1}`,
    desc: `이것은 ${i+1}번째 카드의 설명입니다.`
  }));

  // 인디케이터 5개 생성
  for (let i = 0; i < TOTAL_INDICATORS; i++) {
    const dot = document.createElement("div");
    dot.className = "indicator-dot";
    indicator.appendChild(dot);
  }
  const dots = document.querySelectorAll('.indicator-dot');

  // 카드 생성 + 팝업 연결
  function createCards() {
    cardsData.forEach(data => {
      const card = document.createElement('div');
      card.className = 'thumb-card';

      const img = document.createElement('img');
      img.src = data.img;
      img.alt = data.titleKor;

      const caption = document.createElement('div');
      caption.className = 'thumb-caption';
      caption.textContent = data.titleEng;

      card.appendChild(img);
      card.appendChild(caption);
      thumbList.appendChild(card);

      // 팝업 연결
      card.addEventListener("click", () => {
        popupImage.src = data.img;
        popupOverlay.classList.remove("hidden");
      });
    });

    thumbList.style.height = `${TOTAL_CARDS * (CARD_HEIGHT + CARD_GAP)}px`;
  }

  createCards();

  const cards = document.querySelectorAll('.thumb-card');
  const centerY = 150;

  // 카드 위치 / 크기 / 투명도 설정
  const POSITION_MAP = {
    "-2": { yOffset: -170, scale: 0.6, opacity: 0.4 },
    "-1": { yOffset: -90,  scale: 0.8, opacity: 0.7 },
     "0": { yOffset: 100,  scale: 0.8, opacity: 1.0 },
     "1": { yOffset: 300,  scale: 0.8, opacity: 0.7 },
     "2": { yOffset: 380,  scale: 0.6, opacity: 0.4 }
  };

  const INDICATOR_OPACITY_MAP = {
    active: 0.9,
    inactive: 1.0
  };

  function update() {
    velocity *= (1 - FRICTION);
    position += velocity;

    if (position < 0) position += TOTAL_CARDS;
    if (position >= TOTAL_CARDS) position -= TOTAL_CARDS;

    const centerIndex = Math.round(position) % TOTAL_CARDS;

    // 배경 & 타이틀 업데이트
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

    // 카드 위치/크기/투명도 업데이트
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

    // 인디케이터 업데이트
    const indicatorIndex = Math.floor(centerIndex / (TOTAL_CARDS / TOTAL_INDICATORS));
    dots.forEach((dot, idx) => {
      if (idx === indicatorIndex) {
        dot.classList.add("active");
        dot.style.opacity = INDICATOR_OPACITY_MAP.active;
      } else {
        dot.classList.remove("active");
        dot.style.opacity = INDICATOR_OPACITY_MAP.inactive;
      }
    });

    requestAnimationFrame(update);
  }

  thumbList.addEventListener('wheel', e => {
    e.preventDefault();
    velocity += e.deltaY * SCROLL_SENSITIVITY;
  }, { passive: false });

  // 팝업 닫기
  popupOverlay.addEventListener("click", () => {
    popupOverlay.classList.add("hidden");
  });

  update();
});