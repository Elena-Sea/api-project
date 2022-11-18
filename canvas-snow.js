var canvas = document.getElementById('snow'),
  ctx = canvas.getContext('2d'),
  height = canvas.height = document.body.offsetHeight,
  width = canvas.width = document.body.offsetWidth,
  collection = [],
  num_drops = 1024,
  gravity = 1,
  windforce = 0,
  windmultiplier = 0.003,
  gutter = 0.001;

function Drop() {
  this.x;
  this.y;
  this.radius;
  this.distance;
  this.color;
  this.speed;
  this.vx;
  this.vy;
}
Drop.prototype = {
  constructor: Drop,
  
  new_x: function() {
    var n = width * (1 + gutter);
    return (1 - (1 + gutter)) + (Math.random() * n);
  },
  draw: function(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
  }
};

function draw_frame() {
  ctx.clearRect(0, 0, width, height);
  collection.forEach(function (drop) {
    ctx.globalAlpha = (drop.distance + 1) / 10;
    drop.draw(ctx);
    ctx.globalAlpha = 1;
    drop.x += drop.vx;
    drop.y += drop.vy;
    drop.vx += windforce;
    if (drop.y > (drop.distance + 1) / 10 * height) {
      drop.y = Math.random() * -drop.radius * (num_drops / 10);
      drop.x = drop.new_x();
    }
    if (drop.x > width * (1 + gutter)) {
      drop.x = 1 - (width * gutter);
    }
    if (drop.x < 1 - (width * gutter)) {
      drop.x = width * (1 + gutter);
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  draw_frame();
}

function windtimer() {
  windforce = Math.random() > 0.5 ? windmultiplier : -windmultiplier;
  setTimeout(windtimer, Math.random() * (100 * 30));
}

function init() {
  while (num_drops--) {
    var drop = new Drop();
    drop.color = "white";
    drop.distance = Math.random() * 10 | 0;
    drop.speed = Math.random() * (drop.distance / 10) + gravity;
    drop.vx = 0;
    drop.vy = Math.random() * drop.speed + (drop.speed / 5);
    drop.radius = (drop.distance + 1) / 16 * 10;
    drop.y = Math.random() * height;
    drop.x = drop.new_x();
    collection.push(drop);
  }
  windtimer();
  animate();
  window.onresize = function() {
    height = canvas.height = document.body.offsetHeight;
    width = canvas.width = document.body.offsetWidth;
  }
}
init();