import React from "react";
import { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Snackbar, Alert, Typography, Box, Container, Paper } from '@mui/material';
import { supabase } from '../../../supabaseconfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Facturefournisseur = () => {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [facture, setFacture] = useState({
        fournisseur_id: '',
        montant: '',
        avance: '',
        datefacture: '',
        dateecheance: ''
    });

    const [alertState, setAlertState] = useState({
        open: false,
        severity: '',
        message: '',
    });
    useEffect(() => {
        const fetchFournisseurs = async () => {
            const { data, error } = await supabase
                .from('fournisseur')
                .select('*');

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setFournisseurs(data);
            }
        };
        fetchFournisseurs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('facturefournisseur')
            .insert([facture]);

        if (error) {
            console.error('Error inserting data:', error);
            setAlertState({
                open: true,
                severity: 'error',
                message: 'Erreur lors de l\'ajout de la facture!',
            });
        } else {
            alert('Facture ajoutée avec succès');
            setAlertState({
                open: true,
                severity: 'success',
                message: 'facture ajoutée avec succès!',
            });
            toast.success("La facture a été creer avec succès !");
            setFacture({
                fournisseur_id: '',
                montant: '',
                avance: '',
                datefacture: '',
                dateecheance: ''
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFacture({ ...facture, [name]: value });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    return (
        
            <Container>
                <Paper sx={{ p: 2, mt: 1 }}>
                    <ToastContainer />
                    <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', mt: 2 }}>creer une facture fournisseur</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Montant"
                            name="montant"
                            type="number"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            value={facture.montant}
                            onChange={handleInputChange}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="idFournisseurLabel">Fournisseur</InputLabel>
                            <Select
                                labelId="idFournisseurLabel"
                                id="fournisseur"
                                name="fournisseur_id"
                                variant="outlined"
                                sx={{ mb: 2 }}
                                value={facture.fournisseur_id}
                                onChange={handleInputChange}
                                label="Fournisseur"
                            >
                                {fournisseurs.map((fournisseur) => (
                                    <MenuItem key={fournisseur.id} value={fournisseur.id}>
                                        {fournisseur.nom}
                                    </MenuItem>
                                ))}
                                {/* <MenuItem value='5'>Ten</MenuItem> */}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Avance"
                            name="avance"
                            type="number"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            value={facture.avance}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            label="Date de Facture"
                            name="datefacture"
                            type="date"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            InputLabelProps={{ shrink: true }}
                            value={facture.datefacture}
                            onChange={handleInputChange}
                        />
                        <TextField
                            fullWidth
                            label="Date d'Échéance"
                            name="dateecheance"
                            type="date"
                            variant="outlined"
                            sx={{ mb: 2 }}
                            InputLabelProps={{ shrink: true }}
                            value={facture.dateecheance}
                            onChange={handleInputChange}
                        />
                        <Button type="submit" variant="contained"  color="primary">Soumettre</Button>
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
                </Paper>
            </Container>

      
    );
}

export default Facturefournisseur;
