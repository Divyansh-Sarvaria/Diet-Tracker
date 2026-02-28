import bg from "../assets/LoginBackground.svg";
export default function Background() {
  return (
    <div
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      <img
        src={bg}
        alt="Background"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
