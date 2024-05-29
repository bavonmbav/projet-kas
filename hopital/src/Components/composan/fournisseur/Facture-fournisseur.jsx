import React from "react";


import { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';


const Facturefournisseur = () => {
    const [formState, setFormState] = useState({
        idFournisseur: '',
        montantFacture: '',
        avance: '',
        datefacturation: '',
        dateEcheance: '',
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
            
            <Grid container spacing={4}>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        name="montantFacture"
                        label="Montant Facture"

                        value={formState.montantFacture}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={4} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="idFournisseurLabel">Fournisseur</InputLabel>
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
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        name="avance"
                        label="avance"
                        
                        value={formState.avance}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        name="datefacturation"
                        label="date facturation"
                        type="date"
                        value={formState.datefacturation}
                        onChange={handleInputChange}
                    />
                </Grid>
   
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        name="dateEcheance"
                        label="Date d'echeance"
                        type="date"
                        value={formState.dateEcheance}
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
export default Facturefournisseur;

