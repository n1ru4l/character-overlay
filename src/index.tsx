import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/core"
import { Provider as UrqlProvider } from "urql";
import { createUrqlClient } from "./createUrqlClient";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";

const client = createUrqlClient();

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
    <UrqlProvider value={client}>
      <App />
    </UrqlProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
