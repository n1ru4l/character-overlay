import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider as UrqlProvider } from "urql";
import { createUrqlClient } from "./createUrqlClient";
import { App } from "./App";

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
