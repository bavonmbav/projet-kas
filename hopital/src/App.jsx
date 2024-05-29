import { Box } from '@mui/joy';
import Navbar from './Components/navbar/Navbar'
import Navigator from './Components/navbar/Navigator';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: 'background.default',
            marginLeft:2,
           
          }}
        >
          <Box sx={{ 
              textAlign: 'center',
              textTransform: 'uppercase' ,
           }} md={3}>
          <h1>Main Content</h1>
          </Box>
          <Box sx={{alignContent: 'center' }}>
              <Navigator />
          </Box>
        </Box>
      </Box>
    </Box>
    </BrowserRouter>
  );
}

export default App
