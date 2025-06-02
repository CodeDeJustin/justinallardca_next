import React, { useEffect, useRef, useCallback } from 'react';

export interface ParticleSliderProps {
  ptlGap?: number;
  ptlSize?: number;
  color?: string;
  hoverColor?: string;
  slideDelay?: number;
  arrowPadding?: number;
  showArrowControls?: boolean;
  onNextSlide?: (index: number) => void;
  onWidthChange?: (width: number) => void;
  onHeightChange?: (height: number) => void;
  onSizeChange?: (width: number, height: number) => void;
  monochrome?: boolean;
  mouseForce?: number;
  restless?: boolean;
  imgs?: string[];
  slidesHTML?: string[];
  arrowLeftImg?: string;
  arrowRightImg?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gx: number;
  gy: number;
  ttl: number | null;
  color: number[] | (() => number[]);
  opacity?: number;
}

const isMobile = () => typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);

const ParticleSlider: React.FC<ParticleSliderProps> = ({
  ptlGap = isMobile() ? 2 : 0,
  ptlSize = isMobile() ? 2 : 1,
  color = '#FFFFFF',
  // hoverColor = '#8888FF',
  slideDelay = 10,
  arrowPadding = 10,
  showArrowControls = true,
  onNextSlide,
  onWidthChange,
  onHeightChange,
  onSizeChange,
  monochrome = false,
  mouseForce = isMobile() ? 3000 : 5000,
  restless = true,
  imgs = [],
  arrowLeftImg,
  arrowRightImg,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const srcCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const currImgIndex = useRef(0);
  const images = useRef<HTMLImageElement[]>([]);
  

  const arrowLeft = useRef<HTMLImageElement | null>(null);
  const arrowRight = useRef<HTMLImageElement | null>(null);

  const particlesRef = useRef<Particle[]>([]);
  const mouse = useRef({ mx: -1, my: -1, downRegion: 0 });
  const lastSize = useRef({ width: 0, height: 0 });

  const initializeSourceParticles = useCallback((img: HTMLImageElement) => {
    const srcCanvas = srcCanvasRef.current;
    srcCanvas.width = img.width;
    srcCanvas.height = img.height;
    const srcCtx = srcCanvas.getContext('2d');
    if (!srcCtx || !canvasRef.current) return;
    srcCtx.clearRect(0, 0, img.width, img.height);
    srcCtx.drawImage(img, 0, 0);

    const imgData = srcCtx.getImageData(0, 0, img.width, img.height);
    const newParticles: Particle[] = [];
    for (let x = 0; x < imgData.width; x += ptlGap + 1) {
      for (let y = 0; y < imgData.height; y += ptlGap + 1) {
        const i = (y * imgData.width + x) * 4;
        if (imgData.data[i + 3] > 0) {
          const colorVal = monochrome ? parseColor(color) : [
            imgData.data[i],
            imgData.data[i + 1],
            imgData.data[i + 2],
            imgData.data[i + 3],
          ];
          newParticles.push({
            x: Math.random() * canvasRef.current.width,
            y: Math.random() * canvasRef.current.height,
            vx: 0,
            vy: 0,
            gx: (canvasRef.current.width - img.width) / 2 + x,
            gy: (canvasRef.current.height - img.height) / 2 + y,
            ttl: null,
            color: colorVal,
          });
        }
      }
    }
    particlesRef.current = newParticles;
  }, [color, monochrome, ptlGap]);

  const nextSlide = useCallback(() => {
    if (imgs.length < 2) return;
    currImgIndex.current = (currImgIndex.current + 1) % imgs.length;
    initializeSourceParticles(images.current[currImgIndex.current]);
    if (onNextSlide) onNextSlide(currImgIndex.current);
  }, [imgs, initializeSourceParticles, onNextSlide]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    container.appendChild(canvas);

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      if (lastSize.current.width !== width && onWidthChange) onWidthChange(width);
      if (lastSize.current.height !== height && onHeightChange) onHeightChange(height);
      if ((lastSize.current.width !== width || lastSize.current.height !== height) && onSizeChange) onSizeChange(width, height);

      lastSize.current = { width, height };
      if (imgs.length > 0 && images.current[currImgIndex.current]) {
        initializeSourceParticles(images.current[currImgIndex.current]);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [imgs.length, onWidthChange, onHeightChange, onSizeChange, initializeSourceParticles]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = canvasRef.current;
    if (!canvas || !ctxRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    if (arrowLeftImg) {
      arrowLeft.current = new Image();
      arrowLeft.current.src = arrowLeftImg;
    }
    if (arrowRightImg) {
      arrowRight.current = new Image();
      arrowRight.current.src = arrowRightImg;
    }

    if (imgs.length > 0) {
      imgs.forEach((src, index) => {
        const img = new Image();
        img.onload = () => {
          if (index === 0) initializeSourceParticles(img);
        };
        img.src = src;
        images.current.push(img);
      });
    } else {
      for (let i = 0; i < 1000; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.random() * 2 - 1,
          vy: Math.random() * 2 - 1,
          gx: 0,
          gy: 0,
          ttl: null,
          color: parseColor(color),
        });
      }
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.mx = e.clientX - rect.left;
      mouse.current.my = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseout', () => {
      mouse.current.mx = -1;
      mouse.current.my = -1;
    });

    canvas.addEventListener('click', (e) => {
      if (!showArrowControls || imgs.length < 2) return;
      const x = e.clientX;
      const canvasWidth = canvas.width;
      if (x < arrowPadding * 2 + 50) {
        currImgIndex.current = (currImgIndex.current - 1 + imgs.length) % imgs.length;
      } else if (x > canvasWidth - arrowPadding * 2 - 50) {
        currImgIndex.current = (currImgIndex.current + 1) % imgs.length;
      }
      initializeSourceParticles(images.current[currImgIndex.current]);
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        const dx = p.gx - p.x;
        const dy = p.gy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const accel = dist * 0.01 + (restless ? (Math.random() * 0.1 - 0.05) : 0);

        let mAccel = 0, mAngle = 0;
        if (mouse.current.mx >= 0) {
          const mx = p.x - mouse.current.mx;
          const my = p.y - mouse.current.my;
          mAccel = Math.min(mouseForce / (mx * mx + my * my), mouseForce);
          mAngle = Math.atan2(my, mx);
        }

        p.vx += accel * Math.cos(angle) + mAccel * Math.cos(mAngle);
        p.vy += accel * Math.sin(angle) + mAccel * Math.sin(mAngle);
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        const colorArr = typeof p.color === 'function' ? p.color() : p.color;
        ctx.fillStyle = `rgba(${colorArr[0]},${colorArr[1]},${colorArr[2]},${colorArr[3] / 255})`;
        ctx.fillRect(p.x, p.y, ptlSize, ptlSize);
      }

      if (showArrowControls && arrowLeft.current && arrowRight.current) {
        if (mouse.current.mx >= 0) {
          const hoverLeft = mouse.current.mx < arrowPadding * 2 + 50;
          const hoverRight = mouse.current.mx > canvas.width - arrowPadding * 2 - 50;
          ctx.globalAlpha = hoverLeft ? 1 : 0.5;
          ctx.drawImage(arrowLeft.current, arrowPadding, canvas.height / 2 - 25, 50, 50);
          ctx.globalAlpha = hoverRight ? 1 : 0.5;
          ctx.drawImage(arrowRight.current, canvas.width - arrowPadding - 50, canvas.height / 2 - 25, 50, 50);
          ctx.globalAlpha = 1;
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    if (slideDelay > 0 && imgs.length > 1) {
      const interval = setInterval(() => nextSlide(), slideDelay * 1000);
      return () => clearInterval(interval);
    }
  }, [arrowLeftImg, arrowRightImg, color, imgs, nextSlide, ptlSize, mouseForce, restless, showArrowControls, arrowPadding, initializeSourceParticles, slideDelay]);

  function parseColor(input: string): number[] {
    const hex = input.replace('#', '');
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
        255,
      ];
    } else if (hex.length === 6) {
      return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16),
        255,
      ];
    }
    return [255, 255, 255, 255];
  }

  return <div ref={containerRef} id="ps-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10, pointerEvents: 'none' }} />;
};

export default ParticleSlider;

