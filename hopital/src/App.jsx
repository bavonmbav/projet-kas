import { Box } from '@mui/joy';
import Navbar from './Components/navbar/Navbar'
import Navigator from './Components/navbar/Navigator';
import NavigatorInput from './Components/navbar/NavigatorInput';
import PrimarySearchAppBar from './Components/popup/Dialog-commande';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ backgroundColor: 'rgb(237 242 243)', }} >
        <PrimarySearchAppBar />
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Navbar />
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: 'background.default',

            }}
          >
            <Navigator />

            <Box sx={{
              textAlign: 'center',
              marginLeft: 25,
              marginTop: 2
            }}>
              <NavigatorInput />
            </Box>

          </Box>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App
