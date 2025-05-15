const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const katakana = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const columns = canvas.width / 20;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0f0";
  ctx.font = "16px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
    ctx.fillText(text, i * 20, drops[i] * 20);

    drops[i] = (drops[i] * 20 > canvas.height || Math.random() > 0.95) ? 0 : drops[i] + 1;
  }
}

setInterval(drawMatrix, 50);
