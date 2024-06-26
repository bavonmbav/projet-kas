import { Box } from '@mui/joy';
import Navbar from './Components/navbar/Navbar'
import Navigator from './Components/navbar/Navigator';
import NavigatorInput from './Components/navbar/NavigatorInput';
import PrimarySearchAppBar from './Components/popup/Dialog-commande';
import { BrowserRouter} from 'react-router-dom';
import Home from './pages/Home';
function App() {
  return (
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
}

export default App
