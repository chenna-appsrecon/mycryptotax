import * as React from "react";

// 1. import `ChakraProvider` component

import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import Routes from "./Routes";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const theme = extendTheme({ colors });

function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider theme={theme}>
      <Routes />
    </ChakraProvider>
  );
}
export default App;
