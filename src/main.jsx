import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";
import store from "./store/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
