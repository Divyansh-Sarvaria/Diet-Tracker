import "FrontEnd/src/assets/PlanDietProgressbubbleStyle.css";
export default function PlanDietProgressbubbles() {
  return (
    <div class="water-progress" data-id="1">
      <span class="label">Hydration</span>

      <div class="circle">
        <div class="fill">
          <svg
            class="wave-svg-1"
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C50,0 100,40 150,20 C200,0 250,40 300,20 C350,0 400,40 400,20 L400,40 L0,40 Z"
              fill="rgba(79,172,254,0.85)"
            />
          </svg>

          <svg
            class="wave-svg-2"
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C60,40 120,0 180,20 C240,40 300,0 360,20 C390,32 400,28 400,20 L400,40 L0,40 Z"
              fill="rgba(0,242,254,0.45)"
            />
          </svg>

          <div class="fill-body"></div>
        </div>

        <div class="bubbles"></div>

        <div class="circle-text">
          <span class="pct">60%</span>
          <span class="unit">LEVEL</span>
        </div>
      </div>
    </div>
  );
}
