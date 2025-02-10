import React from "react";
import ReactDOM from "react-dom/client";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./styles/main.scss";

const client = new Client({
  url: "https://rickandmortyapi.com/graphql",
  exchanges: [cacheExchange, fetchExchange],
  requestPolicy: 'cache-and-network',
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider value={client}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
