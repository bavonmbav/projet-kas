import React from "react";
import { List, ListItem, ListItemButton, ListItemContent } from '@mui/joy';
import { NavLink } from "react-router-dom";

const styles = {
    list: {
        padding: "auto",
        textDecoration: "none",
        display: "block",
        textAlign: "left",
        color: "black"
    }
}

const MenuFacture = () => {
    return (
        <>
            <List>
                <ListItem>
                    <ListItemButton>
                        <ListItemContent>
                            <NavLink to={"/Tablefactureclient"} style={styles.list}>Facture-Standard</NavLink>
                        </ListItemContent>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton>
                        <ListItemContent>
                            <NavLink to={"/TablefactureAbonner"} style={styles.list}>Facture-Abonner</NavLink>
                        </ListItemContent>
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    )
}
export default MenuFacture;