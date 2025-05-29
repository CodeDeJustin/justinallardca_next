//******************************************/
// GESTION DES PARTICULES POUR LE TITRE
//******************************************/
var initParticleSlider = function () {
  var psScript = document.createElement("script");
  psScript.onload = function () {
    var isMobile =
      navigator.userAgent &&
      navigator.userAgent.toLowerCase().indexOf("mobile") >= 0;
    var isSmall = window.innerWidth < 1000;

    var psContainer = document.createElement("div");
    psContainer.id = "ps-container";
    document.body.appendChild(psContainer);
    psContainer.style.position = "fixed";
    psContainer.style.top = "0";
    psContainer.style.left = "0";
    psContainer.style.width = "100vw";
    psContainer.style.height = "100vh";
    psContainer.style.zIndex = "10";
    psContainer.style.pointerEvents = "none";

    var ps = new ParticleSlider({
      ptlGap: isMobile || isSmall ? 3 : 0,
      ptlSize: isMobile || isSmall ? 3 : 1,
      width: window.innerWidth,
      height: window.innerHeight,
      container: psContainer,
    });

    window.addEventListener(
      "click",
      function () {
        ps.init(true);
      },
      false
    );
  };

  psScript.src = "js/particleslider.js";
  psScript.setAttribute("type", "text/javascript");
  document.body.appendChild(psScript);
};

window.addEventListener("load", initParticleSlider, false);


//******************************************/
// GESTION DES PARTICULES POUR LE FOND
//******************************************/
// Définition des couleurs des particules et des lignes en mode clair et sombre
const PRIMARY_PARTICLE_COLOR_LIGHT = ["#3576E2", "#505050"];
const PRIMARY_PARTICLE_COLOR_DARK = ["#3576E2", "#E8E8E8"];
const LINE_LINKED_COLOR_LIGHT = "#333333";
const LINE_LINKED_COLOR_DARK = "#CCCCCC";
const PARTICLE_OPACITY = 0.6;
const LINE_LINKED_OPACITY = 0.4;

// Fonction pour obtenir les couleurs actuelles selon le thème
function getCurrentThemeColors() {
  const theme = document.body.getAttribute("data-theme");
  const isDarkMode = theme === "dark";

  return {
    particleColor: isDarkMode
      ? PRIMARY_PARTICLE_COLOR_DARK
      : PRIMARY_PARTICLE_COLOR_LIGHT,
    lineLinkedColor: isDarkMode
      ? LINE_LINKED_COLOR_DARK
      : LINE_LINKED_COLOR_LIGHT,
  };
}

// Configuration des particules
function configParticles(particleColor, lineLinkedColor) {
  return {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 1500,
      },
    },
    color: {
      value: particleColor,
    },
    shape: {
      type: "polygone",
      stroke: {
        width: 0,
        color: lineLinkedColor,
      },
      polygon: {
        nb_sides: 6,
      },
    },
    opacity: {
      value: PARTICLE_OPACITY,
      random: true,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.4,
        sync: false,
      },
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: false,
        speed: 4,
        size_min: 1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: lineLinkedColor,
      opacity: LINE_LINKED_OPACITY,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: "top",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: true,
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  };
}

// Configuration de l'interactivité des particules
function configInteractivity() {
  return {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab",
      },
      onclick: {
        enable: true,
        mode: "bubble",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 200,
        line_linked: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 200,
        size: 7,
        duration: 0.2,
        opacity: 8,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  };
}

// Fonction pour initialiser ou réinitialiser les particules
function initParticles() {
  if (window.pJSDom && window.pJSDom.length) {
    // Détruire les instances existantes des particules
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }

  const { particleColor, lineLinkedColor } = getCurrentThemeColors();
  particlesJS("particles-js", {
    particles: configParticles(particleColor, lineLinkedColor),
    interactivity: configInteractivity(),
    retina_detect: true,
  });
}


//******************************************/
// GESTION POUR EMPÊCHER LA COPIE D'IMAGES
//******************************************/
document.addEventListener("contextmenu", function (e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});


//******************************************/
// GESTION DU MODE CLAIR - SOMBRE
//******************************************/
document.addEventListener("DOMContentLoaded", (event) => {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const body = document.body;

  function toggleTheme(isDark) {
    if (isDark) {
      body.setAttribute("data-theme", "dark");
      themeIcon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "dark");
    } else {
      body.removeAttribute("data-theme");
      themeIcon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "light");
    }
  }

  const currentTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  toggleTheme(currentTheme === "dark");

  themeToggle.addEventListener("click", () => {
    body.classList.add("transition-enabled");
    const isDarkTheme = body.getAttribute("data-theme") === "dark";
    toggleTheme(!isDarkTheme);
    setTimeout(() => body.classList.remove("transition-enabled"), 500);
    initParticles();
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (!localStorage.getItem("theme")) {
        toggleTheme(event.matches);
        initParticles();
      }
    });

  // Initialisation des particules au chargement du document
  initParticles();
});


//******************************************/
// GESTION DU MENU HAMBURGER
//******************************************/
window.onload = function () {
  var checkbox = document.getElementById("menu-toggle-checkbox");
  if (checkbox) {
    checkbox.checked = false;
  }
};


//******************************************/
// GESTION DU MESSAGE DES ONGLETS
//******************************************/
document.addEventListener("DOMContentLoaded", () => {
  const originalTitle = document.title;
  const awayMessage = "NON! RESTE AVEC MOI! 😭";
  const originalFavicon = document
    .getElementById("favicon")
    .getAttribute("href");
  const newFavicon = "media/coffee-icon.ico";

  const isConfidentialityPage =
    window.location.pathname.includes("confidentialite-ca.html") ||
    window.location.pathname.includes("confidentialite-eu.html");

  window.addEventListener("blur", function () {
    if (!isConfidentialityPage) {
      document.title = awayMessage;
      document.getElementById("favicon").setAttribute("href", newFavicon);
    }
  });

  window.addEventListener("focus", function () {
    document.title = originalTitle;
    document.getElementById("favicon").setAttribute("href", originalFavicon);
  });
});


//******************************************/
// GESTION DU CAROUSEL
//******************************************/
document.addEventListener("DOMContentLoaded", function () {
  var ospin = document.getElementById("spin-container");
  if (ospin) {
    var radius = 170;
    var autoRotate = true;
    var rotateSpeed = -60;
    var imgWidth = 170;
    var imgHeight = 120;

    setTimeout(init, 250);

    var odrag = document.getElementById("drag-container");
    var aImg = ospin.getElementsByTagName("img");
    var aVid = ospin.getElementsByTagName("video");
    var aEle = [...aImg, ...aVid];

    ospin.style.width = imgWidth + "px";
    ospin.style.height = imgHeight + "px";

    var ground = document.getElementById("ground");
    ground.style.width = radius * 2.75 + "px";
    ground.style.height = radius * 2.75 + "px";

    function init(delayTime = 250) {
      for (var i = 0; i < aEle.length; i++) {
        aEle[i].style.transform =
          "rotateY(" +
          i * (360 / aEle.length) +
          "deg) translateZ(" +
          radius +
          "px)";
        aEle[i].style.transition = "transform 1s";
        aEle[i].style.transitionDelay =
          delayTime || (aEle.length - i) / 4 + "s";
      }

      if (autoRotate) {
        var animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
        ospin.style.animation = `${animationName} ${Math.abs(
          rotateSpeed
        )}s infinite linear`;
      }
    }

    var sX,
      sY,
      nX,
      nY,
      desX = 0,
      desY = 0,
      tX = 0,
      tY = 10;

    odrag.addEventListener("touchstart", function (e) {
      var touch = e.touches[0];
      startX = touch.pageX;
      startY = touch.pageY;
      playSpin(false);
    });

    odrag.addEventListener("touchmove", function (e) {
      var touch = e.touches[0];
      moveX = touch.pageX - startX;
      moveY = touch.pageY - startY;

      var rotateY = (moveX / window.innerWidth) * 360;
      var rotateX = (moveY / window.innerHeight) * 360;

      applyTransform(odrag, rotateY, rotateX);
      e.preventDefault();
    });

    odrag.addEventListener("touchend", function (e) {
      playSpin(true);
    });

    odrag.addEventListener("mouseover", function () {
      isHoveringOverCarousel = true;
    });

    odrag.addEventListener("mouseout", function () {
      isHoveringOverCarousel = false;
    });

    document.addEventListener("wheel", adjustCarouselOnWheel, {
      passive: false,
    });

    document.onpointerdown = function (e) {
      clearInterval(odrag.timer);
      e = e || window.event;
      sX = e.clientX;
      sY = e.clientY;

      this.onpointermove = function (e) {
        e = e || window.event;
        nX = e.clientX;
        nY = e.clientY;
        desX = nX - sX;
        desY = nY - sY;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTransform(odrag);
        sX = nX;
        sY = nY;
      };

      this.onpointerup = function (e) {
        odrag.timer = setInterval(function () {
          desX *= 0.95;
          desY *= 0.95;
          tX += desX * 0.1;
          tY += desY * 0.1;
          applyTransform(odrag);
          playSpin(false);
          if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
            clearInterval(odrag.timer);
            playSpin(true);
          }
        }, 17);
        this.onpointermove = this.onpointerup = null;
      };

      return false;
    };

    document.onmousewheel = function (e) {
      e = e || window.event;
      var d = e.wheelDelta / 20 || -e.detail;
      radius += d;
      init(1);
    };

    function applyTransform(obj) {
      if (tY > 180) tY = 180;
      if (tY < 0) tY = 0;
      obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
    }

    function playSpin(yes) {
      ospin.style.animationPlayState = yes ? "running" : "paused";
    }

    function adjustCarouselOnWheel(e) {
      if (isHoveringOverCarousel) {
        e.preventDefault();
        var d = e.wheelDelta / 20 || -e.deltaY;
        radius += d;
        init(1);
      }
    }
  }
});


//******************************************/
// SYSTEME SOLAIRE
//******************************************/
$(window).load(function(){

  var body = $("body"),
      universe = $("#universe"),
      solarsys = $("#solar-system");

  var init = function() {
    body.removeClass('view-2D opening').addClass("view-3D").delay(2000).queue(function() {
      $(this).removeClass('hide-UI').addClass("set-speed");
      $(this).dequeue();
    });
  };

  var setView = function(view) { universe.removeClass().addClass(view); };

  $("#toggle-data").click(function(e) {
    body.toggleClass("data-open data-close");
    e.preventDefault();
  });

  $("#toggle-controls").click(function(e) {
    body.toggleClass("controls-open controls-close");
    e.preventDefault();
  });

  $("#data a").click(function(e) {
    var ref = $(this).attr("class");
    solarsys.removeClass().addClass(ref);
    $(this).parent().find('a').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });

  $(".set-view").click(function() { body.toggleClass("view-3D view-2D"); });
  $(".set-zoom").click(function() { body.toggleClass("zoom-large zoom-close"); });
  $(".set-speed").click(function() { setView("scale-stretched set-speed"); });
  $(".set-size").click(function() { setView("scale-s set-size"); });
  $(".set-distance").click(function() { setView("scale-d set-distance"); });

  init();

});
