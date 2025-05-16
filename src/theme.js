// src/theme.js
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { deepOrange, orange } from "@mui/material/colors";

const theme = extendTheme({
    cssVarPrefix: "mui",
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: {
          main: "#44612d", // 🌿 Xanh chủ đạo
        },
        secondary: deepOrange,
        background: {
          default: "#f9f9f9",
          paper: "#ffffff",
        },
        text: {
          primary: "#121212",
          secondary: "#4f4f4f",
        },
      },
    },
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: "#44612d", // 🌿 Giữ branding xanh
        },
        secondary: orange,
        background: {
          default: "#121212",
          paper: "#1e1e1e",
        },
        text: {
          primary: "#ffffff",
          secondary: "#aaaaaa",
        },
      },
    },
  },

  // Áp dụng style chung cho Typography
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    allVariants: {
      // ✅ Đừng override color tại đây – đã có trong palette
    },
  },

  shape: {
    borderRadius: 12,
  },

  spacing: (factor) => `${0.25 * factor}rem`,
});

export default theme;
