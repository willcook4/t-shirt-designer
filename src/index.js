// TODO turn strict mode back on later
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import { App as Canvas } from "./Canvas";
import Overlay from "./Overlay";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  // <StrictMode>
    <>
        <Overlay />
        <Canvas />
    </>
  // </StrictMode>
);
