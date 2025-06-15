document.addEventListener('DOMContentLoaded', () => {
  console.log("JS 연결됨");

  const imageData = [
    { src: '1.jpg', title: '🍎' },
    { src: '2.jpg', title: '🍊' },
    { src: '3.jpg', title: '🍋' },
    { src: '4.jpg', title: '🍐' },
    { src: '5.jpg', title: '🫐' },
    { src: '6.jpg', title: '🍇' },
    { src: '7.jpg', title: '🍑' },
    { src: '8.jpg', title: '🍒' }
  ];

  const itemsPerPage = 4;
  const totalPages = Math.ceil(imageData.length / itemsPerPage);
  let currentPage = 0;

  const track = document.getElementById('sliderTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const popup   = document.getElementById('popup');
  const popupImg= document.getElementById('popup-img');
  const closeBtn= document.querySelector('.close-btn');
  const exitBtn = document.getElementById('exitBackBtn');

  function renderSliderPage(page) {
    track.innerHTML = '';
    const start = page * itemsPerPage;
    imageData.slice(start, start + itemsPerPage).forEach(data => {
      const item = document.createElement('div');
      item.className = 'thumb-item';
      item.innerHTML = `<img src="${data.src}" alt="${data.title}"><div class="thumb-title">${data.title}</div>`;
      item.querySelector('img').addEventListener('click', () => {
        popupImg.src = data.src;
        popup.classList.remove('hidden');
        document.body.classList.add('popup-active');
      });
      track.appendChild(item);
    });
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
  }

  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) renderSliderPage(--currentPage);
  });
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) renderSliderPage(++currentPage);
  });

  closeBtn.addEventListener('click', () => {
    popup.classList.add('hidden');
    popupImg.src = '';
    document.body.classList.remove('popup-active');
  });

  exitBtn.addEventListener('click', () => {
    history.back();
  });

  // 초기 렌더링
  renderSliderPage(currentPage);
});