import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Drawer,Divider, IconButton } from '@mui/material';
import { Menu as MenuIcon} from '@mui/icons-material';
import Navigator from '../Navigator';
import Navbar from '../Navbar';
import NavigatorInput from '../NavigatorInput';



const Dashboard = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div>
            {/* Navbar horizontale */}
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Notre dames de lourdes
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer (Navbar verticale) */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}> 
                <Navbar/>
                <Divider />
                {/* Section pour d'autres liens ou informations */}
            </Drawer>
            {/* Contenu principal */}
            <Container>
                <Navigator />
                <NavigatorInput/>
            </Container>
        </div>
    );
};

export default Dashboard;
