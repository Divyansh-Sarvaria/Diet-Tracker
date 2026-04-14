import { useEffect, useRef } from "react";
import "./ProgressBubblesStyle.css";

export default function WaterProgress({ label, percent, color }) {
  const bubblesRef = useRef(null);

  useEffect(() => {
    const container = bubblesRef.current;
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const b = document.createElement("div");
      b.className = "bubble";
      const size = 3 + Math.random() * 5;
      b.style.cssText = `
        width:${size}px; height:${size}px;
        left:${10 + Math.random() * 80}%;
        animation-duration:${1.8 + Math.random() * 2.5}s;
        animation-delay:${Math.random() * 3}s;
      `;
      container.appendChild(b);
    }
  }, []);

  // extract first color stop for the wave fill tint
  const waveColor1 = color.match(/#[a-fA-F0-9]{3,6}/g)?.[0] ?? "#4facfe";
  const waveColor2 = color.match(/#[a-fA-F0-9]{3,6}/g)?.[1] ?? "#00f2fe";

  return (
    <div className="text-center p-3">
      <span className="label">{label}</span>

      <div className="circle">
        {/* water fill wrapper */}
        <div className="fill" style={{ height: percent + "%" }}>

          {/* wave 1 */}
          <svg
            className="wave wave-1"
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,20 C50,0 100,40 150,20 C200,0 250,40 300,20 C350,0 400,40 400,20 L400,40 L0,40 Z"
              fill={waveColor1 + "dd"}
            />
          </svg>

          {/* wave 2 */}
          <svg
            className="wave wave-2"
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,20 C60,40 120,0 180,20 C240,40 300,0 360,20 C390,32 400,28 400,20 L400,40 L0,40 Z"
              fill={waveColor2 + "77"}
            />
          </svg>

          {/* solid body below waves */}
          <div
            className="fill-body"
            style={{ background: color }}
          />
        </div>

        {/* bubbles */}
        <div className="bubbles" ref={bubblesRef} />

        <div className="circle-text">
          <span className="pct">{percent}%</span>
        </div>
      </div>
    </div>
  );
}