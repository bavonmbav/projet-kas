import React from "react";
import {List, ListItem, ListItemButton, ListItemContent } from '@mui/joy';
import { NavLink } from "react-router-dom";

const styles = {
    list:{
        padding: "auto",
        textDecoration: "none",
        display: "block",
        textAlign: "left",
        color:"black"
    }
}

const MenuFacture = () => {
    return(
        <>                           
            <List>
                <ListItem>
                <ListItemButton>
                    <ListItemContent>
                        <NavLink to={"/Tablefactureclient"} style={styles.list}>Ajouter </NavLink>
                    </ListItemContent>
                </ListItemButton>
                </ListItem>
                <ListItem>
                <ListItemButton>
                    <ListItemContent>
                    <NavLink to={"/TablefactureAbonner"} style={styles.list}>Facture</NavLink>
                    </ListItemContent>
                </ListItemButton>
                </ListItem>
                <ListItem>
                <ListItemButton>
                    <ListItemContent>
                    <NavLink to={"/TableFournisseur"} style={styles.list}>Table</NavLink>
                    </ListItemContent>
                </ListItemButton>
                </ListItem>
            </List>
        </>
    )
}
export default MenuFacture;