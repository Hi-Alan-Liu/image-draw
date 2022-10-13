var canvas = document.getElementById('art');
var ctx = canvas.getContext('2d');

const compStyle = window.getComputedStyle(canvas);
const width = parseInt(compStyle.getPropertyValue('width').replace('px', ''));
const height = parseInt(compStyle.getPropertyValue('height').replace('px', ''));

canvas.width = width;
canvas.height = height;

const position = {
  x: 0,
  y: 0
};

const updatePosition = (event) => {
  let rect = event.target.getBoundingClientRect();
  position.x = (event.clientX - rect.left) * (width / rect.width);
  position.y = (event.clientY - rect.top) * (height / rect.height);
}

let drawing = false;

var min = 1, max = 15, select = document.getElementById('lineSize');

for (var i = min; i <= max; i++){
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = `${i}px`;
    select.appendChild(opt);
}

canvas.addEventListener('mousemove', pointermove);
canvas.addEventListener('mousedown', pointerdown);
canvas.addEventListener('mouseup', pointerup);

document.addEventListener('touchstart', pointerdown);
document.addEventListener('touchmove', pointermove);
document.addEventListener('touchend', pointerup);

canvas.addEventListener ("mouseout", event => {
  ctx.closePath();
  drawing = false;
});

document.getElementById("saveCanvas").onclick = function() {
  var image = document.createElement("a");
  image.href = canvas.toDataURL("image/png");
  image.download = "Image.png";
  image.click();
}

document.getElementById("inputFile").onchange = function() {
  if (!this.files || !this.files[0]) return;

  const fileReader = new FileReader();

  fileReader.addEventListener("load", function(evt) {
    make_base(evt.target.result);
  }); 
    
  fileReader.readAsDataURL(this.files[0]);
}

function pointerdown() {
  event.preventDefault();
  var color = document.getElementById("colorpicker").value;
  var size = document.getElementById("lineSize").value;
  updatePosition(event);
  ctx.beginPath();
  ctx.moveTo(position.x, position.y)
  ctx.arc(position.x, position.y, ctx.lineWidth / 4, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  drawing = true;
}

function pointermove() {
  if (!drawing) return;
  event.preventDefault();
  updatePosition(event);
  ctx.lineTo(position.x, position.y);
  ctx.stroke();
}

function pointerup() {
  ctx.closePath();
  drawing = false;
}

function make_base(img)
{
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