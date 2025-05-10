import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { teal, deepOrange, cyan, orange } from '@mui/material/colors';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange,
        background: {
          default: '#f9f9f9',
          paper: '#ffffff',
        },
        text: {
          primary: '#121212',
          secondary: '#333',
        },
      },
      typography: {
        allVariants: {
          color: '#121212',
        },
      },
      shadows: [],
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange,
        background: {
          default: '#212121',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#ccc',
        },
      },
      typography: {
        allVariants: {
          color: '#ffffff',
        },
      },
      shadows: [],
    },
  },
  typography: {
    fontFamily: `'Poppins', sans-serif`,
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;