import React from "react";


import { useState } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';


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


    return (
        <>
            <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginRight: 30, borderRadius: 3, backgroundColor: 'rgb(255 255 255)' }}>reapprovisionner</Typography>
            <Grid container spacing={-1}>
                <form onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            display: 'grid',
                            columnGap: 3,
                            textAlign: 'center',
                            rowGap: 3,
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            marginTop: 2,
                            borderRadius: 2,
                            p: 2,
                            borderColor: 'primary.main',
                            backgroundColor: 'rgb(255 255 255)'
                        }}
                    >

                        <Grid item >
                            <TextField
                                fullWidth
                                name="ID"
                                label="ID"
                                value={formState.ID}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="Designation"
                                label="Designation"
                                value={formState.Designation}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item >
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

                    </Box>
                </form>
            </Grid>
        </>
    )
}
export default Reapprovision;

