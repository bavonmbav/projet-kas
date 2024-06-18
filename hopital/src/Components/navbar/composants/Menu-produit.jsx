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

const Menuproduit = () => {
    return (
        <>
            <List>
                <ListItem>
                    <ListItemButton>
                        <ListItemContent>
                            <NavLink to={"/Addmedicament"} style={styles.list}>Add-produit</NavLink>
                        </ListItemContent>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton>
                        <ListItemContent>
                            <NavLink to={"/ProduitsTable"} style={styles.list}>Stock</NavLink>
                        </ListItemContent>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton>
                        <ListItemContent>
                            <NavLink to={"/Tablecommande"} style={styles.list}>Table-CMD</NavLink>
                        </ListItemContent>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton>
                        <ListItemContent>
                            <NavLink to={"/Tablehistorique"} style={styles.list}>Historique</NavLink>
                        </ListItemContent>
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    )
}
export default Menuproduit;