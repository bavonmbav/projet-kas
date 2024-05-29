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

const MenuOperation = () => {
    return(
        <>                           
            <List>
                <ListItem>
                <ListItemButton>
                    <ListItemContent>
                        <NavLink to={"/Reapprovision"}  style={styles.list}>Reapprovision </NavLink>
                    </ListItemContent>
                </ListItemButton>
                </ListItem>
                <ListItem>
                <ListItemButton>
                    <ListItemContent>
                    <NavLink to={"/Reapprovision"}  style={styles.list}>Caise</NavLink>
                    </ListItemContent>
                </ListItemButton>
                </ListItem>
            </List>
        </>
    )
}
export default MenuOperation;