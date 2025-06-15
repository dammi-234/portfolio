const circles = document.querySelectorAll('.circle');

let circlesData = Array.from(circles).map(circle => {
  const size = circle.offsetWidth;
  const speed = 0.7 + Math.random();
  return {
    el: circle,
    x: Math.random() * (window.innerWidth - size),
    y: Math.random() * (window.innerHeight - size),
    vx: speed * (Math.random() < 0.5 ? -1 : 1),
    vy: speed * (Math.random() < 0.5 ? -1 : 1),
    size
  };
});

// 애니메이션 실행
function animate() {
  circlesData.forEach(c => {
    c.x += c.vx;
    c.y += c.vy;

    if (c.x <= 0 || c.x + c.size >= window.innerWidth) c.vx *= -1;
    if (c.y <= 0 || c.y + c.size >= window.innerHeight) c.vy *= -1;

    c.el.style.left = `${c.x}px`;
    c.el.style.top = `${c.y}px`;
  });

  requestAnimationFrame(animate);
}
animate();

// 이벤트 연결 함수
function attachBurstEvent(c) {
  c.el.addEventListener('mouseenter', () => {
    const el = c.el;
    el.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    el.style.transform = 'scale(3)';
    el.style.opacity = '0';

    setTimeout(() => {
      el.remove();

      const newCircle = el.cloneNode(true);
      newCircle.style.transform = 'scale(1)';
      newCircle.style.opacity = '1';
      newCircle.style.transition = 'none';
      newCircle.style.position = 'fixed';
      newCircle.style.pointerEvents = 'auto';

      const size = c.size;
      const x = Math.random() * (window.innerWidth - size);
      const y = Math.random() * (window.innerHeight - size);

      newCircle.style.left = `${x}px`;
      newCircle.style.top = `${y}px`;

      document.body.appendChild(newCircle);

      const speed = 0.7 + Math.random();
      const newData = {
        el: newCircle,
        x,
        y,
        vx: speed * (Math.random() < 0.5 ? -1 : 1),
        vy: speed * (Math.random() < 0.5 ? -1 : 1),
        size
      };

      circlesData.push(newData); // 새 원도 애니메이션 대상에 추가
      attachBurstEvent(newData); // 새 원에도 이벤트 재연결
    }, 1000); // transition과 딱 맞춤
  });
}

// 초기에 모든 원에 이벤트 부착
circlesData.forEach(c => attachBurstEvent(c));