// This file was automatically compiled from TypeScript. View the original file for a more human-readable version.

import toastify from "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify-es.js";
function showAlert(text, color, duration) {
  color = color.toLowerCase();
  if (color === "success")
    color = "#009c3f";
  if (color === "error")
    color = "#ff5555";
  toastify({
    text: text || "No text specified!",
    duration: duration || 4e3,
    position: "center",
    style: {
      background: "#c1e7fb",
      border: "1px solid #b4b4b4",
      borderRadius: "6px",
      boxShadow: "none",
      color: color || "#009c3f",
      fontFamily: '"Quattrocento Sans", sans-serif',
      fontSize: "17px",
      fontWeight: "600",
      minWidth: "150px",
      padding: "16px 30px",
      textAlign: "center"
    }
  }).showToast();
}
export {
  showAlert
};
