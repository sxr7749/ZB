const fortunes = [
  { type: '超吉', color: 'super-fortune', rate: 5, blessings: ['今日鸿运当头','贵人相助事事顺','惊喜连连好运来'] },
  { type: '吉', color: 'good-fortune', rate: 15, blessings: ['诸事顺利心想成','桃花运旺遇良缘','财运亨通收入增'] },
  { type: '上吉', color: 'great-fortune', rate: 10, blessings: ['事业突破展宏图','健康平安福寿长','智慧开启思路明'] },
  { type: '平', color: 'normal', rate: 40, blessings: ['稳中求进方为道','知足常乐心安宁','蓄势待发等时机'] },
  { type: '小凶', color: 'little-bad', rate: 15, blessings: ['小心谨慎避风险','退让一步海阔天','修身养性待机缘'] },
  { type: '凶', color: 'bad-fortune', rate: 15, blessings: ['破财消财莫强求','以静制动避是非','柳暗花明终有时'] }
];

let isFlipped = false;

function drawCard(card) {
  if (isFlipped) return;
  
  // 生成权重数组
  const weights = fortunes.flatMap(f => Array(f.rate).fill(f));
  const selected = weights[Math.floor(Math.random() * weights.length)];
  
  const back = card.querySelector('.card-back');
  const result = back.querySelector('.fortune-result');
  const blessing = back.querySelector('.blessing');
  
  result.textContent = selected.type;
  result.className = `fortune-result ${selected.color}`;
  blessing.textContent = selected.blessings[Math.floor(Math.random() * selected.blessings.length)];
  
  card.classList.add('flipped');
  isFlipped = true;
}

function resetCards() {
  document.querySelectorAll('.card').forEach(card => {
    card.classList.remove('flipped');
    card.querySelector('.fortune-result').className = 'fortune-result';
    card.querySelector('.blessing').textContent = '';
  });
  isFlipped = false;
}

// 粒子系统初始化
const canvas = document.createElement('canvas');
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,182,193,${this.alpha})`;
    ctx.fill();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x < 0 || this.x > canvas.width || 
        this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
}

// 初始化粒子数组
const particles = Array(100).fill().map(() => new Particle());

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  requestAnimationFrame(animate);
}

animate();

// 窗口大小变化时重置canvas
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// 卡片悬浮动画增强
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.transform = `
      perspective(1000px)
      rotateX(${(y - rect.height/2) / 8}deg)
      rotateY(${(x - rect.width/2) / -8}deg)
      scale(1.05)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});

function showResult(result) {
  const glow = document.createElement('div');
  glow.className = 'glow-overlay';
  
  // 根据结果设置持续时间
  const durations = {'吉':1, '上吉':2, '超吉':3};
  glow.style.animationDuration = `${durations[result]}s`;
  
  document.body.appendChild(glow);
  glow.addEventListener('animationend', () => glow.remove());

  // 原有结果展示逻辑
  resultDiv.textContent = result; 
}