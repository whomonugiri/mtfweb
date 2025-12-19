import React from "react";

export const Loader = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Loading...</p>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
    color: "#fff",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255,255,255,0.2)",
    borderTop: "5px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: {
    marginTop: "12px",
    fontSize: "16px",
    opacity: 0.9,
  },
};

export default Loader;
