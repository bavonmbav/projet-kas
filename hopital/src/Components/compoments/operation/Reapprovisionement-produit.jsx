import React from "react";


import { useState } from 'react';
import { TextField, Button, Grid, Box } from '@mui/material';


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
            <Box
                sx={{
                    display: 'grid',
                    columnGap: 3,
                    textAlign: 'center',
                    rowGap: 3,
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    marginTop:4
                }}
        >
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        name="ID"
                        label="ID"
                        value={formState.ID}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        name="Designation"
                        label="Designation"
                        value={formState.Designation}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        name="Quantity"
                        label="Quantity"
                        value={formState.Quantity}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">Soumettre</Button>
                </Grid>
            </Grid>
            </Box>
        </form>
                
                        
    )
}
export default Reapprovision;

