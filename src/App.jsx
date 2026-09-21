import React, { useState } from "react";

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e3e6ea",
  borderRadius: 12,
  padding: 24,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "48px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h1 style={{ margin: 0, fontSize: 32, letterSpacing: "-0.02em" }}>bunjujgle</h1>
        <p style={{ margin: 0, color: "#5b6572", fontSize: 16 }}>
          Vite + React starter running in an Alloy dev environment.
        </p>
      </header>

      <section style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Environment check</h2>
        <p style={{ margin: 0, color: "#5b6572" }}>
          The dev server is serving this page with hot module reload enabled.
        </p>
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            alignSelf: "flex-start",
            background: "#1f6feb",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            padding: "10px 16px",
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Clicked {count} {count === 1 ? "time" : "times"}
        </button>
      </section>
    </main>
  );
}
