// by SamuelYAN
// more works //
// https://twitter.com/SamuelAnn0924
// https://www.instagram.com/samuel_yan_1990/

let particles = [];
let colors = [];
let parNum = 1000; // パーティクルの総数
var mySize;

let fadeDuration = 1000; // 淡入淡出的持續時間（毫秒）
let stayDuration = 1000; // 文本顯示的持續時間（毫秒）
let fadeInTime, fadeOutTime, stayTime;
let message = "Hello, p5.js!";
let fadeIn = false; // 淡入狀態
let canvasImg;

function setup() {
  mySize = min(windowWidth, windowHeight);
  // pixelDensity(5);
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvasContainer'); // 使用 parent() 函數將畫布放入指定的 div 中
  colorMode(HSB, 360, 100, 100, 100);
  colors[0] = color(random(130)+15, 90, 90, random(25, 50));
  colors[1] = color(random(150)+175, 90, 90, random(25, 50));
  for (let i = 0; i < parNum; i++) {
    particles.push(new Particle(random(width), random(height)));
  } // 全部のパーティクルを作る
  background(0, 0, 5, 100);
  textAlign(CENTER, CENTER);
  textSize(32);
  canvasImg=createImage(width, height)
}

function draw() {
  image(canvasImg, 0, 0)
  for (let j = particles.length - 1; j > 0; j--) {
    particles[j].update();
    particles[j].show();
    if (particles[j].finished()) {
      particles.splice(j, 1);
      background(0, 0, 5, 0.1);
    }
  }

  for (let i = particles.length; i < parNum; i++) {
    particles.push(new Particle(random(width), random(height)));
  } // パーティクルを補充
  canvasImg = get()
  
  // 檢查是否在淡入階段
  if (fadeIn) {
    push()
    noStroke()
    // 計算當前時間
    let currentTime = millis();

    // 檢查是否在淡入階段
    if (currentTime - fadeInTime < fadeDuration) {
      // 計算淡入效果的透明度
      let alpha = map(currentTime - fadeInTime, 0, fadeDuration, 0, 255);
      fill(255, alpha); // 設置文本顏色及透明度
      text(message, width / 2, height / 2); // 在畫布上顯示文本
    }

    // 檢查是否在維持階段
    else if (currentTime - fadeInTime < fadeDuration + stayDuration) {
      fill(255); // 設置文本顏色
      text(message, width / 2, height / 2); // 在畫布上顯示文本
    }

    // 檢查是否在淡出階段
    else if (currentTime - stayTime < fadeDuration) {
      // 計算淡出效果的透明度
      let alpha = map(currentTime - stayTime, 0, fadeDuration, 255, 0);
      fill(255, alpha); // 設置文本顏色及透明度
      text(message, width / 2, height / 2); // 在畫布上顯示文本
    }
    else{
      fill(255, 0)
      text(message, width / 2, height / 2); // 在畫布上顯示文本
    }
    pop()
  }
}

function ShowText(newMessage) {
  fadeIn = true;
  fadeInTime = millis(); // 記錄淡入開始時間
  stayTime = fadeInTime + fadeDuration + stayDuration; // 記錄維持開始時間
  message = newMessage
}

function Refresh(){
  console.log("ABC")
  background(0)
  canvasImg = createImage(width,height)
  canvasImg.loadPixels(); // 加載圖像像素數據
  noiseSeed()
  randomSeed()
  colors[0] = color(random(130)+15, 90, 90, random(25, 50));
  colors[1] = color(random(150)+175, 90, 90, random(25, 50));
}