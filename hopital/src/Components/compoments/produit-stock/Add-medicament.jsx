import React from "react";


import { useState } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';


const Addmedicament = () => {
    const [formState, setFormState] = useState({
        prixChat: '',
        idProduit: '',
        designation: '',
        prixVente: '',
        stockMini: '',
        dateExpiration: '',
        idFournisseur: '',
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
        <Box 
      
        
        sx={{ alignContent: 'center' ,}}>
                
<form onSubmit={handleSubmit}>
        <Box
        sx={{
            display: 'grid',
            columnGap: 3,
            rowGap: 1,
            gridTemplateColumns: 'repeat(2, 1fr)',
        }}
        >
            <Grid container  spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, sm: 5, md: 15 }}>
                <Grid item xs={2} md={4}>
                    <TextField
                        fullWidth
                        name="prixChat"
                        label="Prix d'achat"
                        value={formState.prixChat}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={2} md={4}>
                    <TextField
                        fullWidth
                        name="idProduit"
                        label="ID Produit"
                        value={formState.idProduit}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={2} md={4}>
                    <TextField
                        fullWidth
                        name="designation"
                        label="Désignation"
                        value={formState.designation}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        name="prixVente"
                        label="Prix de vente"
                        value={formState.prixVente}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        name="stockMini"
                        label="Stock minimum"
                        value={formState.stockMini}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        name="dateExpiration"
                        label="Date d'expiration"
                        type="date"
                        value={formState.dateExpiration}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel id="idFournisseurLabel">ID Fournisseur</InputLabel>
                        <Select
                            labelId="idFournisseurLabel"
                            name="idFournisseur"
                            value={formState.idFournisseur}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="">Sélectionner</MenuItem>
                            {/* Ajoutez ici les options de sélection des fournisseurs */}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">Soumettre</Button>
                </Grid>
            </Grid>
            </Box>
        </form>
        </Box>         
                        
    )
}
export default Addmedicament;

