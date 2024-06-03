import React from "react";
import { Box } from '@mui/joy';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Menuproduit from "./composants/Menu-produit";
import MenuFournisseur from "./composants/Menu-Fournisseur";
import MenuFacture from "./composants/Menu-facture";
import MenuOperation from "./composants/Menu-Operation";
import { Book, PeopleOutlined, LocalPharmacy, Balance, Logout } from "@mui/icons-material";
import { IconButton } from "@mui/material";


const Navbar = () => {

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    return (


        <Box sx={{ width: 200, height: '100vh', backgroundColor: 'rgb(118 196 255 / 93%)', borderRight: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column', }} >
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ backgroundColor: 'rgb(118 196 255 / 93%)', marginTop: 1 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >

                    <LocalPharmacy />
                    <Typography sx={{ width: '33%', flexShrink: 0, textTransform: 'uppercase', color: 'rgb(255 255 255 / 93%)' }}>
                        Produits
                    </Typography>



                </AccordionSummary>
                <AccordionDetails>
                    <Menuproduit />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{ backgroundColor: 'rgb(118 196 255 / 93%)', }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >

                    <PeopleOutlined />
                    <Typography sx={{ width: '33%', flexShrink: 0, textTransform: 'uppercase', color: 'rgb(255 255 255 / 93%)' }}>
                        Fournisseur
                    </Typography>

                </AccordionSummary>
                <AccordionDetails>
                    <MenuFournisseur />
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{ backgroundColor: 'rgb(118 196 255 / 93%)', }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >

                    <Book />
                    <Typography sx={{ width: '33%', flexShrink: 0, textTransform: 'uppercase', color: 'rgb(255 255 255 / 93%)' }}>
                        Facture
                    </Typography>

                </AccordionSummary>
                <AccordionDetails>
                    <MenuFacture />
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} sx={{ backgroundColor: 'rgb(118 196 255 / 93%)', }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"

                >

                    <Balance />
                    <Typography sx={{ width: '33%', flexShrink: 0, textTransform: 'uppercase', color: 'rgb(255 255 255 / 93%)' }}>
                        vente
                    </Typography>

                </AccordionSummary>
                <AccordionDetails>
                    <MenuOperation />
                </AccordionDetails>
            </Accordion>

            <IconButton aria-label="Logout" color="success" sx={{ marginTop: 18 }} >
                <Logout />
                <Typography sx={{ width: '33%', flexShrink: 0, textTransform: 'uppercase', color: 'rgb(255 255 255 / 93%)' }}>Retour</Typography>

            </IconButton>

        </Box>
    )
}
export default Navbar;