// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#548230",
      contrastText: "#ffffff",
      secondary:"#152331"
    },
    secondary: {
      main: "#152331",
    },
    background: {
      default: "#f9f9f9",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",       // ✅ màu chữ chính là đen
      secondary: "#fff",     // ✅ màu chữ phụ xám đậm
    },
  },

  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
  },

  shape: {
    borderRadius: 12,
  },

  spacing: (factor) => `${0.25 * factor}rem`,

  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "#444444", // text nhập vào
        },
        input: {
          color: "#444444",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#444444", // label
        },
      },
    },
  },
});

export default theme;
