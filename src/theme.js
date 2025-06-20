import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#333446',
      contrastText: '#EAEFEF',
    },
    secondary: {
      main: '#7F8CAA',
      light: '#B8CFCE',
      contrastText: '#EAEFEF',
    },
    background: {
      default: '#EAEFEF',
      paper: '#B8CFCE',
    },
    text: {
      primary: '#333446',
      secondary: '#7F8CAA',
    },
    divider: '#B8CFCE',
  },
  typography: {
    fontFamily: 'Playfair Display, Roboto, Arial, sans-serif',
    h1: { fontWeight: 900 },
    h2: { fontWeight: 900 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 700,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme; 