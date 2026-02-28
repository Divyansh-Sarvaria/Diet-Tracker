import btn from "../assets/LoginBtn.svg";
export default function LoginBtnStyling({ text = "login", onClick }) {
  return (
    <div
      style={{
        position: "relative",
        width: "200px",
        height: "50px",
      }}
    >
      <img
        src={btn}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />

      {/* Real button */}
      <button
        type="submit"
        onClick={onClick}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        {text}
      </button>
    </div>
  );
}
