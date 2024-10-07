let data = [60, 80, 30, 70, 30, 85];
let labels = ['Speed', 'Strength', 'Agility', 'Endurance', 'Intelligence', 'Luck'];
let numAxes = data.length;
let radius;
let hovered = false;
let colorValue = 0;
let targetColorValue = 0;
let baseColor = [114, 147, 203];
let hoverColor = [255, 145, 0]; // 橘色
let animationActive = false;
let pulseValue = 0;
let pulseSpeed = 0.01;
let pulseAmplitude = 0.01; // 脹縮幅度
let particles = [];
let particleRadius = 100; // 粒子噴射初始圓周半徑
let particleSizeMean = 3; // 粒子大小均值
let particleSizeStdDev = 1; // 粒子大小標準差
let maxParticles = 300; // 最大粒子數量
let seg = 100;

let audio;
let fft;

function preload() {
  audio = loadSound('sound/great_compassion.mp3');
}

function setup() {
  createCanvas(600, 600);
  frameRate(60);
  fft = new p5.FFT(1.0,4096);
  //audio.play();
}

function draw() {
  background(240);
  translate(width / 2, height / 2);

  radius = min(width, height) / 3;
  stroke(0, 0, 0, 150); // 半透明的黑色線條，顏色和透明度可調整
  noFill();

  // 繪製雷達圖的軸線和多邊形網格
  for (let i = 0; i < numAxes; i++) {
    let angle = TWO_PI / numAxes * i;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    strokeWeight(0.5); // 調整線條寬度
    line(0, 0, x, y);
  }

  // 繪製多邊形網格
  for (let level = 1; level <= 5; level++) {
    beginShape();
    for (let i = 0; i < numAxes; i++) {
      let angle = TWO_PI / numAxes * i;
      let r = (radius / 5) * level;
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  // 檢查滑鼠是否在多邊形內
  let currentHovered = isMouseInsidePolygon();
  if (currentHovered && !hovered) {
    targetColorValue = 1;
    animationActive = true;
    audio.play()
  } else if (!currentHovered && hovered) {
    targetColorValue = 0;
    animationActive = true;
    audio.stop()
  }
  hovered = currentHovered;

  // 更新顏色值
  if (animationActive) {
    colorValue = lerp(colorValue, targetColorValue, 0.05); // 使用線性插值來實現顏色的漸變效果
    if (abs(colorValue - targetColorValue) < 0.01) {
      colorValue = targetColorValue;
      animationActive = false;
    }
  }

  // 更新脹縮值
  if (hovered) {
    pulseValue = sin(frameCount * pulseSpeed) * pulseAmplitude; // 周期性的脹縮效果
    createParticlesContinuous(); // 持續創建粒子
    createParticlesContinuous(); // 持續創建粒子
  } else {
    pulseValue = 0;
  }

  // 計算顏色漸變
  let r = lerp(baseColor[0], hoverColor[0], colorValue);
  let g = lerp(baseColor[1], hoverColor[1], colorValue);
  let b = lerp(baseColor[2], hoverColor[2], colorValue);

  // 繪製數據區域
  fill(r, g, b, 200);
  stroke(0, 0, 0); // 黑色線條
  strokeWeight(0.2); // 調整線條寬度

  beginShape();
  let waveform = fft.waveform();
  //let waveform = fft.analyze()
  //console.log(waveform)
  for (let i = 0; i < numAxes; i++) {
    let angle1 = TWO_PI / numAxes * i;
    //let ampIndex = floor(map(i, 0, numAxes, 0, waveform.length));
    //let r1 = radius;
    //let r1 = map(data[i], 0, 100, 0, radius + pulseValue) + map(amp1, -1, 1, -20, 20);
    let r1 = map(data[i], 0, 100, 0, radius);
    let x1 = cos(angle1) * r1;
    let y1 = sin(angle1) * r1;
    vertex(x1, y1);
    for(let j=0;j<seg;j++){
        let angle2 = angle1 + (TWO_PI / numAxes) ;
        let ampIndex = floor(map(i*seg + j, 0, seg*numAxes, 0, waveform.length));
        //console.log(ampIndex)
        let amp = waveform[ampIndex];
        //let r1 = map(data[i], 0, 100, 0, radius + pulseValue) + map(amp, -1, 1, -20, 20);
        let r2 = map(data[(i+1)%numAxes], 0, 100, 0, radius);
        let x2 = cos(angle2) * r2;
        let y2 = sin(angle2) * r2;
        let x = lerp(x1, x2, j/seg);
        let y = lerp(y1, y2, j/seg);
        let newAngle = atan2(y,x)
        let newRadius = mag(x, y)+ modulate * map(amp, -1, 1, -15, 15)
        let xn= (newRadius) * cos(newAngle)
        let yn= (newRadius) * sin(newAngle)
        //print(cos(newAngle))
        circle(xn,yn,2)
        vertex(xn, yn);
    }
  }
  endShape(CLOSE);

  // 繪製標籤
  fill(20); // 調整字體顏色，使其更柔和
  textSize(50);
  textAlign(CENTER, BOTTOM); // 調整對齊方式使字體顯得更美觀
  for (let i = 0; i < numAxes; i++) {
    let angle = TWO_PI / numAxes * i;
    let x = cos(angle) * 2.1 * (radius + 20);
    let y = sin(angle) * 2.1 * (radius + 20);
    textFont('Courier New');
    textStyle(NORMAL); // 設置字體樣式為正常，避免字體過粗
    push();
    scale(0.25); // 縮放字體
    text(labels[i], x * 2, y * 2);
    pop();
  }

  // 更新並繪製粒子效果
  updateParticles();
}

function isMouseInsidePolygon() {
  let points = [];
  for (let i = 0; i < numAxes; i++) {
    let angle = TWO_PI / numAxes * i;
    let r = map(data[i], 0, 100, 0, radius);
    let x = cos(angle) * r;
    let y = sin(angle) * r;
    points.push(createVector(x, y));
  }

  // 使用射線法判斷滑鼠是否在多邊形內
  let count = 0;
  let x = mouseX - width / 2;
  let y = mouseY - height / 2;
  for (let i = 0; i < points.length; i++) {
    let a = points[i];
    let b = points[(i + 1) % points.length];
    if (((a.y > y) != (b.y > y)) && (x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x)) {
      count++;
    }
  }
  modulate = count % 2 == 1
  return count % 2 == 1;
}

function mouseMoved() {
  animationActive = true;
  redraw();
}

// 持續創建粒子效果
function createParticlesContinuous() {
  if (particles.length < maxParticles) {
    let angle = random(TWO_PI);
    let speed = random(0.1, 1);
    let size = abs(randomGaussian(particleSizeMean, particleSizeStdDev)); // 粒子大小為高斯分佈
    let particle = {
      x: cos(angle) * particleRadius,
      y: sin(angle) * particleRadius,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      alpha: 255,
      size: size
    };
    particles.push(particle);
  }
}

// 更新並繪製粒子效果
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 2;

    fill(255, 145, 0, p.alpha);
    noStroke();
    ellipse(p.x, p.y, p.size);

    // 移除已經淡出的粒子
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

// 繪製音訊環形可視化效果
// function drawAudioRingVisualizer() {
//   let waveform = fft.waveform();
//   noFill();
//   stroke(50, 100, 200);
//   strokeWeight(2);

//   beginShape();
//   for (let i = 0; i < waveform.length; i++) {
//     let angle = map(i, 0, waveform.length, 0, TWO_PI);
//     let amp = waveform[i];
//     let r = radius + map(amp, -1, 1, -50, 50);
//     let x = r * cos(angle);
//     let y = r * sin(angle);
//     vertex(x, y);
//   }
//   endShape(CLOSE);
// }