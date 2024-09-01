import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import Spreadsheet from './components/spreadsheet';

function App() {
  return (
    <>
      <CssBaseline />
      
      <Box>
        <Spreadsheet />
      </Box>
    </>
  );
}

export default App;
