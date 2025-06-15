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

const cardsData = [
  {
    img: 'project1.jpg',
    titleKor: '타이포그래픽스',
    titleEng: 'MEDIAVIDEO',
    desc: '이 디자인은 타이포와 기하학을 이용한<br>모더니즘 느낌의 포스터입니다.'
  },
  {
    img: 'project2.jpg',
    titleKor: '광고미디어디자인',
    titleEng: 'LEMOUTON',
    desc: 'AI를 활용한 르무퉁 제품광고 포스터입니다.'
  },
  {
    img: 'project3.jpg',
    titleKor: '광고미디어디자인',
    titleEng: '당신에게 테이핑을 더하다',
    desc: '저를 광고하는 포스터로 좋은 기운을 드릴 수 있는 부적을<br>빗대어 표현하였습니다.'
  },
  {
    img: 'project4.jpg',
    titleKor: 'CARDNEWS',
    titleEng: '학과 카드뉴스',
    desc: '학과 카드뉴스로 제가 디자인한 학과 캐릭터 콘비 콘지를 넣었습니다.'
  },
  {
    img: 'project5.jpg',
    titleKor: 'CARDNEWS',
    titleEng: '학과 카드뉴스',
    desc: '학과 집부 카드뉴스로 게임 컨셉으로 디자인했습니다.'
  },
  {
    img: 'project6.jpg',
    titleKor: 'CARDNEWS',
    titleEng: '학과 카드뉴스',
    desc: '학과 카드뉴스를 시각적으로 디자인해보았습니다.'
  },
  {
    img: 'project7.jpg',
    titleKor: 'Illustration',
    titleEng: '초코비',
    desc: '짱구가 좋아하는 초코비를 방처럼 꾸며보았습니다.'
  },
  {
    img: 'project8.jpg',
    titleKor: 'CINEMA 4D',
    titleEng: 'Magic House',
    desc: '해리포터컨셉으로 제작한 마법사의 방을 상상해서 제작해보았습니다.'
  },
  {
    img: 'project9.jpg',
    titleKor: 'CARDNEWS',
    titleEng: '학과 카드뉴스',
    desc: '학과 카드뉴스로 시험을 응원하기 위해 제작했습니다.'
  },
  {
    img: 'project10.jpg',
    titleKor: 'CARDNEWS',
    titleEng: 'MEDIACONTENTS',
    desc: '학과 행사를 위해 제작했습니다.'
  },
  {
    img: 'project11.jpg',
    titleKor: 'CARDNEWS',
    titleEng: '별무리 ADVENTURE',
    desc: '대동제 부스 운영을 위해 제작한 카드뉴스'
  },
  {
    img: 'project12.jpg',
    titleKor: 'ILLUSTRATOR',
    titleEng: 'PUBLIC TRANSPORTATION',
    desc: '대중교통이라는 주제를 테트리스와 결합하여 제작한 디자인입니다.'
  },
  {
    img: 'project13.jpg',
    titleKor: 'ILLUSTRATOR',
    titleEng: 'SMART PHONE',
    desc: '스마트폰이라는 주제를 APPLE STORE 마트와 결합하여 제작했습니다.'
  },
  {
    img: 'project14.jpg',
    titleKor: 'CARDNEWS',
    titleEng: '학과 카드뉴스',
    desc: '학과 월간미콘입니다.'
  },
  {
    img: 'project15.jpg',
    titleKor: 'Application',
    titleEng: 'APP DESIGN',
    desc: '제가 좋아하는 드라마를 모아놓은 어플리케이션을 디자인해보았습니다.'
  }
];

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