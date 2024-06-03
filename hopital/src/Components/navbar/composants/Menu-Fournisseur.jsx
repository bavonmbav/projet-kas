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


const MenuFournisseur = () => {
    return(
        <>                           
            <List>
                <ListItem>
                <ListItemButton>
                    <ListItemContent>
                        <NavLink to={"/Fournisseur"} style={styles.list}>Add-fournisseur </NavLink>
                    </ListItemContent>
                </ListItemButton>
                </ListItem>
                <ListItem>
                <ListItemButton>
                    <ListItemContent>
                    <NavLink to={"/Facturefournisseur"} style={styles.list}>Add-Facture</NavLink>
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
                <ListItem>
                <ListItemButton>
                    <ListItemContent>
                    <NavLink to={"/Tablefacture"} style={styles.list}>Facture F</NavLink>
                    </ListItemContent>
                </ListItemButton>
                </ListItem>
            </List>
        </>
    )
}
export default MenuFournisseur;