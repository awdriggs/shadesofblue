const MAX = 1440 * 7;
let allReadings = [];
let visibleDays = 1;

function preload() {
  data = loadJSON(`https://micro-api.awdokku.site/api/readings/shades-of-blue?limit=${MAX}&device=${DEVICE_ID}`);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  allReadings = data.readings;
  bars = getVisibleBars(allReadings, visibleDays);
}

function getVisibleBars(readings, days) {
  if (days === 0 || !readings.length) return readings.slice(0, 1);
  const latestTime = new Date(readings[0].timestamp).getTime();
  const cutoff = latestTime - days * 24 * 60 * 60 * 1000;
  return readings.filter(r => new Date(r.timestamp).getTime() >= cutoff);
}

function draw() {
  background(220);
  if (!bars.length) return;
  let w = width / bars.length;
  for (let i = 0; i < bars.length; i++) {
    let rgb = bars[i].values;
    fill(rgb.r, rgb.g, rgb.b);
    rect(i * w, 0, w + 1, height);
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    visibleDays = max(visibleDays - 1, 0);
    bars = getVisibleBars(allReadings, visibleDays);
  } else if (keyCode === RIGHT_ARROW) {
    visibleDays = min(visibleDays + 1, 7);
    bars = getVisibleBars(allReadings, visibleDays);
  } else if (key === 'g') {
    saveGif('thumb', floor(random(3, 8)));
  } else if (key === 'p') {
    saveCanvas('thumb', 'jpg');
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
