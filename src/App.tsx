import { ThemeProvider } from "@mui/material";
import React from "react";
import ContextProvider from "./Context";
import Homepage from "./Homepage";
import defaultTheme from "./Theme";

function App() {
  return <ThemeProvider theme={defaultTheme}>
    <ContextProvider>
      <Homepage />
    </ContextProvider>
  </ThemeProvider>;
}

export default App;
