//******************************************/
// CODE SOURCE DES PARTICULES SLIDER (titre)
//******************************************/
/* -----------------------------------------------
/* Justin Allard - justinallard.ca
/* MIT license: https://opensource.org/licenses/MIT
/* v1.0.0 - 2014-07-01
/* ----------------------------------------------- */

function ParticleSlider(configurationParticleSlider) {
  var particleSlider = this;

  // INITIALISATION DES PROPRIÉTÉS PAR DÉFAUT
  particleSlider.sliderId = "particle-slider";
  particleSlider.color = "#FFFFFF";
  particleSlider.hoverColor = "#8888FF";
  particleSlider.width = 0;
  particleSlider.height = 20;
  particleSlider.ptlGap = 0;
  particleSlider.ptlSize = 1;
  particleSlider.slideDelay = 10;
  particleSlider.arrowPadding = 10;
  particleSlider.showArrowControls = true;
  particleSlider.onNextSlide = null;
  particleSlider.onWidthChange = null;
  particleSlider.onHeightChange = null;
  particleSlider.onSizeChange = null;
  particleSlider.monochrome = false;
  particleSlider.mouseForce = 5000;
  particleSlider.restless = true;
  particleSlider.imgs = [];

  // APPLICATION DE LA CONFIGURATION PERSONNALISÉE
  if (configurationParticleSlider) {
    var configKeys = [
      "color",
      "hoverColor",
      "width",
      "height",
      "ptlGap",
      "ptlSize",
      "slideDelay",
      "arrowPadding",
      "sliderId",
      "showArrowControls",
      "onNextSlide",
      "monochrome",
      "mouseForce",
      "restless",
      "imgs",
      "onSizeChange",
      "onWidthChange",
      "onHeightChange",
    ];
    for (var i = 0, len = configKeys.length; i < len; i++) {
      if (configurationParticleSlider[configKeys[i]]) {
        particleSlider[configKeys[i]] =
          configurationParticleSlider[configKeys[i]];
      }
    }
  }

  // INITIALISATION DES ÉLÉMENTS DOM
  particleSlider.$container = particleSlider.$("#" + particleSlider.sliderId);
  particleSlider.$$children = particleSlider.$container.childNodes;
  particleSlider.$controlsContainer = particleSlider.$(".controls");
  particleSlider.$$slides = particleSlider.$(
    ".slide",
    particleSlider.$(".slides").childNodes,
    true
  );
  particleSlider.$controlLeft = null;
  particleSlider.$controlRight = null;
  particleSlider.$canv = particleSlider.$(".draw");

  // CRÉATION DES CANVAS CACHÉS
  particleSlider.$srcCanv = document.createElement("canvas");
  particleSlider.$srcCanv.style.display = "none";
  particleSlider.$container.appendChild(particleSlider.$srcCanv);

  particleSlider.$prevCanv = document.createElement("canvas");
  particleSlider.$prevCanv.style.display = "none";
  particleSlider.$container.appendChild(particleSlider.$prevCanv);

  particleSlider.$nextCanv = document.createElement("canvas");
  particleSlider.$nextCanv.style.display = "none";
  particleSlider.$container.appendChild(particleSlider.$nextCanv);

  particleSlider.$overlay = document.createElement("p");
  particleSlider.$container.appendChild(particleSlider.$overlay);

  particleSlider.imgControlPrev = null;
  particleSlider.imgControlNext = null;

  if (particleSlider.$$slides.length <= 1) {
    particleSlider.showArrowControls = false;
  }

  if (particleSlider.$controlsContainer && particleSlider.showArrowControls) {
    particleSlider.$controlLeft = particleSlider.$(
      ".left",
      particleSlider.$controlsContainer.childNodes
    );
    particleSlider.$controlRight = particleSlider.$(
      ".right",
      particleSlider.$controlsContainer.childNodes
    );
    particleSlider.imgControlPrev = new Image();
    particleSlider.imgControlNext = new Image();

    particleSlider.imgControlPrev.onload = function () {
      particleSlider.$prevCanv.height = this.height;
      particleSlider.$prevCanv.width = this.width;
      particleSlider.loadingStep();
    };

    particleSlider.imgControlNext.onload = function () {
      particleSlider.$nextCanv.height = this.height;
      particleSlider.$nextCanv.width = this.width;
      particleSlider.loadingStep();
    };

    particleSlider.imgControlPrev.src =
      particleSlider.$controlLeft.getAttribute("data-src");
    particleSlider.imgControlNext.src =
      particleSlider.$controlRight.getAttribute("data-src");
  }

  particleSlider.width =
    particleSlider.width || particleSlider.$container.clientWidth;
  particleSlider.height =
    particleSlider.height || particleSlider.$container.clientHeight;

  particleSlider.mouseDownRegion = 0;
  particleSlider.colorArr = particleSlider.parseColor(particleSlider.color);
  particleSlider.hoverColorArr = particleSlider.parseColor(
    particleSlider.hoverColor
  );
  particleSlider.mx = -1;
  particleSlider.my = -1;
  particleSlider.swipeOffset = 0;
  particleSlider.cw = particleSlider.getCw();
  particleSlider.ch = particleSlider.getCh();
  particleSlider.frame = 0;
  particleSlider.nextSlideTimer = false;
  particleSlider.currImg = 0;
  particleSlider.lastImg = 0;
  particleSlider.imagesLoaded = 0;
  particleSlider.pxlBuffer = { first: null };
  particleSlider.recycleBuffer = { first: null };
  particleSlider.ctx = particleSlider.$canv.getContext("2d");
  particleSlider.srcCtx = particleSlider.$srcCanv.getContext("2d");
  particleSlider.prevCtx = particleSlider.$prevCanv.getContext("2d");
  particleSlider.nextCtx = particleSlider.$nextCanv.getContext("2d");
  particleSlider.$canv.width = particleSlider.cw;
  particleSlider.$canv.height = particleSlider.ch;

  // GESTION DES ÉVÉNEMENTS
  particleSlider.$canv.onmouseout = function () {
    particleSlider.mx = -1;
    particleSlider.my = -1;
    particleSlider.mouseDownRegion = 0;
  };

  particleSlider.$canv.onmousemove = function (event) {
    function calculateOffset(element) {
      var offsetX = 0,
        offsetY = 0;
      if (element) {
        offsetX = element.offsetLeft;
        offsetY = element.offsetTop;
        var body = document.getElementsByTagName("body")[0];
        while (element.offsetParent && element != body) {
          offsetX += element.offsetParent.offsetLeft;
          offsetY += element.offsetParent.offsetTop;
          element = element.offsetParent;
        }
      }
      this.x = offsetX;
      this.y = offsetY;
    }

    var offset = new calculateOffset(particleSlider.$container);
    particleSlider.mx =
      event.clientX -
      offset.x +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    particleSlider.my =
      event.clientY -
      offset.y +
      document.body.scrollTop +
      document.documentElement.scrollTop;
  };

  particleSlider.$canv.onmousedown = function () {
    if (particleSlider.imgs.length > 1) {
      var region = 0;
      if (
        particleSlider.mx >= 0 &&
        particleSlider.mx <
          particleSlider.arrowPadding * 2 + particleSlider.$prevCanv.width
      ) {
        region = -1;
      } else if (
        particleSlider.mx > 0 &&
        particleSlider.mx >
          particleSlider.cw -
            (particleSlider.arrowPadding * 2 + particleSlider.$nextCanv.width)
      ) {
        region = 1;
      }
      particleSlider.mouseDownRegion = region;
    }
  };

  particleSlider.$canv.onmouseup = function () {
    if (particleSlider.imgs.length > 1) {
      var direction = "";
      if (
        particleSlider.mx >= 0 &&
        particleSlider.mx <
          particleSlider.arrowPadding * 2 + particleSlider.$prevCanv.width
      ) {
        direction = -1;
      } else if (
        particleSlider.mx > 0 &&
        particleSlider.mx >
          particleSlider.cw -
            (particleSlider.arrowPadding * 2 + particleSlider.$nextCanv.width)
      ) {
        direction = 1;
      }
      if (direction !== 0 && particleSlider.mouseDownRegion !== 0) {
        if (direction !== particleSlider.mouseDownRegion) direction *= -1;
        if (particleSlider.nextSlideTimer)
          clearTimeout(particleSlider.nextSlideTimer);
        particleSlider.nextSlide(direction);
        particleSlider.mouseDownRegion = 0;
      }
    }
  };

  // CHARGEMENT DES IMAGES ET DÉMARRAGE DE L'ANIMATION
  if (particleSlider.imgs.length === 0) {
    for (var i = 0, len = particleSlider.$$slides.length; i < len; i++) {
      var img = new Image();
      particleSlider.imgs.push(img);
      img.src = particleSlider.$$slides[i].getAttribute("data-src");
    }
  }

  if (particleSlider.imgs.length > 0) {
    particleSlider.imgs[0].onload = function () {
      particleSlider.loadingStep();
    };
  }

  particleSlider.requestAnimationFrame(function () {
    particleSlider.nextFrame();
  });
}

// FONCTIONS ET PROTOTYPES SUPPLÉMENTAIRES
var Particle = function (particleSlider) {
  this.ps = particleSlider;
  this.ttl = null;
  this.color = particleSlider.colorArr;
  this.next = null;
  this.prev = null;
  this.gravityX = 0;
  this.gravityY = 0;
  this.x = Math.random() * particleSlider.cw;
  this.y = Math.random() * particleSlider.ch;
  this.velocityX = Math.random() * 10 - 5;
  this.velocityY = Math.random() * 10 - 5;
};

Particle.prototype.move = function () {
  var particleSlider = this.ps,
    particle = this;

  if (this.ttl != null && this.ttl-- <= 0) {
    particleSlider.swapList(
      particle,
      particleSlider.pxlBuffer,
      particleSlider.recycleBuffer
    );
    this.ttl = null;
  } else {
    var deltaX = this.gravityX + particleSlider.swipeOffset - this.x,
      deltaY = this.gravityY - this.y,
      distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)),
      angle = Math.atan2(deltaY, deltaX),
      acceleration = distance * 0.01;
    if (particleSlider.restless) {
      acceleration += Math.random() * 0.1 - 0.05;
    } else if (acceleration < 0.01) {
      this.x = this.gravityX + 0.25;
      this.y = this.gravityY + 0.25;
    }
    var mouseAcceleration = 0,
      mouseAngle = 0;
    if (particleSlider.mx >= 0 && particleSlider.mouseForce) {
      var deltaMouseX = this.x - particleSlider.mx,
        deltaMouseY = this.y - particleSlider.my;
      mouseAcceleration = Math.min(
        particleSlider.mouseForce /
          (Math.pow(deltaMouseX, 2) + Math.pow(deltaMouseY, 2)),
        particleSlider.mouseForce
      );
      mouseAngle = Math.atan2(deltaMouseY, deltaMouseX);
      if (typeof this.color == "function") {
        mouseAngle += Math.PI;
        mouseAcceleration *= 0.001 + Math.random() * 0.1 - 0.05;
      }
    }
    this.velocityX +=
      acceleration * Math.cos(angle) + mouseAcceleration * Math.cos(mouseAngle);
    this.velocityY +=
      acceleration * Math.sin(angle) + mouseAcceleration * Math.sin(mouseAngle);
    this.velocityX *= 0.92;
    this.velocityY *= 0.92;
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
};

ParticleSlider.prototype.Particle = Particle;

ParticleSlider.prototype.swapList = function (
  particle,
  sourceBuffer,
  destinationBuffer
) {
  var particleSlider = this;
  if (particle == null) {
    particle = new particleSlider.Particle(particleSlider);
  } else if (sourceBuffer.first == particle) {
    if (particle.next != null) {
      particle.next.prev = null;
      sourceBuffer.first = particle.next;
    } else {
      sourceBuffer.first = null;
    }
  } else if (particle.next == null) {
    particle.prev.next = null;
  } else {
    particle.prev.next = particle.next;
    particle.next.prev = particle.prev;
  }
  if (destinationBuffer.first == null) {
    destinationBuffer.first = particle;
    particle.prev = null;
    particle.next = null;
  } else {
    particle.next = destinationBuffer.first;
    destinationBuffer.first.prev = particle;
    destinationBuffer.first = particle;
    particle.prev = null;
  }
};

ParticleSlider.prototype.parseColor = function (color) {
  var colorArray,
    color = color.replace(" ", "");
  if (
    (colorArray = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(color))
  ) {
    colorArray = [
      parseInt(colorArray[1], 16),
      parseInt(colorArray[2], 16),
      parseInt(colorArray[3], 16),
    ];
  } else if (
    (colorArray = /^#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(color))
  ) {
    colorArray = [
      parseInt(colorArray[1], 16) * 17,
      parseInt(colorArray[2], 16) * 17,
      parseInt(colorArray[3], 16) * 17,
    ];
  } else if (
    (colorArray = /^rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(
      color
    ))
  ) {
    colorArray = [
      +colorArray[1],
      +colorArray[2],
      +colorArray[3],
      +colorArray[4],
    ];
  } else if ((colorArray = /^rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(color))) {
    colorArray = [+colorArray[1], +colorArray[2], +colorArray[3]];
  } else {
    return null;
  }
  if (isNaN(colorArray[3])) colorArray[3] = 1;
  colorArray[3] *= 255;
  return colorArray;
};

ParticleSlider.prototype.loadingStep = function () {
  var particleSlider = this;
  particleSlider.imagesLoaded++;
  if (particleSlider.imagesLoaded >= 3 || !particleSlider.showArrowControls) {
    particleSlider.resize();
    if (particleSlider.slideDelay > 0) {
      particleSlider.nextSlideTimer = setTimeout(function () {
        particleSlider.nextSlide();
      }, 1000 * particleSlider.slideDelay);
    }
  }
};

ParticleSlider.prototype.$ = function (selector, children, all) {
  var particleSlider = this;
  if (selector[0] == ".") {
    var className = selector.substr(1);
    if (!children) children = particleSlider.$$children;
    var elements = [];
    for (var i = 0, len = children.length; i < len; i++) {
      if (children[i].className && children[i].className == className) {
        elements.push(children[i]);
      }
    }
    return elements.length == 0
      ? null
      : elements.length == 1 && !all
      ? elements[0]
      : elements;
  }
  return document.getElementById(selector.substr(1));
};

ParticleSlider.prototype.nextFrame = function () {
  var particleSlider = this;
  if (
    (particleSlider.mouseDownRegion == 1 &&
      particleSlider.mx < particleSlider.cw / 2) ||
    (particleSlider.mouseDownRegion == -1 &&
      particleSlider.mx > particleSlider.cw / 2)
  ) {
    particleSlider.swipeOffset = particleSlider.mx - particleSlider.cw / 2;
  } else {
    particleSlider.swipeOffset = 0;
  }
  var currentParticle = particleSlider.pxlBuffer.first,
    nextParticle = null;
  while (currentParticle != null) {
    nextParticle = currentParticle.next;
    currentParticle.move();
    currentParticle = nextParticle;
  }
  particleSlider.drawParticles();
  if (
    particleSlider.frame++ % 25 == 0 &&
    (particleSlider.cw != particleSlider.getCw() ||
      particleSlider.ch != particleSlider.getCh())
  ) {
    var newHeight = particleSlider.getCh(),
      newWidth = particleSlider.getCw();
    if (
      particleSlider.ch != newWidth &&
      typeof particleSlider.onWidthChange == "function"
    )
      particleSlider.onWidthChange(particleSlider, newWidth);
    if (
      particleSlider.ch != newHeight &&
      typeof particleSlider.onHeightChange == "function"
    )
      particleSlider.onHeightChange(particleSlider, newHeight);
    if (typeof particleSlider.onSizeChange == "function")
      particleSlider.onSizeChange(particleSlider, newWidth, newHeight);
    particleSlider.resize();
  }
  setTimeout(function () {
    particleSlider.requestAnimationFrame(function () {
      particleSlider.nextFrame();
    });
  }, 15);
};

ParticleSlider.prototype.nextSlide = function (direction) {
  var particleSlider = this;
  if (particleSlider.nextSlideTimer != null && particleSlider.imgs.length > 1) {
    particleSlider.currImg =
      (particleSlider.currImg +
        particleSlider.imgs.length +
        (direction ? direction : 1)) %
      particleSlider.imgs.length;
    particleSlider.resize();
    if (particleSlider.slideDelay > 0) {
      particleSlider.nextSlideTimer = setTimeout(function () {
        particleSlider.nextSlide();
      }, 1000 * particleSlider.slideDelay);
    }
  } else if (particleSlider.slideDelay > 0) {
    particleSlider.nextSlideTimer = setTimeout(function () {
      particleSlider.nextSlide();
    }, 1000 * particleSlider.slideDelay);
  }
  if (typeof particleSlider.onNextSlide == "function") {
    particleSlider.onNextSlide(particleSlider.currImg);
  }
};

ParticleSlider.prototype.drawParticles = function () {
  var particleSlider = this,
    imageData = particleSlider.ctx.createImageData(
      particleSlider.cw,
      particleSlider.ch
    ),
    data = imageData.data,
    particle,
    x,
    y,
    pixelIndex,
    color,
    currentParticle = particleSlider.pxlBuffer.first;
  while (currentParticle != null) {
    x = ~~currentParticle.x;
    y = ~~currentParticle.y;
    for (
      var pixelX = x;
      pixelX < x + particleSlider.ptlSize &&
      pixelX >= 0 &&
      pixelX < particleSlider.cw;
      pixelX++
    ) {
      for (
        var pixelY = y;
        pixelY < y + particleSlider.ptlSize &&
        pixelY >= 0 &&
        pixelY < particleSlider.ch;
        pixelY++
      ) {
        pixelIndex = (pixelY * imageData.width + pixelX) * 4;
        color =
          typeof currentParticle.color == "function"
            ? currentParticle.color()
            : currentParticle.color;
        data[pixelIndex + 0] = color[0];
        data[pixelIndex + 1] = color[1];
        data[pixelIndex + 2] = color[2];
        data[pixelIndex + 3] = color[3];
      }
    }
    currentParticle = currentParticle.next;
  }
  imageData.data = data;
  particleSlider.ctx.putImageData(imageData, 0, 0);
};

ParticleSlider.prototype.getPixelFromImageData = function (
  imageData,
  offsetX,
  offsetY
) {
  var particleSlider = this,
    particles = [];
  for (var x = 0; x < imageData.width; x += particleSlider.ptlGap + 1) {
    for (var y = 0; y < imageData.height; y += particleSlider.ptlGap + 1) {
      var pixelIndex = (y * imageData.width + x) * 4;
      if (imageData.data[pixelIndex + 3] > 0) {
        particles.push({
          x: offsetX + x,
          y: offsetY + y,
          color: particleSlider.monochrome
            ? [
                particleSlider.colorArr[0],
                particleSlider.colorArr[1],
                particleSlider.colorArr[2],
                particleSlider.colorArr[3],
              ]
            : [
                imageData.data[pixelIndex],
                imageData.data[pixelIndex + 1],
                imageData.data[pixelIndex + 2],
                imageData.data[pixelIndex + 3],
              ],
        });
      }
    }
  }
  return particles;
};

ParticleSlider.prototype.initializeSourceParticles = function (forceUpdate) {
  var particleSlider = this;

  if (particleSlider.imgs.length > 0) {
    particleSlider.$srcCanv.width =
      particleSlider.imgs[particleSlider.currImg].width;
    particleSlider.$srcCanv.height =
      particleSlider.imgs[particleSlider.currImg].height;
    particleSlider.srcCtx.clearRect(
      0,
      0,
      particleSlider.$srcCanv.width,
      particleSlider.$srcCanv.height
    );
    particleSlider.srcCtx.drawImage(
      particleSlider.imgs[particleSlider.currImg],
      0,
      0
    );
    var particles = particleSlider.getPixelFromImageData(
      particleSlider.srcCtx.getImageData(
        0,
        0,
        particleSlider.$srcCanv.width,
        particleSlider.$srcCanv.height
      ),
      ~~(particleSlider.cw / 2 - particleSlider.$srcCanv.width / 2),
      ~~(particleSlider.ch / 2 - particleSlider.$srcCanv.height / 2)
    );

    if (particleSlider.showArrowControls) {
      particleSlider.prevCtx.clearRect(
        0,
        0,
        particleSlider.$prevCanv.width,
        particleSlider.$prevCanv.height
      );
      particleSlider.prevCtx.drawImage(particleSlider.imgControlPrev, 0, 0);
      var prevParticles = particleSlider.getPixelFromImageData(
        particleSlider.prevCtx.getImageData(
          0,
          0,
          particleSlider.$prevCanv.width,
          particleSlider.$prevCanv.height
        ),
        particleSlider.arrowPadding,
        ~~(particleSlider.ch / 2 - particleSlider.$prevCanv.height / 2)
      );

      prevParticles.forEach(function (particle) {
        particle.color = function () {
          return particleSlider.mx >= 0 &&
            particleSlider.mx <
              particleSlider.arrowPadding * 2 + particleSlider.$prevCanv.width
            ? particleSlider.hoverColorArr
            : particleSlider.colorArr;
        };
        particles.push(particle);
      });

      particleSlider.nextCtx.clearRect(
        0,
        0,
        particleSlider.$nextCanv.width,
        particleSlider.$nextCanv.height
      );
      particleSlider.nextCtx.drawImage(particleSlider.imgControlNext, 0, 0);
      var nextParticles = particleSlider.getPixelFromImageData(
        particleSlider.nextCtx.getImageData(
          0,
          0,
          particleSlider.$nextCanv.width,
          particleSlider.$nextCanv.height
        ),
        particleSlider.cw -
          particleSlider.arrowPadding -
          particleSlider.$nextCanv.width,
        ~~(particleSlider.ch / 2 - particleSlider.$nextCanv.height / 2)
      );

      nextParticles.forEach(function (particle) {
        particle.color = function () {
          return particleSlider.mx > 0 &&
            particleSlider.mx >
              particleSlider.cw -
                (particleSlider.arrowPadding * 2 +
                  particleSlider.$nextCanv.width)
            ? particleSlider.hoverColorArr
            : particleSlider.colorArr;
        };
        particles.push(particle);
      });
    }

    if (particleSlider.currImg != particleSlider.lastImg || forceUpdate) {
      particles.shuffle();
      particleSlider.lastImg = particleSlider.currImg;
    }

    var bufferParticle = particleSlider.pxlBuffer.first;

    particles.forEach(function (particle) {
      var newParticle = null;
      if (bufferParticle != null) {
        newParticle = bufferParticle;
        bufferParticle = bufferParticle.next;
      } else {
        particleSlider.swapList(
          particleSlider.recycleBuffer.first,
          particleSlider.recycleBuffer,
          particleSlider.pxlBuffer
        );
        newParticle = particleSlider.pxlBuffer.first;
      }
      newParticle.gravityX = particle.x;
      newParticle.gravityY = particle.y;
      newParticle.color = particle.color;
    });

    while (bufferParticle != null) {
      bufferParticle.ttl = ~~(Math.random() * 10);
      bufferParticle.gravityY = ~~(particleSlider.ch * Math.random());
      bufferParticle.gravityX = ~~(particleSlider.cw * Math.random());
      bufferParticle = bufferParticle.next;
    }

    particleSlider.$overlay.innerHTML =
      particleSlider.$$slides[particleSlider.currImg].innerHTML;
  }
};

ParticleSlider.prototype.getCw = function () {
  var particleSlider = this;
  return Math.min(
    document.body.clientWidth,
    particleSlider.width,
    particleSlider.$container.clientWidth
  );
};

ParticleSlider.prototype.getCh = function () {
  var particleSlider = this;
  return Math.min(
    document.body.clientHeight,
    particleSlider.height,
    particleSlider.$container.clientHeight
  );
};

ParticleSlider.prototype.resize = function () {
  var particleSlider = this;
  particleSlider.cw = particleSlider.getCw();
  particleSlider.ch = particleSlider.getCh();
  particleSlider.$canv.width = particleSlider.cw;
  particleSlider.$canv.height = particleSlider.ch;
  particleSlider.initializeSourceParticles(true);
};

ParticleSlider.prototype.setColor = function (color) {
  var particleSlider = this;
  particleSlider.colorArr = particleSlider.parseColor(color);
};

ParticleSlider.prototype.setHoverColor = function (color) {
  var particleSlider = this;
  particleSlider.hoverColorArr = particleSlider.parseColor(color);
};

ParticleSlider.prototype.requestAnimationFrame = function (callback) {
  var particleSlider = this;
  var requestAnimationFrameFunction =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  requestAnimationFrameFunction(callback);
};

// FONCTION DE MÉLANGE POUR LES TABLEAUX
Array.prototype.shuffle = function () {
  var temp, randomIndex;
  for (var i = 0, len = this.length; i < len; i++) {
    randomIndex = Math.floor(Math.random() * len);
    temp = this[i];
    this[i] = this[randomIndex];
    this[randomIndex] = temp;
  }
};
