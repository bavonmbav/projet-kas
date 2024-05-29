import React from "react";


import { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';


const Reapprovision = () => {
    const [formState, setFormState] = useState({
        ID: '',
        Designation: '',
        Quantity: '',
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
                        value={formState.ID}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        name="address"
                        label="address"
                        value={formState.Designation}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        name="contact"
                        label="Contact"
                        value={formState.Quantity}
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
export default Reapprovision;

