let dataAms01, dataAms02;
let barsAms01 = [], barsAms02 = [];
const MAX = 1920;
const BASE_URL = "https://micro-api.awdokku.site/api/readings/shades-of-blue";

function preload() {
  dataAms01 = loadJSON(`${BASE_URL}?limit=${MAX}&device=ams01`);
  dataAms02 = loadJSON(`${BASE_URL}?limit=${MAX}&device=ams02`);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  barsAms01 = dataAms01.readings;
  barsAms02 = dataAms02.readings;

  const ws = new WebSocket("wss://micro-api.awdokku.site/");
  ws.onopen = () => ws.send(JSON.stringify({ type: "join", stream: "shades-of-blue" }));
  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      console.log("ws message:", msg);
      if (msg.type === "data" && msg.values) {
        const entry = { values: msg.values };
        if (msg.device_id === "ams01") {
          barsAms01.unshift(entry);
          if (barsAms01.length > MAX) barsAms01.pop();
        } else if (msg.device_id === "ams02") {
          barsAms02.unshift(entry);
          if (barsAms02.length > MAX) barsAms02.pop();
        }
      }
    } catch (e) {}
  };
}

function drawBars(bars, yOffset, h) {
  const w = width / bars.length;
  for (let i = 0; i < bars.length; i++) {
    const rgb = bars[i].values;
    fill(rgb.r, rgb.g, rgb.b);
    rect(i * w, yOffset, w + 1, h);
  }
}

function draw() {
  background(220);
  const half = height / 2;
  if (barsAms01.length) drawBars(barsAms01, 0, half);
  if (barsAms02.length) drawBars(barsAms02, half, half);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
