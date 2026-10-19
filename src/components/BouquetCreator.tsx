import React, { useState, useEffect, useRef } from "react";
import {
  RotateCcw,
  Undo2,
  ArrowRight,
  CheckCircle2,
  X,
  Sparkles,
  Download,
  Upload,
} from "lucide-react";
import html2canvas from "html2canvas";

// Web Audio sound synthesizer for gentle kalimba/harp pluck sound on click (10-note melodic scale)
function playFlowerPluckSound(index = 0) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    // 10 gentle pentatonic/diatonic frequencies for sweet chimes
    const scale = [
      440.0,  // A4
      493.88, // B4
      523.25, // C5
      587.33, // D5
      659.25, // E5
      698.46, // F5
      783.99, // G5
      880.0,  // A5
      987.77, // B5
      1046.5, // C6
    ];
    const freq = scale[index % scale.length] || 659.25;

    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.04, ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.38);
  } catch {
    // Audio context not allowed or blocked by browser policy
  }
}

export interface FlowerDefinition {
  id: string;
  name: string;
  displayName: string;
  meaning: string;
}

export const FLOWER_CATALOG: FlowerDefinition[] = [
  {
    id: "tulip",
    name: "Hoa tulip",
    displayName: "hoa tulip",
    meaning: "Nét dịu dàng, thanh khiết & ngọt ngào",
  },
  {
    id: "rose",
    name: "Hoa hồng",
    displayName: "hoa hồng",
    meaning: "Tình yêu chân thành & kiêu sa",
  },
  {
    id: "sunflower",
    name: "Hoa hướng dương",
    displayName: "hoa hướng dương",
    meaning: "Rạng rỡ, niềm tin & luôn hướng về ánh sáng",
  },
  {
    id: "daisy",
    name: "Hoa cúc",
    displayName: "hoa cúc",
    meaning: "Vẻ đẹp tinh khôi, mộc mạc & bình an",
  },
  {
    id: "baby",
    name: "Hoa baby",
    displayName: "hoa baby",
    meaning: "Sự mong manh, thuần khiết & chở che",
  },
  {
    id: "hydrangea",
    name: "Hoa cẩm tú cầu",
    displayName: "hoa cẩm tú cầu",
    meaning: "Lòng biết ơn & sự gắn kết trọn vẹn",
  },
];

/**
 * Red Satin Ribbon Bow Component
 * - Slightly enlarged charming red bow (#E11D48, #B91C1C, #DC2626) with crisp botanical outline (#3A3228)
 * - Positioned right near the bottom of the bouquet cone ("gần đáy của bó hoa")
 * - Two slender, long dangling cords/strings ("2 sợi dây nhỏ mỏng và dài ra") cascading gracefully below the bouquet wrap
 */
function RedRibbonBow({ className = "", shortTails = false }: { className?: string; shortTails?: boolean }) {
  const leftTailPath = shortTails
    ? "M 52 26 C 47 42 40 60 39 78 C 38 87 41 91 38 96"
    : "M 52 26 C 46 50 35 78 33 108 C 31 132 40 144 34 165";
  const rightTailPath = shortTails
    ? "M 58 26 C 63 42 70 60 71 78 C 72 87 69 91 72 98"
    : "M 58 26 C 64 50 73 78 75 108 C 77 132 68 144 74 168";
  return (
    <div
      className={`absolute top-[158px] left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none flex flex-col items-center ${className}`}
    >
      <svg
        width="110"
        height="175"
        viewBox="0 0 110 175"
        fill="none"
        className="overflow-visible filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
      >
        {/* 1. Left Thin, Long Trailing Ribbon Cord (Sợi dây nhỏ, mỏng và dài buông rủ bên trái) */}
        <path
          d={leftTailPath}
          stroke="#DC2626"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d={leftTailPath}
          stroke="#3A3228"
          strokeWidth="0.5"
          strokeOpacity="0.3"
          strokeLinecap="round"
        />
        <circle cx={shortTails ? 38 : 34} cy={shortTails ? 96 : 165} r="1.3" fill="#B91C1C" stroke="#3A3228" strokeWidth="0.5" />

        {/* 2. Right Thin, Long Trailing Ribbon Cord (Sợi dây nhỏ, mỏng và dài buông rủ bên phải) */}
        <path
          d={rightTailPath}
          stroke="#B91C1C"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d={rightTailPath}
          stroke="#3A3228"
          strokeWidth="0.5"
          strokeOpacity="0.3"
          strokeLinecap="round"
        />
        <circle cx={shortTails ? 72 : 74} cy={shortTails ? 98 : 168} r="1.3" fill="#991B1B" stroke="#3A3228" strokeWidth="0.5" />

        {/* 3. Left Ribbon Loop (Cánh nơ to bên trái căng tròn) */}
        <path
          d="M 52 22 C 30 7 8 16 12 30 C 16 41 36 36 52 26 Z"
          fill="#E11D48"
          stroke="#3A3228"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M 50 23 C 34 14 20 22 22 28 C 26 34 38 29 50 25 Z"
          fill="#BE123C"
          stroke="#3A3228"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M 48 18 C 32 11 18 17 16 24"
          stroke="#FECDD3"
          strokeWidth="1.3"
          strokeLinecap="round"
        />

        {/* 4. Right Ribbon Loop (Cánh nơ to bên phải căng tròn) */}
        <path
          d="M 58 22 C 80 7 102 16 98 30 C 94 41 74 36 58 26 Z"
          fill="#E11D48"
          stroke="#3A3228"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M 60 23 C 76 14 90 22 88 28 C 84 34 72 29 60 25 Z"
          fill="#BE123C"
          stroke="#3A3228"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M 62 18 C 78 11 92 17 94 24"
          stroke="#FECDD3"
          strokeWidth="1.3"
          strokeLinecap="round"
        />

        {/* 5. Center Ribbon Knot (Nút thắt nơ đỏ chính giữa) */}
        <path
          d="M 49 17 C 49 13 61 13 61 17 L 62 28 C 62 32 48 32 48 28 Z"
          fill="#B91C1C"
          stroke="#3A3228"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M 55 16 L 55 28"
          stroke="#FCA5A5"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Botanical Hand-drawn Flower SVG Component
 * - viewBox: 0 0 90 170 (Height 170 provides full stem length to descend gracefully into the paper wrap)
 * - mode:
 *    - "full": standing on bottom shelf
 *    - "bouquet": arranged in bouquet slot (deep stem tucking into cone)
 */
function MinimalFlowerSvg({
  flowerId,
  mode = "bouquet",
  deepStem = false,
  className = "",
}: {
  flowerId: string;
  mode?: "full" | "bouquet";
  deepStem?: boolean;
  className?: string;
}) {
  const isShelf = mode === "full";
  // In bouquet mode the stem must dive deeply into the paper cone wrap so that
  // all stems are securely tucked inside and never float detached in mid-air.
  const stemEndY = isShelf ? 150 : 232;
  const tulipStemEndY = isShelf ? 150 : 232;
  const currentViewBox = isShelf ? "0 0 90 170" : "0 0 90 240";

  switch (flowerId) {
    // -------------------------------------------------------------
    // 1. HOA TULIP (Original Tulip from repository)
    // -------------------------------------------------------------
    case "tulip":
      return (
        <svg
          viewBox={currentViewBox}
          className={`select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stem */}
          <path
            d={`M45 52 L45 ${tulipStemEndY}`}
            stroke="#5D7A4D"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Realistic Long Blade Tulip Leaf (Lá hình mũi mác lượn sóng ôm thân) */}
          <path
            d="M44 95 C32 82 23 62 25 44 C28 38 33 42 34 52 C36 66 42 82 44 95 Z"
            fill="#759863"
            stroke="#3A3228"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M26 48 C29 60 36 76 43 90"
            stroke="#5D7A4D"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M46 105 C56 94 65 76 63 60 C61 54 57 58 55 68 C52 80 48 94 46 105 Z"
            fill="#88AA75"
            stroke="#3A3228"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Tulip Flower Head - Flaring 3-pointed crown as in user photo */}
          <g>
            {/* Calyx connection */}
            <path
              d="M40 52 C42 56 48 56 50 52 C48 55 42 55 40 52 Z"
              fill="#5D7A4D"
              stroke="#3A3228"
              strokeWidth="1.4"
            />

            {/* Rear center petal tip (peeking tall at apex) */}
            <path
              d="M45 12 C40 18 36 26 38 32 C42 34 48 34 52 32 C54 26 50 18 45 12 Z"
              fill="#BE123C"
              stroke="#3A3228"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M45 14 C42 20 40 26 42 30"
              stroke="#9F1239"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {/* Left Main Flaring Petal */}
            <path
              d="M45 52 C35 52 25 45 25 34 C25 24 30 16 34 14 C36 18 38 26 42 32 C44 38 45 46 45 52 Z"
              fill="#F43F5E"
              stroke="#3A3228"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M33 18 C30 24 28 32 30 40 C32 46 36 49 41 51"
              stroke="#FDA4AF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Right Main Flaring Petal */}
            <path
              d="M45 52 C55 52 65 45 65 34 C65 24 60 16 56 14 C54 18 52 26 48 32 C46 38 45 46 45 52 Z"
              fill="#FB7185"
              stroke="#3A3228"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M57 18 C60 24 62 32 60 40 C58 46 54 49 49 51"
              stroke="#FECDD3"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Center Front Satin Fold */}
            <path
              d="M45 22 C40 28 37 38 39 48 C41 53 49 53 51 48 C53 38 50 28 45 22 Z"
              fill="#F472B6"
              stroke="#3A3228"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />

            {/* Tulip Silky Luster Sheen */}
            <path
              d="M45 26 C43 32 42 40 44 46"
              stroke="#FFF1F2"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M47 30 C48 36 48 42 47 47"
              stroke="#FFE4E6"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // 2. HOA HỒNG (Original Rose from repository)
    // -------------------------------------------------------------
    case "rose":
      return (
        <svg
          viewBox={currentViewBox}
          className={`select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stem */}
          <path
            d={`M45 54 L45 ${stemEndY}`}
            stroke="#5D7A4D"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Rose Thorn */}
          <path
            d="M45 76 C48 78 50 80 51 82 C49 82 46 81 45 79 Z"
            fill="#4E6B3E"
            stroke="#3A3228"
            strokeWidth="1.2"
          />

          {/* Rose Leaflets */}
          <path
            d="M44 86 C32 80 26 68 28 60 C36 62 42 72 44 86 Z"
            fill="#759863"
            stroke="#3A3228"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M30 67 C35 72 40 78 43 84"
            stroke="#4E6B3E"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M46 98 C58 92 64 80 62 72 C54 74 48 84 46 98 Z"
            fill="#88AA75"
            stroke="#3A3228"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M60 78 C56 83 51 89 47 95"
            stroke="#5D7A4D"
            strokeWidth="1.1"
            strokeLinecap="round"
          />

          {/* Rose Bloom Structure - English Scalloped Garden Rose matching user photo */}
          <g>
            {/* Green calyx sepals */}
            <path
              d="M36 53 C32 58 26 60 22 59 C28 56 34 54 37 51"
              fill="#5D7A4D"
              stroke="#3A3228"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M54 53 C58 58 64 60 68 59 C62 56 56 54 53 51"
              fill="#5D7A4D"
              stroke="#3A3228"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M42 55 C44 59 45 61 45 62 C46 61 47 59 48 55 Z"
              fill="#5D7A4D"
              stroke="#3A3228"
              strokeWidth="1.4"
            />

            {/* Layer 1: Outer Scalloped Petal Silhouette (8 wavy ruffled curves) */}
            <path
              d="M45 13 C51 13 56 15 59 19 C63 18 68 22 69 27 C73 29 74 35 72 40 C73 45 69 51 64 53 C61 56 54 57 48 56 C44 57 37 56 32 53 C27 51 22 46 22 40 C20 35 21 29 25 26 C26 21 31 18 36 18 C39 14 42 13 45 13 Z"
              fill="#E11D48"
              stroke="#3A3228"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />

            {/* Outer Scallop Highlight Edges */}
            <path
              d="M38 18 C42 15 48 15 52 18"
              stroke="#FECDD3"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M60 21 C65 24 67 29 67 34"
              stroke="#FECDD3"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M68 39 C68 44 64 49 59 52"
              stroke="#FECDD3"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M32 52 C27 49 24 44 24 39"
              stroke="#FECDD3"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M24 33 C24 28 27 23 32 20"
              stroke="#FECDD3"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {/* Layer 2: Mid Scalloped Petal Whorl */}
            <path
              d="M45 20 C51 20 56 22 59 26 C62 29 64 35 62 40 C60 45 54 49 48 49 C42 49 35 48 31 43 C28 39 28 32 32 27 C35 22 40 20 45 20 Z"
              fill="#F43F5E"
              stroke="#3A3228"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />

            {/* Layer 3: Inner Petal Cup */}
            <path
              d="M36 26 C41 23 50 23 54 27 C57 32 55 39 52 42 C48 45 42 45 37 42 C33 39 32 31 36 26 Z"
              fill="#FB7185"
              stroke="#3A3228"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* Rose Core: Coiling Rosette Spiral */}
            <path
              d="M40 33 C41 27 50 27 52 32 C53 38 43 41 39 36 C37 31 46 29 48 34 C49 37 45 38 43 36"
              fill="#9F1239"
              stroke="#881337"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Center Swirl Highlight Luster */}
            <path
              d="M43 30 C46 29 49 30 50 33"
              stroke="#FFE4E6"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M40 36 C42 38 46 38 47 36"
              stroke="#FDA4AF"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // 3. HOA HƯỚNG DƯƠNG (Sunflower - Double tier petals & rich seed head)
    // -------------------------------------------------------------
    case "sunflower":
      return (
        <svg
          viewBox={currentViewBox}
          className={`select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sturdy stem */}
          <path
            d={`M45 54 L45 ${stemEndY}`}
            stroke="#5D7A4D"
            strokeWidth="3.4"
            strokeLinecap="round"
          />

          {/* Broad Sunflower Leaves */}
          <path
            d="M44 88 C30 82 23 70 26 62 C33 66 40 76 44 88 Z"
            fill="#759863"
            stroke="#3A3228"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M46 98 C60 92 67 80 64 72 C57 76 50 86 46 98 Z"
            fill="#88AA75"
            stroke="#3A3228"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Sunflower Head */}
          <g>
            {/* Back tier petals */}
            {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
              <g key={`back-${deg}`} transform={`rotate(${deg} 45 35)`}>
                <ellipse
                  cx="45"
                  cy="17.5"
                  rx="4.2"
                  ry="9.2"
                  fill="#F59E0B"
                  stroke="#3A3228"
                  strokeWidth="1.4"
                />
              </g>
            ))}

            {/* Front tier petals */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <g key={`front-${deg}`} transform={`rotate(${deg} 45 35)`}>
                <ellipse
                  cx="45"
                  cy="18"
                  rx="4.6"
                  ry="9"
                  fill="#FBBF24"
                  stroke="#3A3228"
                  strokeWidth="1.6"
                />
              </g>
            ))}

            {/* Center Seed Disk */}
            <circle
              cx="45"
              cy="35"
              r="12"
              fill="#5A3A22"
              stroke="#3A3228"
              strokeWidth="1.8"
            />
            <circle cx="45" cy="35" r="8.5" stroke="#78350F" strokeWidth="1" strokeDasharray="2 2" fill="none" />
            <circle cx="41" cy="32" r="1.3" fill="#D97706" />
            <circle cx="48" cy="32" r="1.3" fill="#D97706" />
            <circle cx="45" cy="38" r="1.3" fill="#D97706" />
            <circle cx="40" cy="37" r="1.0" fill="#B45309" />
            <circle cx="50" cy="37" r="1.0" fill="#B45309" />
            <circle cx="45" cy="34" r="1.5" fill="#FDE68A" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // 4. HOA CÚC (Daisy - Realistic double layered petals & golden eye)
    // -------------------------------------------------------------
    case "daisy":
      return (
        <svg
          viewBox={currentViewBox}
          className={`select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Slender stem */}
          <path
            d={`M45 52 L45 ${stemEndY}`}
            stroke="#5D7A4D"
            strokeWidth="3.0"
            strokeLinecap="round"
          />

          {/* Lobed Daisy Leaves */}
          <path
            d="M44 86 C36 80 29 70 30 62 C34 64 38 72 44 86 Z"
            fill="#759863"
            stroke="#3A3228"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M46 98 C54 92 61 80 60 72 C56 74 52 84 46 98 Z"
            fill="#88AA75"
            stroke="#3A3228"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Daisy Bloom */}
          <g>
            {/* Back Layer of Petals */}
            {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
              <g key={`d-back-${deg}`} transform={`rotate(${deg} 45 35)`}>
                <ellipse
                  cx="45"
                  cy="18"
                  rx="3.8"
                  ry="9.6"
                  fill="#F1F5F9"
                  stroke="#3A3228"
                  strokeWidth="1.4"
                />
              </g>
            ))}

            {/* Front Layer of Petals */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <g key={`d-front-${deg}`} transform={`rotate(${deg} 45 35)`}>
                <ellipse
                  cx="45"
                  cy="18.2"
                  rx="4.1"
                  ry="9.5"
                  fill="#FFFFFF"
                  stroke="#3A3228"
                  strokeWidth="1.6"
                />
                <line
                  x1="45"
                  y1="14"
                  x2="45"
                  y2="22"
                  stroke="#E2E8F0"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </g>
            ))}

            {/* Golden Eye */}
            <circle
              cx="45"
              cy="35"
              r="9.5"
              fill="#F59E0B"
              stroke="#3A3228"
              strokeWidth="1.8"
            />
            <circle
              cx="45"
              cy="35"
              r="6.8"
              stroke="#D97706"
              strokeWidth="1.1"
              strokeDasharray="1.8 1.8"
              fill="none"
            />
            <circle cx="42" cy="32.5" r="1.3" fill="#B45309" />
            <circle cx="48" cy="32.5" r="1.3" fill="#B45309" />
            <circle cx="45" cy="37.5" r="1.3" fill="#B45309" />
            <circle cx="42.5" cy="33" r="1.8" fill="#FEF3C7" />
          </g>
        </svg>
      );

    // -------------------------------------------------------------
    // 5. HOA BABY (Baby's Breath - Delicate branching cloud of florets)
    // -------------------------------------------------------------
    case "baby":
      return (
        <svg
          viewBox={currentViewBox}
          className={`select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main stem */}
          <path
            d={`M45 52 L45 ${stemEndY}`}
            stroke="#5D7A4D"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Delicate Branching Twigs */}
          <path
            d="M45 72 C37 62 28 50 25 38"
            stroke="#5D7A4D"
            strokeWidth="2.0"
            strokeLinecap="round"
          />
          <path
            d="M33 55 C25 49 20 42 18 34"
            stroke="#5D7A4D"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M45 67 C54 58 63 48 65 36"
            stroke="#5D7A4D"
            strokeWidth="2.0"
            strokeLinecap="round"
          />
          <path
            d="M57 54 C65 47 70 42 73 32"
            stroke="#5D7A4D"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M45 52 C45 38 45 28 45 18"
            stroke="#5D7A4D"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M45 40 C38 32 32 26 31 19"
            stroke="#5D7A4D"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M45 36 C52 29 58 24 60 18"
            stroke="#5D7A4D"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Delicate Baby's Breath Florets */}
          {[
            { cx: 45, cy: 17, r: 5.6, isFloret: true },
            { cx: 39, cy: 12, r: 4.2, isFloret: false },
            { cx: 52, cy: 11, r: 4.2, isFloret: false },
            { cx: 31, cy: 18, r: 5.4, isFloret: true },
            { cx: 60, cy: 17, r: 5.4, isFloret: true },
            { cx: 25, cy: 37, r: 5.5, isFloret: true },
            { cx: 18, cy: 33, r: 4.8, isFloret: true },
            { cx: 15, cy: 25, r: 4.0, isFloret: false },
            { cx: 36, cy: 28, r: 4.6, isFloret: true },
            { cx: 65, cy: 35, r: 5.5, isFloret: true },
            { cx: 73, cy: 31, r: 4.8, isFloret: true },
            { cx: 74, cy: 23, r: 4.0, isFloret: false },
            { cx: 54, cy: 27, r: 4.6, isFloret: true },
            { cx: 23, cy: 47, r: 4.2, isFloret: false },
            { cx: 67, cy: 46, r: 4.2, isFloret: false },
          ].map((dot, i) => (
            <g key={i}>
              <circle
                cx={dot.cx}
                cy={dot.cy + 1.2}
                r={dot.r * 0.5}
                fill="#5D7A4D"
              />
              <circle
                cx={dot.cx}
                cy={dot.cy}
                r={dot.r}
                fill="#FFFFFF"
                stroke="#3A3228"
                strokeWidth="1.5"
              />
              {dot.isFloret ? (
                <>
                  <circle cx={dot.cx} cy={dot.cy} r={1.6} fill="#CBD5E1" />
                  <circle cx={dot.cx} cy={dot.cy} r={0.8} fill="#FDE68A" />
                </>
              ) : (
                <circle cx={dot.cx} cy={dot.cy} r={1.2} fill="#A7F3D0" />
              )}
            </g>
          ))}
        </svg>
      );

    // -------------------------------------------------------------
    // 6. HOA CẨM TÚ CẦU (Hydrangea - Cluster of 4-petal pastel blossoms)
    // -------------------------------------------------------------
    case "hydrangea":
      return (
        <svg
          viewBox={currentViewBox}
          className={`select-none ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sturdy stem */}
          <path
            d={`M45 54 L45 ${stemEndY}`}
            stroke="#5D7A4D"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Broad Hydrangea Leaves */}
          <path
            d="M44 88 C28 82 20 70 23 62 C31 66 39 76 44 88 Z"
            fill="#759863"
            stroke="#3A3228"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M46 98 C62 92 70 80 67 72 C59 76 51 86 46 98 Z"
            fill="#88AA75"
            stroke="#3A3228"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Hydrangea Cloud Mophead */}
          <g>
            {[
              { x: 45, y: 18, color: "#93C5FD" },
              { x: 31, y: 25, color: "#A5B4FC" },
              { x: 59, y: 25, color: "#C4B5FD" },
              { x: 23, y: 37, color: "#93C5FD" },
              { x: 43, y: 33, color: "#BFDBFE" },
              { x: 67, y: 37, color: "#A5B4FC" },
              { x: 32, y: 47, color: "#C4B5FD" },
              { x: 56, y: 47, color: "#93C5FD" },
              { x: 44, y: 46, color: "#A5B4FC" },
            ].map((floret, i) => (
              <g key={i} transform={`translate(${floret.x}, ${floret.y})`}>
                <ellipse
                  cx="0"
                  cy="-4.2"
                  rx="3.4"
                  ry="4.2"
                  fill={floret.color}
                  stroke="#3A3228"
                  strokeWidth="1.4"
                />
                <ellipse
                  cx="0"
                  cy="4.2"
                  rx="3.4"
                  ry="4.2"
                  fill={floret.color}
                  stroke="#3A3228"
                  strokeWidth="1.4"
                />
                <ellipse
                  cx="-4.2"
                  cy="0"
                  rx="4.2"
                  ry="3.4"
                  fill={floret.color}
                  stroke="#3A3228"
                  strokeWidth="1.4"
                />
                <ellipse
                  cx="4.2"
                  cy="0"
                  rx="4.2"
                  ry="3.4"
                  fill={floret.color}
                  stroke="#3A3228"
                  strokeWidth="1.4"
                />
                <circle cx="0" cy="0" r="1.3" fill="#FDE68A" />
              </g>
            ))}
          </g>
        </svg>
      );

    default:
      return null;
  }
}

// 10 Flower Slot Coordinates:
// Arranged in an expansive, balanced, breathing floral dome (width -88px to +88px, height -90px to -10px)
// with stems diving deep into the kraft paper wrap mouth (ZERO gap, ZERO hovering in air, ZERO overcrowding).
export interface SlotPosition {
  x: number; // offset x from center (px)
  y: number; // offset y from center (px)
  rotation: number; // angle in degrees
  scale: number;
  zIndex: number;
}

export const BOUQUET_SLOTS: SlotPosition[] = [
  // 1. Crown Center Top (Highest focal bloom)
  { x: 0, y: -48, rotation: 0, scale: 1.02, zIndex: 11 },
  // 2. High Left Upper (Airy flank)
  { x: -38, y: -40, rotation: -9, scale: 0.98, zIndex: 10 },
  // 3. High Right Upper (Airy flank)
  { x: 38, y: -40, rotation: 9, scale: 0.98, zIndex: 10 },
  // 4. Wide Flank Left (Expansive lateral fan)
  { x: -65, y: -26, rotation: -16, scale: 0.95, zIndex: 9 },
  // 5. Wide Flank Right (Expansive lateral fan)
  { x: 65, y: -26, rotation: 16, scale: 0.95, zIndex: 9 },
  // 6. Mid Core Left (Heart layer)
  { x: -20, y: -22, rotation: -4, scale: 0.96, zIndex: 13 },
  // 7. Mid Core Right (Heart layer)
  { x: 20, y: -22, rotation: 4, scale: 0.96, zIndex: 13 },
  // 8. Front Low Left (Nestled along wrapper collar)
  { x: -42, y: -8, rotation: -10, scale: 0.94, zIndex: 14 },
  // 9. Front Low Right (Nestled along wrapper collar)
  { x: 42, y: -8, rotation: 10, scale: 0.94, zIndex: 14 },
  // 10. Front Center Showcase (Low central focal flower)
  { x: 0, y: -4, rotation: 0, scale: 0.96, zIndex: 15 },
];

interface BouquetCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BouquetCreator({ isOpen, onClose }: BouquetCreatorProps) {
  const [step, setStep] = useState<"name_input" | "builder" | "celebrate">("name_input");
  const [userName, setUserName] = useState<string>("");
  const [nameError, setNameError] = useState(false);
  const [selectedFlowers, setSelectedFlowers] = useState<string[]>([]);
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);
  const [isImageReady, setIsImageReady] = useState(false);
  const [memoryMode, setMemoryMode] = useState<"idle" | "picker" | "letter">("idle");
  const [memoryPhotoUrl, setMemoryPhotoUrl] = useState<string | null>(null);
  const [memoryPhotoName, setMemoryPhotoName] = useState("");
  const [isMemoryImageReady, setIsMemoryImageReady] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const memoryPhotoInputRef = useRef<HTMLInputElement>(null);
  const exportCardRef = useRef<HTMLDivElement>(null);
  const memoryExportRef = useRef<HTMLDivElement>(null);
  const bouquetPngUrlRef = useRef<string | null>(null);
  const memoryPngUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen && step === "name_input") {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (step !== "celebrate" || memoryMode !== "idle" || !exportCardRef.current) {
      if (bouquetPngUrlRef.current) URL.revokeObjectURL(bouquetPngUrlRef.current);
      bouquetPngUrlRef.current = null;
      setIsImageReady(false);
      return;
    }

    let cancelled = false;
    setIsImageReady(false);
    if (bouquetPngUrlRef.current) URL.revokeObjectURL(bouquetPngUrlRef.current);
    bouquetPngUrlRef.current = null;

    const timer = setTimeout(async () => {
      try {
        if (document.fonts) {
          await document.fonts.ready;
        }
        const scale = 3;
        const artwork = await html2canvas(exportCardRef.current as HTMLElement, {
          backgroundColor: "#FFFFFF",
          scale,
          useCORS: true,
          logging: false,
          onclone: (clonedDocument) => {
            const colorProperties = [
              "color",
              "background-color",
              "border-top-color",
              "border-right-color",
              "border-bottom-color",
              "border-left-color",
              "outline-color",
              "text-decoration-color",
              "box-shadow",
            ];
            const clonedCard = clonedDocument.querySelector<HTMLElement>("[data-export-card]");
            const elements = [
              clonedDocument.documentElement,
              clonedDocument.body,
              clonedCard,
              ...(clonedCard ? Array.from(clonedCard.querySelectorAll<HTMLElement>("*")) : []),
            ].filter((element): element is HTMLElement => Boolean(element));
            elements.forEach((element) => {
              const computed = clonedDocument.defaultView?.getComputedStyle(element);
              if (!computed) return;
              colorProperties.forEach((property) => {
                const value = computed.getPropertyValue(property);
                if (/oklch|oklab/i.test(value)) {
                  element.style.setProperty(property, property === "background-color" ? "#FFFFFF" : "#3A3228");
                }
              });
            });
          },
        });
        if (cancelled) return;

        const padding = 48 * scale;
        const canvas = document.createElement("canvas");
        canvas.width = artwork.width + padding * 2;
        canvas.height = artwork.height + padding * 2;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.fillStyle = "#F7E8EE";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(artwork, padding, padding);
        const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
        if (!pngBlob || cancelled) return;
        bouquetPngUrlRef.current = URL.createObjectURL(pngBlob);
        setIsImageReady(true);
      } catch (error) {
        console.error("Không thể chuẩn bị ảnh bó hoa PNG", error);
      }
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (bouquetPngUrlRef.current) URL.revokeObjectURL(bouquetPngUrlRef.current);
      bouquetPngUrlRef.current = null;
    };
  }, [step, selectedFlowers, userName, memoryMode]);

  useEffect(() => {
    if (step !== "celebrate" || memoryMode !== "letter" || !memoryExportRef.current) {
      if (memoryPngUrlRef.current) URL.revokeObjectURL(memoryPngUrlRef.current);
      memoryPngUrlRef.current = null;
      setIsMemoryImageReady(false);
      return;
    }

    let cancelled = false;
    setIsMemoryImageReady(false);
    if (memoryPngUrlRef.current) URL.revokeObjectURL(memoryPngUrlRef.current);
    memoryPngUrlRef.current = null;

    const timer = setTimeout(async () => {
      try {
        if (document.fonts) await document.fonts.ready;
        const artwork = await html2canvas(memoryExportRef.current as HTMLElement, {
          backgroundColor: "#F7E8EE",
          scale: 3,
          useCORS: true,
          logging: false,
          onclone: (clonedDocument) => {
            clonedDocument.querySelectorAll<HTMLElement>("[data-memory-close]").forEach((element) => {
              element.style.display = "none";
            });
            const colorProperties = [
              "color", "background-color", "border-top-color", "border-right-color",
              "border-bottom-color", "border-left-color", "outline-color",
              "text-decoration-color", "box-shadow",
            ];
            const target = clonedDocument.querySelector<HTMLElement>("[data-memory-export-stage]");
            const elements = [
              clonedDocument.documentElement,
              clonedDocument.body,
              target,
              ...(target ? Array.from(target.querySelectorAll<HTMLElement>("*")) : []),
            ].filter((element): element is HTMLElement => Boolean(element));
            elements.forEach((element) => {
              const computed = clonedDocument.defaultView?.getComputedStyle(element);
              if (!computed) return;
              colorProperties.forEach((property) => {
                const value = computed.getPropertyValue(property);
                if (/oklch|oklab/i.test(value)) {
                  element.style.setProperty(property, property === "background-color" ? "#F7E8EE" : "#3A3228");
                }
              });
            });
          },
        });
        if (cancelled) return;
        const pngBlob = await new Promise<Blob | null>((resolve) => artwork.toBlob(resolve, "image/png"));
        if (!pngBlob || cancelled) return;
        memoryPngUrlRef.current = URL.createObjectURL(pngBlob);
        setIsMemoryImageReady(true);
      } catch (error) {
        console.error("Không thể chuẩn bị ảnh lá thư PNG", error);
      }
    }, 220);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (memoryPngUrlRef.current) URL.revokeObjectURL(memoryPngUrlRef.current);
      memoryPngUrlRef.current = null;
    };
  }, [step, memoryMode, memoryPhotoUrl, selectedFlowers, userName]);

  useEffect(() => {
    return () => {
      if (memoryPhotoUrl) URL.revokeObjectURL(memoryPhotoUrl);
    };
  }, [memoryPhotoUrl]);

  const handleStartBuilding = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = userName.trim();
    if (!trimmed) {
      setNameError(true);
      inputRef.current?.focus();
      return;
    }
    setNameError(false);
    setStep("builder");
  };

  const handleAddFlower = (flowerId: string) => {
    if (selectedFlowers.length >= 10) return;
    const nextSlot = selectedFlowers.length;
    playFlowerPluckSound(nextSlot);
    setSelectedFlowers((prev) => [...prev, flowerId]);
    setLastAddedIndex(nextSlot);
  };

  const handleUndoFlower = () => {
    if (selectedFlowers.length === 0) return;
    setSelectedFlowers((prev) => prev.slice(0, -1));
    setLastAddedIndex(null);
  };

  const handleResetBouquet = () => {
    setSelectedFlowers([]);
    setLastAddedIndex(null);
  };

  const handleFinishBouquet = () => {
    if (selectedFlowers.length === 0) return;
    setStep("celebrate");
  };

  const handleCreateMemory = () => {
    setMemoryMode("picker");
  };

  const handleMemoryPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (memoryPhotoUrl) URL.revokeObjectURL(memoryPhotoUrl);
    setMemoryPhotoUrl(URL.createObjectURL(file));
    setMemoryPhotoName(file.name.replace(/\.[^/.]+$/, ""));
    setMemoryMode("letter");
    event.target.value = "";
  };

  const handleExportImage = (kind: "bouquet" | "memory") => {
    const downloadUrl = kind === "memory" ? memoryPngUrlRef.current : bouquetPngUrlRef.current;
    if (!downloadUrl) return;
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = kind === "memory" ? `ky-niem-20-10-${userName || "12A4"}.png` : `bo-hoa-20-10-${userName || "12A4"}.png`;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const renderMemoryBouquet = () => (
    <div className="memory-letter-bouquet" aria-label="Bó hoa đã tạo">
      <div className="relative w-[260px] h-[300px] flex items-center justify-center">
        <div className="absolute pointer-events-none select-none z-1 flex items-center justify-center" style={{ width: "230px", height: "190px", transform: "translateY(24px)" }}>
          <svg viewBox="0 0 300 245" className="w-full h-full" fill="none">
            <path d="M 134 176 L 88 214 L 114 240 L 150 228 L 186 240 L 212 214 L 166 176 Z" fill="#D1C1AC" stroke="#3A3228" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 25 15 L 138 180 Q 150 184 162 180 L 275 15 Q 210 45 150 38 Q 90 45 25 15 Z" fill="#D1C1AC" stroke="#3A3228" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none bouquet-flower-layer" aria-hidden="true">
          {selectedFlowers.map((flowerId, index) => {
            const slot = BOUQUET_SLOTS[index];
            if (!slot) return null;
            return (
              <div key={`memory-${index}`} className="absolute flex flex-col items-center justify-center" style={{ transform: `translate(${slot.x * 0.78}px, ${slot.y * 0.78 - 15}px) rotate(${slot.rotation}deg) scale(${slot.scale * 0.78})`, transformOrigin: "center center", zIndex: slot.zIndex }}>
                <div className="w-28 h-60 flex items-center justify-center">
                  <MinimalFlowerSvg flowerId={flowerId} mode="bouquet" className="w-full h-full" />
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute pointer-events-none select-none z-20 flex items-center justify-center" style={{ width: "230px", height: "190px", transform: "translateY(24px)" }}>
          <svg viewBox="0 0 300 245" className="w-full h-full" fill="none">
            {/* Opaque front paper shield: stems must disappear behind the wrap. */}
            <path d="M 18 35 Q 74 53 150 55 Q 226 53 282 35 L 162 180 Q 150 184 138 180 Z" fill="#E4D7C0" stroke="#3A3228" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 134 178 C 124 193 106 209 91 220 C 108 233 128 240 150 239 C 172 240 192 233 209 220 C 194 209 176 193 166 178 C 155 184 145 184 134 178 Z" fill="#E8DFC8" stroke="#3A3228" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 18 35 Q 65 95 138 178 L 92 56 Q 52 44 18 35 Z" fill="#E8DFC8" stroke="#3A3228" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 282 35 Q 235 95 162 178 L 208 56 Q 248 44 282 35 Z" fill="#EFE7D5" stroke="#3A3228" strokeWidth="2" strokeLinejoin="round" />
            <path d="M 55 60 L 138 180 Q 150 184 162 180 L 245 60 Q 150 78 55 60 Z" fill="#E4D7C0" stroke="#3A3228" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <RedRibbonBow className="memory-ribbon-bow" shortTails />
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-900/60 backdrop-blur-sm animate-letter-stage-in font-sans">
      <div className="relative flex flex-col w-full h-full min-h-screen bg-[#FAF7F2] text-[#3A3228] select-none overflow-x-hidden">
        
        {/* ======================================================== */}
        {/* STEP 1: Ask "Tên bạn là gì:"                             */}
        {/* ======================================================== */}
        {step === "name_input" && (
          <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-8">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#EFEAE2] text-[#6E6357] transition cursor-pointer"
              title="Đóng"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center animate-envelope-pop">
              <div className="w-20 h-28 mb-4">
                <MinimalFlowerSvg flowerId="tulip" mode="full" />
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#3A3228] mb-2 tracking-tight">
                Tên bạn là gì:
              </h2>

              <p className="text-sm text-[#7D7164] mb-8 font-light">
                Hãy nhập tên của bạn để bắt đầu tạo bó hoa nhé!
              </p>

              <form onSubmit={handleStartBuilding} className="w-full flex flex-col items-center gap-4">
                <div className="w-full relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      if (nameError) setNameError(false);
                    }}
                    placeholder="Nhập tên của bạn..."
                    className={`w-full px-5 py-3.5 rounded-full bg-[#FFFFFF] border text-[#3A3228] placeholder:text-[#A89E92] text-center text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#8C7A68] transition shadow-sm ${
                      nameError ? "border-rose-400 ring-2 ring-rose-200" : "border-[#DCD3C5]"
                    }`}
                    maxLength={28}
                  />
                </div>

                {nameError && (
                  <p className="text-xs text-rose-500 font-medium">
                    Vui lòng nhập tên bạn nhé!
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-2 px-8 py-3 rounded-full bg-[#4A3F35] hover:bg-[#382F27] active:scale-95 text-[#FAF7F2] font-medium text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <span>Tiếp tục</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: The Bouquet Creator (FLAWLESS 10-FLOWER TUCK)     */}
        {/* ======================================================== */}
        {step === "builder" && (
          <div className="relative flex-1 flex flex-col justify-between max-w-4xl w-full mx-auto px-4 py-3 sm:py-5">
            
            {/* Top Control Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D8]">
              <button
                onClick={() => setStep("name_input")}
                className="flex items-center gap-1.5 text-xs text-[#6E6357] hover:text-[#3A3228] px-2.5 py-1.5 rounded-lg hover:bg-[#EFEAE2] transition cursor-pointer"
                title="Thay đổi tên"
              >
                <span>←</span>
                <span>Tên: <strong className="font-semibold text-[#3A3228]">{userName}</strong></span>
              </button>

              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-sm font-medium text-[#4A3F35]">
                  Bó hoa ({selectedFlowers.length}/10)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleUndoFlower}
                  disabled={selectedFlowers.length === 0}
                  className="p-1.5 rounded-lg text-[#6E6357] hover:text-[#3A3228] hover:bg-[#EFEAE2] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  title="Gỡ bông cuối"
                >
                  <Undo2 className="w-4 h-4" />
                </button>

                <button
                  onClick={handleResetBouquet}
                  disabled={selectedFlowers.length === 0}
                  className="p-1.5 rounded-lg text-[#6E6357] hover:text-[#3A3228] hover:bg-[#EFEAE2] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  title="Cắm lại từ đầu"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[#6E6357] hover:text-[#3A3228] hover:bg-[#EFEAE2] transition cursor-pointer"
                  title="Đóng"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* BOUQUET DISPLAY STAGE:
                Unified center alignment so that the flowers, back cone, and front wrap
                share the exact same coordinate system!
            */}
            <div className="relative flex-1 min-h-[380px] sm:min-h-[440px] flex items-center justify-center my-1 overflow-hidden">
              <div className="relative w-[340px] sm:w-[400px] h-[380px] sm:h-[440px] flex items-center justify-center">
                
                {/* 1. BACK WRAPPING PAPER CONE (Behind flowers, zIndex: 1) */}
                <div
                  className="absolute pointer-events-none select-none z-1 flex items-center justify-center"
                  style={{
                    width: "300px",
                    height: "245px",
                    transform: "translate(0px, 30px)",
                  }}
                >
                  <svg viewBox="0 0 300 245" className="w-full h-full" fill="none">
                    {/* Back flared base skirt (lining / shadow) */}
                    <path
                      d="M 134 176 L 88 214 L 114 240 L 150 228 L 186 240 L 212 214 L 166 176 Z"
                      fill="#D1C1AC"
                      stroke="#3A3228"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    {/* Upper back cone */}
                    <path
                      d="M 25 15 L 138 180 Q 150 184 162 180 L 275 15 Q 210 45 150 38 Q 90 45 25 15 Z"
                      fill="#D1C1AC"
                      stroke="#3A3228"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path d="M 150 38 L 150 180" stroke="#BAA78E" strokeWidth="1.2" strokeDasharray="3 3" />
                  </svg>
                </div>

                {/* 2. THE 10 FLOWER SLOTS (Lush, well-spaced dome fanning out above and diving into wrap) */}
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none bouquet-flower-layer"
                  aria-hidden="true"
                >
                {selectedFlowers.map((flowerId, index) => {
                  const slot = BOUQUET_SLOTS[index];
                  if (!slot) return null;
                  const isJustAdded = lastAddedIndex === index;

                  return (
                    <div
                      key={`slot-${index}-${flowerId}`}
                      className="absolute flex flex-col items-center justify-center transition-all duration-400"
                      style={{
                        transform: `translate(${slot.x}px, ${slot.y}px) rotate(${slot.rotation}deg) scale(${slot.scale})`,
                        transformOrigin: "center center",
                        zIndex: slot.zIndex,
                      }}
                    >
                      <div
                        className={`w-28 h-60 flex items-center justify-center ${
                          isJustAdded ? "animate-envelope-pop" : ""
                        }`}
                      >
                        <MinimalFlowerSvg flowerId={flowerId} mode="bouquet" className="w-full h-full" />
                      </div>
                    </div>
                  );
                })}
                </div>

                {/* 3. FRONT WRAPPING PAPER & RIBBON (In front of stems, zIndex: 20) */}
                <div
                  className="absolute pointer-events-none select-none z-20 flex items-center justify-center"
                  style={{
                    width: "300px",
                    height: "245px",
                    transform: "translate(0px, 30px)",
                  }}
                >
                  <svg viewBox="0 0 300 245" className="w-full h-full" fill="none">
                    {/* === SOFT FLARED BASE (Đế giấy xòe mềm, không còn nếp gấp vuông) === */}
                    <path
                      d="M 134 178 C 124 193 106 209 91 220 C 108 233 128 240 150 239 C 172 240 192 233 209 220 C 194 209 176 193 166 178 C 155 184 145 184 134 178 Z"
                      fill="#E8DFC8"
                      stroke="#3A3228"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path d="M 136 183 C 132 199 123 217 109 229" stroke="#CBBEAA" strokeWidth="1.35" strokeLinecap="round" />
                    <path d="M 164 183 C 168 199 177 217 191 229" stroke="#D8CDBB" strokeWidth="1.35" strokeLinecap="round" />
                    <path d="M 150 185 C 148 202 149 218 150 232" stroke="#F8F1E3" strokeWidth="1.2" strokeLinecap="round" opacity=".85" />

                    {/* === UPPER FRONT CONE (Thân trên của giấy gói ôm các cành hoa) === */}
                    {/* Left folded paper wing */}
                    <path
                      d="M 18 35 Q 65 95 138 178 L 92 56 Q 52 44 18 35 Z"
                      fill="#E8DFC8"
                      stroke="#3A3228"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    {/* Right folded paper wing */}
                    <path
                      d="M 282 35 Q 235 95 162 178 L 208 56 Q 248 44 282 35 Z"
                      fill="#EFE7D5"
                      stroke="#3A3228"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    {/* Center front cone flap & collar */}
                    <path
                      d="M 55 60 L 138 180 Q 150 184 162 180 L 245 60 Q 150 78 55 60 Z"
                      fill="#E4D7C0"
                      stroke="#3A3228"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    {/* Texture crease accents */}
                    <path d="M 105 105 L 140 165" stroke="#D1C3A5" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M 195 105 L 160 165" stroke="#D1C3A5" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>

                  {/* Red Satin Ribbon Bow with Flowing Tails */}
                  <RedRibbonBow />
                </div>

                {/* Empty State Prompt */}
                {selectedFlowers.length === 0 && (
                  <div className="absolute top-12 z-25 text-center px-4 py-2 rounded-full bg-white/75 border border-[#DCD3C5] shadow-xs text-xs text-[#7D7164]">
                    Chọn các bông hoa bên dưới để cắm vào bó nhé! (Tối đa 10 bông)
                  </div>
                )}
              </div>
            </div>

            {/* Finish Action Button */}
            {selectedFlowers.length > 0 && (
              <div className="flex justify-center mb-1">
                <button
                  onClick={handleFinishBouquet}
                  className="px-6 py-2 rounded-full bg-[#4A3F35] hover:bg-[#382F27] active:scale-95 text-[#FAF7F2] text-xs font-medium flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Hoàn thành bó hoa ({selectedFlowers.length}/10)</span>
                </button>
              </div>
            )}

            {/* FLOWER SELECTION RACK (6 FLOWERS STANDING) */}
            <div className="relative z-30 pt-2 border-t border-[#EAE3D8]">
              <div className="grid grid-cols-6 gap-1 sm:gap-3">
                {FLOWER_CATALOG.map((flower) => {
                  const countInBouquet = selectedFlowers.filter((id) => id === flower.id).length;
                  const isMaxed = selectedFlowers.length >= 10;

                  return (
                    <button
                      key={flower.id}
                      onClick={() => handleAddFlower(flower.id)}
                      disabled={isMaxed}
                      className={`group relative flex flex-col items-center justify-end p-1 sm:p-2 rounded-xl transition-all cursor-pointer ${
                        isMaxed
                          ? "opacity-45 cursor-not-allowed"
                          : "hover:bg-[#EFEAE2]/60 hover:-translate-y-1 active:translate-y-0"
                      }`}
                      title={`Cắm ${flower.name}`}
                    >
                      {countInBouquet > 0 && (
                        <span className="absolute top-0 right-1 sm:right-2 bg-[#4A3F35] text-[#FAF7F2] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                          {countInBouquet}
                        </span>
                      )}

                      <div className="w-14 sm:w-16 h-24 sm:h-28 flex items-center justify-center transition-transform group-hover:scale-105">
                        <MinimalFlowerSvg flowerId={flower.id} mode="full" />
                      </div>

                      <span className="font-serif-luxury text-[11px] sm:text-xs text-[#4A3F35] mt-1 text-center whitespace-nowrap">
                        {flower.displayName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: CELEBRATE / POSTCARD VIEW                         */}
        {/* ======================================================== */}
        {step === "celebrate" && memoryMode === "idle" && (
          <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-8 animate-envelope-pop">
            <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E7DFD4] text-center">
              <div ref={exportCardRef} data-export-card="true" className="rounded-[28px] bg-white px-6 pt-5 pb-6">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#3A3228] mb-1">
                Bó hoa của {userName}
              </h2>
              
              <p className="text-xs text-[#7D7164] mb-4">
                Bó hoa 20/10 tuyệt đẹp với {selectedFlowers.length} đóa hoa yêu thương
              </p>

              {/* Scaled bouquet preview matching builder stage */}
              <div data-export-preview="true" className="relative w-72 h-76 mx-auto my-2 flex items-center justify-center bg-[#FAF7F2] rounded-2xl border border-[#EAE3D8] overflow-hidden">
                <div
                  className="relative w-[340px] h-[380px] flex items-center justify-center"
                  style={{
                    transform: "scale(0.68) translateY(-4px)",
                    transformOrigin: "center center",
                  }}
                >
                  {/* Back wrap */}
                  <div
                    data-bouquet-layer="back"
                    className="absolute pointer-events-none select-none z-1 flex items-center justify-center"
                    style={{
                      width: "300px",
                      height: "245px",
                      transform: "translate(0px, 30px)",
                    }}
                  >
                    <svg viewBox="0 0 300 245" className="w-full h-full" fill="none">
                      {/* Back flared base skirt (lining / shadow) */}
                      <path
                        d="M 134 176 L 88 214 L 114 240 L 150 228 L 186 240 L 212 214 L 166 176 Z"
                        fill="#D1C1AC"
                        stroke="#3A3228"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      {/* Upper back cone */}
                      <path
                        d="M 25 15 L 138 180 Q 150 184 162 180 L 275 15 Q 210 45 150 38 Q 90 45 25 15 Z"
                        fill="#D1C1AC"
                        stroke="#3A3228"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path d="M 150 38 L 150 180" stroke="#BAA78E" strokeWidth="1.2" strokeDasharray="3 3" />
                    </svg>
                  </div>

                  {/* Flowers */}
                  <div
                    data-bouquet-layer="flowers"
                    className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none bouquet-flower-layer"
                    aria-hidden="true"
                  >
                  {selectedFlowers.map((flowerId, index) => {
                    const slot = BOUQUET_SLOTS[index];
                    if (!slot) return null;
                    return (
                      <div
                        key={`prev-${index}`}
                        className="absolute flex flex-col items-center justify-center"
                        style={{
                          transform: `translate(${slot.x}px, ${slot.y}px) rotate(${slot.rotation}deg) scale(${slot.scale})`,
                          transformOrigin: "center center",
                          zIndex: slot.zIndex,
                        }}
                      >
                        <div className="w-28 h-60 flex items-center justify-center">
                          <MinimalFlowerSvg flowerId={flowerId} mode="bouquet" className="w-full h-full" />
                        </div>
                      </div>
                    );
                  })}
                  </div>

                  {/* Front wrap */}
                  <div
                    data-bouquet-layer="front"
                    className="absolute pointer-events-none select-none z-20 flex items-center justify-center"
                    style={{
                      width: "300px",
                      height: "245px",
                      transform: "translate(0px, 30px)",
                    }}
                  >
                    <svg viewBox="0 0 300 245" className="w-full h-full" fill="none">
                      {/* === SOFT FLARED BASE (Đế giấy xòe mềm, không còn nếp gấp vuông) === */}
                      <path
                        d="M 134 178 C 124 193 106 209 91 220 C 108 233 128 240 150 239 C 172 240 192 233 209 220 C 194 209 176 193 166 178 C 155 184 145 184 134 178 Z"
                        fill="#E8DFC8"
                        stroke="#3A3228"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path d="M 136 183 C 132 199 123 217 109 229" stroke="#CBBEAA" strokeWidth="1.35" strokeLinecap="round" />
                      <path d="M 164 183 C 168 199 177 217 191 229" stroke="#D8CDBB" strokeWidth="1.35" strokeLinecap="round" />
                      <path d="M 150 185 C 148 202 149 218 150 232" stroke="#F8F1E3" strokeWidth="1.2" strokeLinecap="round" opacity=".85" />

                      {/* === UPPER FRONT CONE (Thân trên của giấy gói ôm các cành hoa) === */}
                      {/* Left folded paper wing */}
                      <path
                        d="M 18 35 Q 65 95 138 178 L 92 56 Q 52 44 18 35 Z"
                        fill="#E8DFC8"
                        stroke="#3A3228"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      {/* Right folded paper wing */}
                      <path
                        d="M 282 35 Q 235 95 162 178 L 208 56 Q 248 44 282 35 Z"
                        fill="#EFE7D5"
                        stroke="#3A3228"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      {/* Center front cone flap & collar */}
                      <path
                        d="M 55 60 L 138 180 Q 150 184 162 180 L 245 60 Q 150 78 55 60 Z"
                        fill="#E4D7C0"
                        stroke="#3A3228"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      {/* Texture crease accents */}
                      <path d="M 105 105 L 140 165" stroke="#D1C3A5" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M 195 105 L 160 165" stroke="#D1C3A5" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>

                    {/* Red Satin Ribbon Bow with Flowing Tails */}
                    <RedRibbonBow />
                  </div>
                </div>
              </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => handleExportImage("bouquet")}
                  disabled={!isImageReady}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#DCD3C5] bg-white text-[#4A3F35] hover:bg-[#FAF7F2] hover:border-[#C4B7A5] font-medium text-xs transition cursor-pointer disabled:opacity-60 disabled:cursor-wait shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#B83264]" />
                  {isImageReady ? "Lưu ảnh bông hoa" : "Đang chuẩn bị ảnh..."}
                </button>
                <button
                  onClick={handleCreateMemory}
                  className="py-2.5 px-3 rounded-xl bg-[#B83264] hover:bg-[#96264F] text-[#FAF7F2] font-medium text-xs shadow-sm transition cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                  Tạo ảnh kỉ niệm
                </button>
                <button
                  onClick={() => setStep("builder")}
                  className="py-2.5 px-3 rounded-xl border border-[#DCD3C5] text-[#4A3F35] hover:bg-[#FAF7F2] font-medium text-xs transition cursor-pointer"
                >
                  Cắm thêm hoa 🌷
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl bg-[#4A3F35] hover:bg-[#382F27] text-[#FAF7F2] font-medium text-xs shadow-sm transition cursor-pointer"
                >
                  Quay lại trang chính
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "celebrate" && memoryMode === "picker" && (
          <div className="memory-picker-stage relative flex-1 flex items-center justify-center px-4 py-8 animate-envelope-pop">
            <div className="memory-picker-card relative w-full max-w-lg rounded-[30px] border border-[#EAD7D3] bg-[#FFFDFC] px-6 py-10 sm:px-12 text-center shadow-[0_24px_70px_rgba(143,67,91,0.18)]">
              <button
                onClick={() => setMemoryMode("idle")}
                className="absolute right-5 top-5 rounded-full border border-[#EBD1D8] p-2 text-[#B83264] transition hover:bg-[#FFF0F4]"
                title="Quay lại"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0F4] text-[#B83264]">
                <Sparkles className="h-7 w-7" />
              </div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B83264]">Một kỷ niệm thật xinh</p>
              <h2 className="font-serif-luxury text-3xl font-semibold text-[#3A3228]">Chọn một bức ảnh của bạn</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#7D7164]">
                Hãy chọn một tấm ảnh bạn thấy mình xinh nhất. Ảnh sẽ được đặt vào lá thư cùng bó hoa bạn vừa tự tay tạo.
              </p>
              <label className="mx-auto mt-7 flex max-w-sm cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-[#DFA7B8] bg-[#FFF6F8] px-6 py-8 text-[#B83264] transition hover:-translate-y-0.5 hover:bg-[#FFEFF4]">
                <Upload className="h-7 w-7" />
                <span className="text-sm font-semibold">Chọn ảnh từ thiết bị</span>
                <span className="text-xs text-[#9D7180]">JPG, PNG hoặc WEBP</span>
                <input ref={memoryPhotoInputRef} type="file" accept="image/*" onChange={handleMemoryPhotoChange} className="sr-only" />
              </label>
              <button onClick={() => setMemoryMode("idle")} className="mt-6 text-xs font-medium text-[#7D7164] underline underline-offset-4 hover:text-[#B83264]">
                Quay lại bó hoa
              </button>
            </div>
          </div>
        )}

        {step === "celebrate" && memoryMode === "letter" && memoryPhotoUrl && (
          <div className="memory-letter-stage relative flex-1 flex flex-col items-center justify-center overflow-y-auto px-4 py-8 sm:px-8">
            <div ref={memoryExportRef} data-memory-export-stage="true" className="memory-export-stage">
              <div className="memory-letter-paper animate-envelope-pop">
              <button
                onClick={() => setMemoryMode("idle")}
                data-memory-close="true"
                className="absolute right-4 top-4 z-10 rounded-full border border-[#E6B9C6] bg-white/75 p-2 text-[#B83264] shadow-sm transition hover:bg-white"
                title="Quay lại"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="memory-letter-copy">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B83264]">Gửi {userName} · 12A4</p>
                <h2 className="mt-3 font-serif-luxury text-3xl font-semibold leading-tight text-[#9F2857] sm:text-4xl">Một chút yêu thương dành cho {userName}</h2>
                <div className="my-5 h-px w-16 bg-[#D97998]" />
                <p className="text-sm leading-7 text-[#765260] sm:text-base">
                  Chúc {userName} luôn rạng rỡ, tự tin và dịu dàng với chính mình. Mong những ngày phía trước sẽ có thật nhiều nụ cười, những người thương yêu và những điều nhỏ xinh làm trái tim {userName} vui hơn.
                </p>
                <p className="mt-4 text-sm leading-7 text-[#765260] sm:text-base">
                  Cảm ơn {userName} vì đã làm nên một phần thật đẹp của thanh xuân 12A4. Hãy luôn nhớ rằng {userName} xứng đáng với những điều ngọt ngào nhất.
                </p>
                <p className="mt-7 font-serif-luxury text-xl italic text-[#B83264]">Thân gửi {userName},</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9D7180]">Tập thể 12A4 ♡</p>
              </div>
              <figure className="memory-letter-photo">
                <img src={memoryPhotoUrl} alt={memoryPhotoName || "Ảnh kỷ niệm"} />
                <figcaption>Một khoảnh khắc thật xinh ♡</figcaption>
              </figure>
              {renderMemoryBouquet()}
              </div>
            </div>
            <button
              onClick={() => handleExportImage("memory")}
              disabled={!isMemoryImageReady}
              className="memory-letter-download"
            >
              {isMemoryImageReady ? "Lưu ảnh" : "Đang chuẩn bị ảnh..."}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
