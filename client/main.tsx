import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";

import App from "./App";
import "../global.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element with id 'root' not found");
}

const containerWithRoot = container as HTMLElement & { __reactRoot?: Root };
const root = containerWithRoot.__reactRoot ?? createRoot(container);

if (!containerWithRoot.__reactRoot) {
  containerWithRoot.__reactRoot = root;
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    root.unmount();
    containerWithRoot.__reactRoot = undefined;
  });
}
