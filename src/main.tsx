import ReactDOM from "react-dom/client";
import App from "./App";

import "./main.css";

document.querySelectorAll(".react-app").forEach((element) => {
  const root = ReactDOM.createRoot(element);

  root.render(<App id={element.id} />);
});
