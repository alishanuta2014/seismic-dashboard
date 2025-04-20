import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const baseTheme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    success: {
      main: '#2e7d32',
    },
    background: {
      default: '#f9fafb',
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#e8eaf6',
      dark: '#303f9f'
    },
    secondary: {
      main: '#f50057',
      light: '#fce4ec',
      dark: '#c51162'
    },
    error: {
      main: '#f44336',
      light: '#ffebee',
      dark: '#d32f2f'
    },
    warning: {
      main: '#ff9800',
      light: '#fff3e0',
      dark: '#f57c00'
    },
    success: {
      main: '#4caf50',
      light: '#e8f5e9',
      dark: '#388e3c'
    },
    info: {
      main: '#2196f3',
      light: '#e3f2fd',
      dark: '#1976d2'
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h4: {
      fontWeight: 700,
      fontSize: '2rem'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            padding: '12px 16px',
            fontSize: '0.875rem'
          },
          '& .MuiTableCell-head': {
            fontWeight: 600,
          }
        }
      }
    }
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();