import React from "react";
import axios from "axios";
import { useState,useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, ListItem,Snackbar, Alert } from '@mui/material';


const Facturefournisseur = () => {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [formState, setFormState] = useState({
        idFournisseur: '',
        montant: '',
        avance: '',
        dateFacture: '',
        dateEcheance: '',
    });
    const [alertState, setAlertState] = useState({
        open: false,
        severity: '',
        message: '',
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Ajoutez ici la logique pour soumettre le formulaire
        try {
            const response = await axios.post('http://localhost:8081/api/facture', formState);
            setAlertState({
                open: true,
                severity: 'success',
                message: 'facture ajouté avec succès!',
            });
            setFormState({
                    idFournisseur: '',
                    montant: '',
                    avance: '',
                    dateFacture: '',
                    dateEcheance: '',
            });
        } catch (error) {
            setAlertState({
                open: true,
                severity: 'error',
                message: 'Erreur lors de l\'ajout de la facture!',
            });
            console.error('Erreur lors de l\'ajout du fournisseur:', error);
        }

        console.log(formState);
    };

    useEffect(() => {
        // Appeler l'API pour récupérer les fournisseurs
        axios.get('http://localhost:8081/api/fournisseurs')
            .then(response => {
                setFournisseurs(response.data);
            })
            .catch(error => {
                console.error('Il y a eu une erreur!', error);
            });
    }, []);



    return(
        <>
                
<form onSubmit={handleSubmit}>
            
            <Grid container spacing={4}>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        name="montant"
                        label="Montant Facture"

                        value={formState.montant}
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
                                        {fournisseurs.map((fournisseur)=> ( 
                                            
                                            <MenuItem key={fournisseur.idFournisseur}>
                                                <ListItem value={fournisseur.nom}></ListItem>
                                            </MenuItem>)
                                        )}
                                        <MenuItem value="1">gabriel</MenuItem>
                                      
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
                        name="dateFacture"
                        label="date facturation"
                        type="date"
                        value={formState.dateFacture}
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
        <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={alertState.severity} sx={{ width: '100%' }}>
                    {alertState.message}
                </Alert>
            </Snackbar>      
     </>                   
    )
}
export default Facturefournisseur;

