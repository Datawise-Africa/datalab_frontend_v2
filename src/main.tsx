import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PositionProvider } from "./storage/PositionProvider";
import App from "./App";
import "./index.css";

const clientId =
  "264082792754-qro0613m02oel96nardi6bf5dboruei4.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <PositionProvider>
        <App />
      </PositionProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
