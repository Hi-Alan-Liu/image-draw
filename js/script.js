var canvas = document.getElementById('art');
var ctx = canvas.getContext('2d');

const compStyle = window.getComputedStyle(canvas);
const width = parseInt(compStyle.getPropertyValue('width').replace('px', ''));
const height = parseInt(compStyle.getPropertyValue('height').replace('px', ''));
canvas.width = width;
canvas.height = height;
ctx.fillStyle="#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const position = { x: 0, y: 0 };

const updatePosition = (event) => {
  let rect = canvas.getBoundingClientRect();
  position.x = (event.clientX - rect.left) * (width / rect.width);
  position.y = (event.clientY - rect.top) * (height / rect.height);
}

let drawing = false;
var min = 5, max = 15, select = document.getElementById('lineSize');
var imageResult;

let track = []
let current_track;

window.addEventListener('touchstart', { passive: false });
window.addEventListener('touchmove', { passive: false });
window.addEventListener('touchend', { passive: false });

for (var i = min; i <= max; i++) {
  var opt = document.createElement('option');
  opt.value = i;
  opt.innerHTML = `${i}px`;
  select.appendChild(opt);
}
select.value = 5;
current_track = canvas.toDataURL("image/png");

canvas.addEventListener('mousemove', pointermove);
canvas.addEventListener('mousedown', pointerdown);
canvas.addEventListener('mouseup', pointerup);

document.addEventListener('touchstart', function(e) { pointerdown(e, true) });
document.addEventListener('touchmove', function(e) { pointermove(e, true) });
document.addEventListener('touchend', pointerup);

canvas.addEventListener ("mouseout", event => {
  ctx.closePath();
  drawing = false;
});

document.getElementById("inputFile").onchange = function() {
  if (!this.files || !this.files[0]) return;

  const fileReader = new FileReader();

  fileReader.addEventListener("load", function(evt) {
    imageResult = evt.target.result;
    make_base();
  }); 
    
  fileReader.readAsDataURL(this.files[0]);
}

document.getElementById("clearCanvas").onclick = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  make_base();
}

document.getElementById("saveCanvas").onclick = function() {
  var image = document.createElement("a");
  image.href = canvas.toDataURL("image/png");
  image.download = "Image.png";
  image.click();
}

document.getElementById("back").onclick = function() {
  if (track.length < 1) return
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  current_track = track[track.length];
  drawImage(track[track.length - 1]);
  track.pop();
}

document.getElementById("recovery").onclick = function() {
  if (current_track < 1) return
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawImage(current_track);
}

function pointerdown(event, isTouch) {
  var color = document.getElementById("colorpicker").value;
  var size = document.getElementById("lineSize").value;
  updatePosition(isTouch ? event.touches[0] : event);
  ctx.beginPath();
  ctx.moveTo(position.x, position.y)
  ctx.arc(position.x, position.y, ctx.lineWidth / 4, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  drawing = true;
}

function pointermove(event, isTouch) {
  if (!drawing) return;
  updatePosition(isTouch ? event.touches[0] : event);
  ctx.lineTo(position.x, position.y);
  ctx.stroke();
}

function pointerup() {
  recordTrack();
  ctx.closePath();
  drawing = false;
}

function make_base(){
  if (imageResult === undefined) return;
  drawImage(imageResult);
}

function drawImage(img) {
  var baseImage = new Image();
  baseImage.src = `${img}`;
  baseImage.onload = function () {
    var wrh = baseImage.width / baseImage.height;
    var newWidth = canvas.width;
    var newHeight = newWidth / wrh;
    if (newHeight > canvas.height) {
      newHeight = canvas.height;
      newWidth = newHeight * wrh;
    }
    var xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
    var yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;

    ctx.drawImage(baseImage, xOffset, yOffset, newWidth, newHeight);
  }
}

function recordTrack() {
  if (current_track != undefined) { track.push(current_track); }
  if (track.length > 5) { track.shift(); }
  current_track = canvas.toDataURL("image/png");
}