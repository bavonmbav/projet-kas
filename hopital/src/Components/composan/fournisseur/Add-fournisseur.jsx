import React from "react";


import { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';


const Fournisseur = () => {
    const [formState, setFormState] = useState({
        nom: '',
        address: '',
        contact: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Ajoutez ici la logique pour soumettre le formulaire
        console.log(formState);
    };


    return(
                
<form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        name="nom"
                        label="Nom ou société"
                        value={formState.prixChat}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        name="address"
                        label="address"
                        value={formState.idProduit}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        name="contact"
                        label="Contact"
                        value={formState.designation}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">Soumettre</Button>
                </Grid>
            </Grid>
        </form>
                
                        
    )
}
export default Fournisseur;

