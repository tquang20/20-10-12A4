import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';

// Image assets generated for hyper-realistic floral blooms
import pinkRoseImg from '../assets/images/pink_rose_top_view_1792331063145.jpg';
import whiteBlushRoseImg from '../assets/images/white_blush_rose_1792331062535.jpg';
import magentaRoseImg from '../assets/images/magenta_rose_bloom_1792331063554.jpg';
import peonyImg from '../assets/images/peony_bloom_top_1792331062971.jpg';

interface FlowerItem {
  id: number;
  x: number;
  y: number;
  targetRadius: number; // radius in px
  spriteIndex: number;
  distFromCenter: number;
  bloomDelay: number;   // seconds
  bloomDuration: number;// seconds
  initialAngle: number; // radians
  bloomSpin: number;    // radians

  // State
  currentScale: number;
  currentAngle: number;
  opacity: number;

  // Gentle wind breeze swaying (đung đưa trước gió ngẫu nhiên)
  breezeSpeedX: number;
  breezeSpeedY: number;
  breezeSpeedRot: number;
  breezeAmpX: number;
  breezeAmpY: number;
  breezeAmpRot: number;
  breezePhase: number;
  breatheFreq: number;
  breatheAmp: number;

  // Fall physics
  isFalling: boolean;
  hasFallStarted: boolean;
  fallDelay: number;    // seconds
  initialY: number;
  vy: number;
  vx: number;
  bounceAmp: number;
  fallSwayFreq: number;
  fallSwayAmp: number;
  fallSwayPhase: number;
  tumbleRate: number;
  tumblePhase: number;
  fallAlpha: number;
}

interface PetalItem {
  x: number;
  y: number;
  width: number;
  height: number;
  colorType: number; // 0: pink rose, 1: blush white, 2: magenta, 3: peach peony, 4: soft green leaf
  angle: number;
  rotSpeed: number;
  vy: number;
  vx: number;
  swayAmp: number;
  swayFreq: number;
  swayPhase: number;
  tumbleSpeed: number;
  tumblePhase: number;
  alpha: number;
  delay: number;
}

interface StarParticle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
}

interface FlowerVeilCanvasProps {
  onNearFinish?: () => void;
  onRevealFinished?: () => void;
  onStateChange?: (state: 'blooming' | 'covered' | 'falling' | 'cleared') => void;
  speedMultiplier?: number;
  densityFactor?: number;
}

export const FlowerVeilCanvas: React.FC<FlowerVeilCanvasProps> = ({
  onNearFinish,
  onRevealFinished,
  onStateChange,
  speedMultiplier = 1.0,
  densityFactor = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [veilState, setVeilState] = useState<'blooming' | 'covered' | 'falling' | 'cleared'>('blooming');
  const [canShowButton, setCanShowButton] = useState<boolean>(false);
  const [spritesLoaded, setSpritesLoaded] = useState<boolean>(false);

  // Stable references for callbacks to avoid re-triggering render loop
  const onNearFinishRef = useRef(onNearFinish);
  onNearFinishRef.current = onNearFinish;
  const onRevealFinishedRef = useRef(onRevealFinished);
  onRevealFinishedRef.current = onRevealFinished;
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;

  const nearFinishTriggeredRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const fallStartTimeRef = useRef<number>(0);
  const spritesRef = useRef<HTMLCanvasElement[]>([]);
  const flowersRef = useRef<FlowerItem[]>([]);
  const ambientPetalsRef = useRef<PetalItem[]>([]);
  const fallingPetalsRef = useRef<PetalItem[]>([]);
  const starsRef = useRef<StarParticle[]>([]);
  const veilStateRef = useRef<'blooming' | 'covered' | 'falling' | 'cleared'>('blooming');

  const updateVeilState = useCallback((newState: 'blooming' | 'covered' | 'falling' | 'cleared') => {
    if (veilStateRef.current === newState) return;
    veilStateRef.current = newState;
    setVeilState(newState);
    onStateChangeRef.current?.(newState);
  }, []);

  // Pre-process images: USE FLOOD FILL FROM BORDERS
  // This guarantees internal petal folds are NEVER touched, preventing any holes or stripes inside flowers!
  useEffect(() => {
    const imageUrls = [pinkRoseImg, whiteBlushRoseImg, magentaRoseImg, peonyImg];
    let loadedCount = 0;
    const processedCanvases: HTMLCanvasElement[] = [];

    imageUrls.forEach((url, idx) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        const offCanvas = document.createElement('canvas');
        const size = 512;
        offCanvas.width = size;
        offCanvas.height = size;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

        if (offCtx) {
          offCtx.drawImage(img, 0, 0, size, size);
          const imgData = offCtx.getImageData(0, 0, size, size);
          const data = imgData.data;

          // 1. Boundary Connected Flood Fill:
          // Only pixels connected to the outer boundary edges that are dark will be marked as background.
          const isBg = new Uint8Array(size * size);
          const queue = new Int32Array(size * size);
          let qHead = 0;
          let qTail = 0;

          // Push outer edge pixels if they are dark background
          const checkBorderPixel = (x: number, y: number) => {
            const pIdx = y * size + x;
            if (isBg[pIdx]) return;
            const dIdx = pIdx * 4;
            const r = data[dIdx];
            const g = data[dIdx + 1];
            const b = data[dIdx + 2];
            // If near-black background
            if (r < 32 && g < 32 && b < 32) {
              isBg[pIdx] = 1;
              queue[qTail++] = pIdx;
            }
          };

          for (let x = 0; x < size; x++) {
            checkBorderPixel(x, 0);
            checkBorderPixel(x, size - 1);
          }
          for (let y = 0; y < size; y++) {
            checkBorderPixel(0, y);
            checkBorderPixel(size - 1, y);
          }

          // Flood fill queue traversal
          while (qHead < qTail) {
            const pIdx = queue[qHead++];
            const cx = pIdx % size;
            const cy = Math.floor(pIdx / size);

            // 4 neighbors
            const neighbors = [
              cx > 0 ? pIdx - 1 : -1,
              cx < size - 1 ? pIdx + 1 : -1,
              cy > 0 ? pIdx - size : -1,
              cy < size - 1 ? pIdx + size : -1,
            ];

            for (let i = 0; i < 4; i++) {
              const nIdx = neighbors[i];
              if (nIdx !== -1 && !isBg[nIdx]) {
                const dIdx = nIdx * 4;
                const r = data[dIdx];
                const g = data[dIdx + 1];
                const b = data[dIdx + 2];
                // Connected background threshold
                if (r < 34 && g < 34 && b < 34) {
                  isBg[nIdx] = 1;
                  queue[qTail++] = nIdx;
                }
              }
            }
          }

          // 2. Set Alpha:
          // ONLY pixels identified by flood-fill as outer background are made transparent!
          // All internal folds, shadows, and petals are 100% PRESERVED, SOLID, AND RADIANT!
          for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
              const pIdx = y * size + x;
              const dIdx = pIdx * 4;

              if (isBg[pIdx]) {
                data[dIdx + 3] = 0; // Pure transparent
              } else {
                // Check if this flower pixel is on the outer boundary edge (adjacent to background)
                const isEdge =
                  (x > 0 && isBg[pIdx - 1]) ||
                  (x < size - 1 && isBg[pIdx + 1]) ||
                  (y > 0 && isBg[pIdx - size]) ||
                  (y < size - 1 && isBg[pIdx + size]);

                if (isEdge) {
                  // Soft antialiased feathering and defringe
                  const r = data[dIdx];
                  const g = data[dIdx + 1];
                  const b = data[dIdx + 2];
                  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                  if (lum < 42) {
                    data[dIdx + 3] = 160;
                    // Warm up edge pixel
                    data[dIdx] = Math.min(255, r + 30);
                    data[dIdx + 1] = Math.min(255, g + 20);
                    data[dIdx + 2] = Math.min(255, b + 25);
                  }
                }
              }
            }
          }

          offCtx.putImageData(imgData, 0, 0);
          processedCanvases[idx] = offCanvas;
        }

        loadedCount++;
        if (loadedCount === imageUrls.length) {
          spritesRef.current = processedCanvases;
          setSpritesLoaded(true);
        }
      };

      img.onerror = () => {
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 256;
        fallbackCanvas.height = 256;
        const fCtx = fallbackCanvas.getContext('2d');
        if (fCtx) {
          const grad = fCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
          grad.addColorStop(0, '#f472b6');
          grad.addColorStop(0.7, '#ec4899');
          grad.addColorStop(1, '#be185d');
          fCtx.fillStyle = grad;
          fCtx.beginPath();
          fCtx.arc(128, 128, 110, 0, Math.PI * 2);
          fCtx.fill();
        }
        processedCanvases[idx] = fallbackCanvas;
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          spritesRef.current = processedCanvases;
          setSpritesLoaded(true);
        }
      };
    });
  }, []);

  // Initialize flower arrangement to cover 100% of the viewport seamlessly
  const initializeFlowers = useCallback((width: number, height: number) => {
    const flowers: FlowerItem[] = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const maxScreenRadius = Math.hypot(centerX, centerY) + 140;

    // Center Hero Flower
    flowers.push({
      id: 0,
      x: centerX,
      y: centerY,
      initialY: centerY,
      targetRadius: Math.min(width, height) * 0.18 + 45,
      spriteIndex: 0,
      distFromCenter: 0,
      bloomDelay: 0.05,
      bloomDuration: 0.8 / speedMultiplier,
      initialAngle: Math.random() * Math.PI * 2,
      bloomSpin: (Math.random() - 0.5) * 1.2,
      currentScale: 0,
      currentAngle: 0,
      opacity: 0,

      // Gentle breeze swaying
      breezeSpeedX: 0.9 + Math.random() * 0.8,
      breezeSpeedY: 0.8 + Math.random() * 0.7,
      breezeSpeedRot: 0.7 + Math.random() * 0.6,
      breezeAmpX: 3.0 + Math.random() * 3.5,
      breezeAmpY: 2.5 + Math.random() * 3.0,
      breezeAmpRot: 0.02 + Math.random() * 0.025,
      breezePhase: Math.random() * Math.PI * 2,
      breatheFreq: 0.8 + Math.random() * 0.7,
      breatheAmp: 0.012 + Math.random() * 0.014,

      // Fall physics
      isFalling: false,
      hasFallStarted: false,
      fallDelay: Math.random() * 0.2,
      vy: 0,
      vx: (Math.random() - 0.5) * 30,
      bounceAmp: 10 + Math.random() * 10,
      fallSwayFreq: 1.5 + Math.random() * 2,
      fallSwayAmp: 25 + Math.random() * 30,
      fallSwayPhase: Math.random() * Math.PI * 2,
      tumbleRate: (Math.random() - 0.5) * 2.5,
      tumblePhase: Math.random() * Math.PI * 2,
      fallAlpha: 1,
    });

    // Staggered honeycomb grid covering [-130, width + 130] x [-130, height + 130]
    const stepX = 82 / Math.sqrt(densityFactor);
    const stepY = 72 / Math.sqrt(densityFactor);
    const minX = -130;
    const maxX = width + 130;
    const minY = -130;
    const maxY = height + 130;

    let idCounter = 1;
    let rowIndex = 0;

    for (let curY = minY; curY <= maxY; curY += stepY, rowIndex++) {
      const rowOffset = (rowIndex % 2 === 1) ? stepX * 0.5 : 0;
      for (let curX = minX + rowOffset; curX <= maxX; curX += stepX) {
        const distFromCenter = Math.hypot(curX - centerX, curY - centerY);
        if (distFromCenter < 35) continue;

        const jitterX = (Math.random() - 0.5) * 26;
        const jitterY = (Math.random() - 0.5) * 26;
        const x = curX + jitterX;
        const y = curY + jitterY;

        const actualDist = Math.hypot(x - centerX, y - centerY);
        const normDist = Math.min(actualDist / maxScreenRadius, 1.0);
        const bloomDelay = (0.12 + Math.pow(normDist, 0.88) * 2.5 + Math.random() * 0.25) / speedMultiplier;
        const flowerSize = 110 + Math.random() * 55;

        flowers.push({
          id: idCounter++,
          x,
          y,
          initialY: y,
          targetRadius: flowerSize,
          spriteIndex: idCounter % 4,
          distFromCenter: actualDist,
          bloomDelay,
          bloomDuration: (0.75 + Math.random() * 0.3) / speedMultiplier,
          initialAngle: Math.random() * Math.PI * 2,
          bloomSpin: (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.9),
          currentScale: 0,
          currentAngle: 0,
          opacity: 0,

          // Individual random wind breeze swaying
          breezeSpeedX: 0.8 + Math.random() * 1.2,
          breezeSpeedY: 0.7 + Math.random() * 1.0,
          breezeSpeedRot: 0.6 + Math.random() * 0.9,
          breezeAmpX: 3.0 + Math.random() * 4.0,
          breezeAmpY: 2.5 + Math.random() * 3.5,
          breezeAmpRot: 0.02 + Math.random() * 0.03,
          breezePhase: Math.random() * Math.PI * 2,
          breatheFreq: 0.75 + Math.random() * 0.8,
          breatheAmp: 0.012 + Math.random() * 0.016,

          // Fall physics
          isFalling: false,
          hasFallStarted: false,
          fallDelay: (Math.random() * 0.32) + ((y / height) * 0.22),
          vy: 0,
          vx: (Math.random() - 0.5) * 45,
          bounceAmp: 8 + Math.random() * 12,
          fallSwayFreq: 1.4 + Math.random() * 2.2,
          fallSwayAmp: 30 + Math.random() * 40,
          fallSwayPhase: Math.random() * Math.PI * 2,
          tumbleRate: (Math.random() - 0.5) * 3,
          tumblePhase: Math.random() * Math.PI * 2,
          fallAlpha: 1,
        });
      }
    }

    flowers.sort((a, b) => a.bloomDelay - b.bloomDelay);
    flowersRef.current = flowers;

    // Ambient floating petals: REDUCED COUNT (18 delicate petals), SMALLER, MATCHING THE ACTUAL FLOWERS!
    const ambientPetals: PetalItem[] = [];
    const totalAmbientCount = 18;
    for (let i = 0; i < totalAmbientCount; i++) {
      // 0: pink rose, 1: blush white, 2: deep magenta rose, 3: soft peach peony, 4: subtle natural botanical leaf
      const colorType = i % 5;
      const isLeaf = colorType === 4;

      ambientPetals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        width: isLeaf ? (7 + Math.random() * 4) : (9 + Math.random() * 5),   // Small and delicate
        height: isLeaf ? (13 + Math.random() * 5) : (11 + Math.random() * 5),
        colorType,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 1.8,
        vy: 28 + Math.random() * 35, // Gentle, relaxing drift
        vx: (Math.random() - 0.5) * 15,
        swayAmp: 16 + Math.random() * 20,
        swayFreq: 1.0 + Math.random() * 1.4,
        swayPhase: Math.random() * Math.PI * 2,
        tumbleSpeed: 1.2 + Math.random() * 1.5,
        tumblePhase: Math.random() * Math.PI * 2,
        alpha: 0.82 + Math.random() * 0.18,
        delay: 0,
      });
    }
    ambientPetalsRef.current = ambientPetals;

    // Heavy cascade falling petals when continue is clicked
    const fallingPetals: PetalItem[] = [];
    for (let i = 0; i < 80; i++) {
      fallingPetals.push({
        x: Math.random() * width,
        y: Math.random() * height - 80,
        width: 12 + Math.random() * 12,
        height: 14 + Math.random() * 14,
        colorType: i % 4,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 3.5,
        vy: 160 + Math.random() * 280,
        vx: (Math.random() - 0.5) * 40,
        swayAmp: 25 + Math.random() * 35,
        swayFreq: 1.8 + Math.random() * 2.5,
        swayPhase: Math.random() * Math.PI * 2,
        tumbleSpeed: 2.0 + Math.random() * 2.5,
        tumblePhase: Math.random() * Math.PI * 2,
        alpha: 0.85 + Math.random() * 0.15,
        delay: Math.random() * 0.4,
      });
    }
    fallingPetalsRef.current = fallingPetals;

    // Twinkling stars in dark night cosmos background
    const stars: StarParticle[] = [];
    for (let i = 0; i < 140; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.6 + Math.random() * 1.8,
        baseAlpha: 0.35 + Math.random() * 0.65,
        twinkleSpeed: 1 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;
  }, [speedMultiplier, densityFactor]);

  // Restart / Replay flower blooming animation
  const resetAndPlay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    initializeFlowers(window.innerWidth, window.innerHeight);
    startTimeRef.current = performance.now();
    fallStartTimeRef.current = 0;
    nearFinishTriggeredRef.current = false;
    updateVeilState('blooming');
    setCanShowButton(false);
  }, [initializeFlowers, updateVeilState]);

  // Trigger flowers to fall down (Rớt xuống)
  const handleDropFlowers = useCallback(() => {
    if (veilStateRef.current === 'falling' || veilStateRef.current === 'cleared') return;

    updateVeilState('falling');
    setCanShowButton(false);
    fallStartTimeRef.current = performance.now();
    nearFinishTriggeredRef.current = false;

    // Mark all flowers and petals as falling
    flowersRef.current.forEach(f => {
      f.isFalling = true;
      f.hasFallStarted = false;
      f.fallAlpha = 1;
    });

    // Play chime & whoosh sound
    romanticAudio.playChime();
    romanticAudio.playWhoosh();
    // Start romantic music
    romanticAudio.start();
  }, [updateVeilState]);

  // Main animation render loop - runs smoothly without resetting
  useEffect(() => {
    if (!spritesLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI and window resize
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      if (flowersRef.current.length === 0) {
        initializeFlowers(w, h);
      }
    };

    handleResize();
    initializeFlowers(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', handleResize);

    startTimeRef.current = performance.now();
    let lastTime = performance.now();

    // Helper to draw a realistic curved rose petal / leaf matching the actual flowers
    const drawRealisticPetal = (
      p: PetalItem,
      time: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      // Realistic 3D tumbling (squashing vertically as it spins in the breeze)
      const tumble = Math.cos(time * p.tumbleSpeed + p.tumblePhase);
      ctx.scale(1.0, Math.max(0.2, Math.abs(tumble)));

      ctx.globalAlpha = p.alpha * opacity;

      const pw = p.width;
      const ph = p.height;

      ctx.beginPath();
      if (p.colorType === 4) {
        // Natural botanical rose leaf sepal: elegant olive/sage green
        const grad = ctx.createLinearGradient(0, -ph, 0, ph);
        grad.addColorStop(0, '#84cc16'); // fresh young leaf green
        grad.addColorStop(0.5, '#4d7c0f'); // natural deep rose leaf
        grad.addColorStop(1, '#365314');
        ctx.fillStyle = grad;

        ctx.moveTo(0, -ph);
        ctx.bezierCurveTo(pw * 0.9, -ph * 0.3, pw * 0.9, ph * 0.4, 0, ph);
        ctx.bezierCurveTo(-pw * 0.9, ph * 0.4, -pw * 0.9, -ph * 0.3, 0, -ph);
      } else {
        // Realistic rose petal gradients matching the 4 rose types
        const grad = ctx.createRadialGradient(0, ph * 0.3, 1, 0, 0, ph);

        if (p.colorType === 0) {
          // English Garden Pink Rose petal
          grad.addColorStop(0, '#fff1f2'); // soft ivory-white base
          grad.addColorStop(0.4, '#fbcfe8'); // blush pink
          grad.addColorStop(0.9, '#f472b6'); // velvet rose rim
          grad.addColorStop(1, '#e11d48');
        } else if (p.colorType === 1) {
          // White-Blush Rose petal
          grad.addColorStop(0, '#ffffff'); // pure ivory
          grad.addColorStop(0.5, '#fed7aa'); // peach blush
          grad.addColorStop(0.85, '#fecdd3'); // delicate pink tip
          grad.addColorStop(1, '#fb7185');
        } else if (p.colorType === 2) {
          // Deep Magenta Rose petal
          grad.addColorStop(0, '#f472b6'); // vibrant pink center
          grad.addColorStop(0.5, '#be185d'); // deep ruby rose
          grad.addColorStop(0.95, '#831843'); // rich velvety magenta
          grad.addColorStop(1, '#701a75');
        } else {
          // Peach Peony Petal
          grad.addColorStop(0, '#fff7ed'); // warm vanilla
          grad.addColorStop(0.45, '#fecdd3'); // pastel rose
          grad.addColorStop(0.9, '#fda4af'); // peach peony pink
          grad.addColorStop(1, '#f43f5e');
        }

        ctx.fillStyle = grad;

        // Curved velvety rose petal silhouette
        ctx.moveTo(0, -ph);
        ctx.bezierCurveTo(pw * 1.1, -ph * 0.5, pw * 1.2, ph * 0.5, 0, ph);
        ctx.bezierCurveTo(-pw * 1.2, ph * 0.5, -pw * 1.1, -ph * 0.5, 0, -ph);
      }

      ctx.fill();

      // Subtle delicate petal rim highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.restore();
    };

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const elapsed = (now - startTimeRef.current) / 1000;
      const fallElapsed = fallStartTimeRef.current > 0 ? (now - fallStartTimeRef.current) / 1000 : 0;
      const timeSec = now * 0.001;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const currentState = veilStateRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // 1. Dark cosmic background during intro to completely hide the album behind
      if (currentState === 'blooming' || currentState === 'covered') {
        ctx.fillStyle = '#06010a';
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        starsRef.current.forEach(star => {
          const alpha = star.baseAlpha * (0.6 + 0.4 * Math.sin(now * 0.002 * star.twinkleSpeed + star.phase));
          ctx.fillStyle = `rgba(255, 230, 245, ${alpha})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      } else if (currentState === 'falling') {
        const bgAlpha = Math.max(0, 1 - (fallElapsed / 1.1));
        if (bgAlpha > 0.01) {
          ctx.fillStyle = `rgba(6, 1, 10, ${bgAlpha})`;
          ctx.fillRect(0, 0, w, h);

          ctx.save();
          starsRef.current.forEach(star => {
            const alpha = star.baseAlpha * bgAlpha * (0.6 + 0.4 * Math.sin(now * 0.002 * star.twinkleSpeed + star.phase));
            ctx.fillStyle = `rgba(255, 230, 245, ${alpha})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
        }
      }

      // Check blooming progress across all flowers
      let bloomedCount = 0;
      const flowers = flowersRef.current;
      const sprites = spritesRef.current;

      // 2. Update and draw flowers
      flowers.forEach(flower => {
        let drawX = flower.x;
        let drawY = flower.y;
        let drawAngle = flower.currentAngle;
        let drawScale = flower.currentScale;

        if (elapsed > flower.bloomDelay) {
          const bloomTime = elapsed - flower.bloomDelay;
          const progress = Math.min(bloomTime / flower.bloomDuration, 1.0);

          if (progress >= 0.95) {
            bloomedCount++;
          }

          if (!flower.isFalling) {
            const c1 = 1.70158;
            const c3 = c1 + 1;
            const easedScale = progress === 1 ? 1 : 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
            flower.currentScale = Math.max(0, easedScale);
            flower.opacity = Math.min(progress * 1.5, 1.0);
            flower.currentAngle = flower.initialAngle + flower.bloomSpin * progress;

            // ORGANIC BREEZE SWAYING: When bloomed, sway softly in wind with unique random movement
            if (progress >= 0.96) {
              const swayX = Math.sin(timeSec * flower.breezeSpeedX + flower.breezePhase) * flower.breezeAmpX;
              const swayY = Math.cos(timeSec * flower.breezeSpeedY + flower.breezePhase * 1.3) * flower.breezeAmpY;
              const swayRot = Math.sin(timeSec * flower.breezeSpeedRot + flower.breezePhase * 0.7) * flower.breezeAmpRot;
              const breathe = 1.0 + Math.sin(timeSec * flower.breatheFreq + flower.breezePhase) * flower.breatheAmp;

              drawX += swayX;
              drawY += swayY;
              drawAngle += swayRot;
              drawScale *= breathe;
            } else {
              drawScale = flower.currentScale;
            }
          } else {
            // Falling physics (Rớt xuống: nhúng nhẹ lên rồi rơi tự nhiên, mờ dần khi sắp ra màn hình)
            const fTime = fallElapsed - flower.fallDelay;
            if (fTime > 0) {
              if (!flower.hasFallStarted) {
                flower.hasFallStarted = true;
                // Nhúng nhẹ lên một chút khi bắt đầu rơi (nhẹ nhàng ~3-5px arc)
                flower.vy = -35 - Math.random() * 20;
                flower.vx = (Math.random() - 0.5) * 20;
              }

              // Trọng lực tự nhiên, êm dịu
              const gravity = 880; // px/s^2
              flower.vy += gravity * dt;
              flower.y += flower.vy * dt;

              // Lắc nhẹ êm ái khi rơi theo gió
              flower.x += (Math.sin(fTime * 1.6 + flower.fallSwayPhase) * 16 + flower.vx) * dt;
              drawX = flower.x;
              drawY = flower.y;

              // Xoay nhẹ nhàng tự nhiên, giữ nguyên tỉ lệ tròn 1:1 (không bóp méo, không biến dạng)
              drawAngle = flower.currentAngle + flower.tumbleRate * 0.45 * dt;
              flower.currentAngle = drawAngle;
              drawScale = 1.0;

              // MỜ DẦN KHI SẮP RA KHỎI MÀN HÌNH:
              // Chỉ áp dụng cho các hàng hoa rơi cuối cùng (xuất phát từ phía trên: initialY <= h * 0.35)
              // Các hàng hoa sẵn nằm gần màn hình (initialY > h * 0.35) giữ nguyên 100% độ nét, KHÔNG bị mờ trước!
              const isFinalTrailingRow = flower.initialY <= h * 0.35;
              if (isFinalTrailingRow) {
                const fadeStartY = h * 0.65;
                const fadeEndY = h + flower.targetRadius * 0.35;
                if (drawY > fadeStartY && (drawY - flower.initialY) > h * 0.45) {
                  const t = Math.min(Math.max(0, (drawY - fadeStartY) / (fadeEndY - fadeStartY)), 1.0);
                  flower.fallAlpha = Math.max(0, 1.0 - t);
                }
              } else {
                // Các hàng hoa ban đầu nằm ở giữa và dưới màn hình: Giữ nguyên 100% rõ nét trên màn hình
                // Chỉ mờ dần khi tâm hoa đã rơi qua mép dưới màn hình (drawY > h)
                if (drawY > h) {
                  const t = Math.min(Math.max(0, (drawY - h) / (flower.targetRadius * 0.7)), 1.0);
                  flower.fallAlpha = Math.max(0, 1.0 - t);
                } else {
                  flower.fallAlpha = 1.0;
                }
              }
            } else {
              // Khi chưa đến lượt rơi, đung đưa trước gió êm dịu
              const swayX = Math.sin(timeSec * flower.breezeSpeedX + flower.breezePhase) * flower.breezeAmpX;
              const swayY = Math.cos(timeSec * flower.breezeSpeedY + flower.breezePhase * 1.3) * flower.breezeAmpY;
              const swayRot = Math.sin(timeSec * flower.breezeSpeedRot + flower.breezePhase * 0.7) * flower.breezeAmpRot;
              drawX += swayX;
              drawY += swayY;
              drawAngle += swayRot;
            }
          }
        }

        // Draw flower: GIỮ NGUYÊN HÌNH DÁNG TRÒN ĐẸP 1:1, KHÔNG BIẾN DẠNG, KHÔNG ĐỂ LẠI VỆT KHỐI TO
        if (drawScale > 0.01 && flower.opacity > 0.01 && flower.fallAlpha > 0.01) {
          const sprite = sprites[flower.spriteIndex];
          if (sprite) {
            const drawRadius = flower.targetRadius * drawScale;
            const baseAlpha = flower.opacity * flower.fallAlpha;
            const currentSpeed = flower.isFalling ? Math.hypot(flower.vx, flower.vy) : 0;

            // Motion blur tối giản, nghệ thuật: chỉ vệt bóng mờ vi thể siêu nhẹ 3-5px khi tốc độ cao (không vệt khối to)
            if (flower.isFalling && currentSpeed > 240) {
              const moveAngle = Math.atan2(flower.vy, flower.vx);
              const trailOffset = Math.min(currentSpeed * dt * 0.22, 4.5);

              ctx.save();
              ctx.globalAlpha = baseAlpha * 0.08;
              ctx.translate(drawX - Math.cos(moveAngle) * trailOffset, drawY - Math.sin(moveAngle) * trailOffset);
              ctx.rotate(drawAngle);
              ctx.drawImage(sprite, -drawRadius, -drawRadius, drawRadius * 2, drawRadius * 2);
              ctx.restore();
            }

            // Bông hoa chính: Sắc nét, nguyên vẹn, hình tròn tự nhiên tuyệt đối
            ctx.save();
            ctx.globalAlpha = baseAlpha;
            ctx.translate(drawX, drawY);
            ctx.rotate(drawAngle);
            ctx.drawImage(
              sprite,
              -drawRadius,
              -drawRadius,
              drawRadius * 2,
              drawRadius * 2
            );
            ctx.restore();
          }
        }
      });

      // 3. Ambient floating petals: FEWER, SMALLER, REALISTIC ROSE PETALS FROM THE ACTUAL BOUQUET
      if (currentState === 'covered' || (currentState === 'blooming' && bloomedCount >= flowers.length * 0.75)) {
        const ambientPetals = ambientPetalsRef.current;
        ambientPetals.forEach(p => {
          // Drifting down gently
          p.y += p.vy * dt;
          p.x += Math.sin(timeSec * p.swayFreq + p.swayPhase) * p.swayAmp * dt * 1.0;
          p.angle += p.rotSpeed * dt;

          // Seamless loop from bottom to top
          if (p.y > h + 30) {
            p.y = -30;
            p.x = Math.random() * w;
          }

          drawRealisticPetal(p, timeSec, 1.0);
        });
      }

      // 4. Draw falling loose rose petals when continue is clicked
      if (currentState === 'falling') {
        const petals = fallingPetalsRef.current;
        petals.forEach(p => {
          if (fallElapsed > p.delay) {
            const fTime = fallElapsed - p.delay;
            p.y += p.vy * dt;
            p.x += Math.sin(fTime * p.swayFreq + p.swayPhase) * p.swayAmp * dt * 2.5;
            p.angle += p.rotSpeed * dt;

            // Fade out smoothly as petals approach screen bottom
            let petalAlpha = p.alpha;
            const petalFadeStart = h * 0.65;
            if (p.y > petalFadeStart) {
              const pt = Math.min(1.0, (p.y - petalFadeStart) / (h * 0.38));
              petalAlpha = Math.max(0, p.alpha * (1.0 - pt * pt));
            }

            if (p.y < h + 50 && petalAlpha > 0.01) {
              drawRealisticPetal(p, timeSec, petalAlpha);
            }
          }
        });
      }

      // Check transition to "covered" (when >= 90% of flowers have bloomed)
      if (currentState === 'blooming' && bloomedCount >= flowers.length * 0.90) {
        updateVeilState('covered');
        setCanShowButton(true);
      }

      // Thông báo khi hoa sắp rơi xuống hết (~1.25s) để bức thư mờ dần rồi nảy ra đồng điệu
      if (currentState === 'falling' && fallElapsed >= 1.25 && !nearFinishTriggeredRef.current) {
        nearFinishTriggeredRef.current = true;
        onNearFinishRef.current?.();
      }

      // Check if all flowers have fallen past the bottom of the screen (at least 1.8s of falling beauty)
      if (currentState === 'falling' && fallElapsed > 1.8) {
        const remainingOnScreen = flowers.some(
          f => f.y - f.targetRadius < h && f.fallAlpha > 0.05
        );
        if (!remainingOnScreen) {
          updateVeilState('cleared');
          onRevealFinishedRef.current?.();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [spritesLoaded, initializeFlowers, updateVeilState]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden ${
        veilState === 'cleared'
          ? 'pointer-events-none hidden'
          : veilState === 'falling'
          ? 'pointer-events-none block'
          : 'pointer-events-auto block'
      }`}
    >
      {/* The 60FPS Flower Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* "Tiếp tục" Button shown at bottom center when flowers cover the screen */}
      {canShowButton && veilState === 'covered' && (
        <div className="absolute bottom-12 inset-x-0 flex flex-col items-center justify-center pointer-events-auto z-50 transition-all duration-700 ease-out animate-in fade-in zoom-in-95">
          <button
            onClick={handleDropFlowers}
            className="group relative flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500/90 via-rose-500/90 to-pink-600/90 text-white font-medium text-lg shadow-[0_0_30px_rgba(244,114,182,0.85)] hover:shadow-[0_0_50px_rgba(244,114,182,1)] backdrop-blur-md border border-white/50 hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse-glow cursor-pointer"
          >
            <span className="tracking-wide font-semibold drop-shadow-sm">
              Tiếp tục
            </span>
            <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <p className="mt-3 text-xs text-white/80 tracking-wider font-light drop-shadow">
            Nhấn để mở ra bức thư 20/10 💌
          </p>
        </div>
      )}
    </div>
  );
};
