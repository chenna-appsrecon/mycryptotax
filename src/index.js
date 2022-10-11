import React from "react";
import ReactDOM from "react-dom/client";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// This is the chainId your dApp will work on.
const activeChainId = ChainId.Rinkeby;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThirdwebProvider desiredChainId={activeChainId}>
    <App />
  </ThirdwebProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
