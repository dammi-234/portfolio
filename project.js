const thumbList = document.querySelector('.thumb-list');
const TOTAL_CARDS = 15;
const VISIBLE_CARDS = 5;
let position = 0;
let velocity = 0;
const sensitivity = 0.0025;  // 휠 감도
const friction = 0.08;        // 마찰력 (감속)

// 카드 y 위치: 1,5번은 아래로 조금 더 위치 조절 필요하면 숫자 변경하세요
const customPositions = [
  10,       // 1번 카드 (뒤쪽, 살짝 아래 위치)
  80 + 14,  // 2번 카드 (3번과 14px 간격 오른쪽)
  80 + 14 * 2,  // 3번 카드 (중앙, 기준선)
  80 + 14 * 3,  // 4번 카드 (3번과 14px 간격 왼쪽)
  80 + 14 * 4   // 5번 카드 (뒤쪽, 살짝 아래 위치)
];

// 불투명도
const opacityMap = [
  0.3,  // 1번 카드 (가장 낮음)
  0.6,  // 2번 카드
  1.0,  // 3번 카드 (중앙, 가장 높음)
  0.6,  // 4번 카드
  0.3   // 5번 카드 (가장 낮음)
];

// z-index (3번 > 2,4번 > 1,5번)
const zIndexMap = [10, 20, 30, 20, 10];

// 크기 (1,5번은 0.6, 2,4번은 1, 3번은 1)
const scaleMap = [0.6, 1, 1, 1, 0.6];

// 카드 데이터 배열
const cardsData = Array.from({ length: TOTAL_CARDS }, (_, i) => ({
  img: `project${(i % 8) + 1}.jpg`,
  caption: `${i + 1}번 카드 문구입니다`
}));

function createCards() {
  cardsData.forEach(data => {
    const card = document.createElement('div');
    card.className = 'thumb-card';

    const img = document.createElement('img');
    img.src = data.img;
    img.alt = data.caption;

    const caption = document.createElement('div');
    caption.className = 'thumb-caption';
    caption.textContent = data.caption;

    card.appendChild(img);
    card.appendChild(caption);

    thumbList.appendChild(card);
  });
}
createCards();

const cards = document.querySelectorAll('.thumb-card');

function update() {
  velocity *= (1 - friction);
  position += velocity;

  if (position < 0) position += TOTAL_CARDS;
  if (position >= TOTAL_CARDS) position -= TOTAL_CARDS;

  const centerIndex = Math.round(position) % TOTAL_CARDS;

  cards.forEach((card, i) => {
    let offset = i - centerIndex;

    // 무한 순환 고려
    if (offset > TOTAL_CARDS / 2) offset -= TOTAL_CARDS;
    if (offset < -TOTAL_CARDS / 2) offset += TOTAL_CARDS;

    if (offset >= -2 && offset <= 2) {
      const index = offset + 2;  // offset -2 → 0, ... 0 → 2, ... 2 → 4

      // 2번, 4번 카드가 1번, 5번 위치에 갈 경우 스타일 변경
      let scale = scaleMap[index];
      let opacity = opacityMap[index];
      let zIndex = zIndexMap[index];
      let y = customPositions[index];

      if ((index === 1 || index === 3) && (offset === -2 || offset === 2)) {
        // 2번,4번 카드가 1번,5번 위치에 있을 때
        scale = 0.6;
        opacity = 0.3;
        zIndex = 10;
        y = customPositions[0];  // 1번 위치 y 좌표
      }

      card.style.display = 'flex';
      card.style.transform = `
        translateY(${y}px)
        translateZ(${index === 2 ? 60 : -Math.abs(offset) * 40}px)
        scale(${scale})
      `;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
      card.style.pointerEvents = 'auto';

      if (index === 2) card.classList.add('center');
      else card.classList.remove('center');

      // 캡션 업데이트
      const caption = card.querySelector('.thumb-caption');
      if (caption) caption.textContent = cardsData[i].caption;
    } else {
      card.style.display = 'none';
      card.style.opacity = 0;
      card.style.pointerEvents = 'none';
      card.classList.remove('center');
    }
  });

  requestAnimationFrame(update);
}

thumbList.addEventListener('wheel', e => {
  e.preventDefault();
  velocity += e.deltaY * sensitivity;
}, { passive: false });

update();