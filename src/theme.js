import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
import { deepOrange, cyan, orange } from '@mui/material/colors';

const theme = extendTheme({

 
  colorSchemes: {
    light: {
      palette: {
        primary:{
          main: '#44612d',      // 🌟 màu chính
          light: '#1A5EFF',
          dark: '#072d6a',
        },
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
        spacing: (factor) => `${0.25 * factor}rem`,
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
      shadows: [],  spacing: (factor) => `${0.25 * factor}rem`,
    },
  },

  shape: {
    borderRadius: 12,
  },
});

export default theme;