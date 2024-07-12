import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Drawer,Divider, IconButton} from '@mui/material';
import { Menu as MenuIcons} from '@mui/icons-material';
import Navigator from '../Navigator';
import Navbar from '../Navbar';
import NavigatorInput from '../NavigatorInput';
import PrimarySearchAppBar from '../../../Components/popup/Dialog-commande';



const Dashboard = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div>
            {/* Navbar horizontale */}
            <AppBar position="static" color='inherit'>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <MenuIcons />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="animated-text">
                        Centre Médical Notre Dame de Lourdes
                    </Typography>
                    <PrimarySearchAppBar/>
                </Toolbar>
            </AppBar>

            {/* Drawer (Navbar verticale) */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}> 
                <Navbar/>
                <Divider />
                {/* Section pour d'autres liens ou informations */}
            </Drawer>
            {/* Contenu principal */}
            <Container >
                <Navigator />
                <NavigatorInput/>
            </Container>
        </div>
    );
};

export default Dashboard;
