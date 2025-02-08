import React from "react";
import ReactDOM from "react-dom/client";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CharacterPage from "./pages/CharacterPage";
import HomePage from "./pages/HomePage";
import "./styles/main.scss";

const client = new Client({
  url: "https://rickandmortyapi.com/graphql",
  exchanges: [cacheExchange, fetchExchange],
  requestPolicy: 'cache-and-network',
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/character/:id",
    element: <CharacterPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider value={client}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
