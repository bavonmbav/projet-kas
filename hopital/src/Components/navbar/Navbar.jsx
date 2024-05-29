import React from "react";
import { Box} from '@mui/joy';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Menuproduit from "./composants/Menu-produit";
import MenuFournisseur from "./composants/Menu-Fournisseur";
import MenuFacture from "./composants/Menu-facture";
import MenuOperation from "./composants/Menu-Operation";


const Navbar = () => {

 const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


    return(
    

        <Box sx={{width: 200,height: '100vh',backgroundColor: '#69b4ff',borderRight: '1px solid',borderColor: 'divider',display: 'flex',flexDirection: 'column', }}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        >
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                           Produits
                        </Typography>
                    </AccordionSummary>      
                    <AccordionDetails>
                    <Menuproduit/>
            </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        >
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            Fournisseur
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <MenuFournisseur/>
            </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        >
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            Facture
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <MenuFacture/>
            </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        >
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            Reapprovisionner
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <MenuOperation/>
            </AccordionDetails>
        </Accordion>

     </Box>
    )
}
export default Navbar;