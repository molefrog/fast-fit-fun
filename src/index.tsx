import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles.css";

document.querySelectorAll(".react-app").forEach((element) => {
  const root = ReactDOM.createRoot(element);

  root.render(<App id={element.id} />);
});
