import Main from './Main.js';
import './App.css';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar variant="dense">
        <Box sx={{ flexGrow: 0.5 }} />
          <Typography variant="h5" color="inherit" component="div">
            SENTIMENT ANLYSER
          </Typography>
        </Toolbar>
      </AppBar>
      <Main/>
    </ThemeProvider>
    // <Box sx={{ flexGrow: 1 }}>
    // </Box>
  );
}

export default App;
