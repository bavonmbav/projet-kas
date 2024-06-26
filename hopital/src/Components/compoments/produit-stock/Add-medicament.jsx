import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Typography, Snackbar, Alert, Container, Paper } from '@mui/material';
import { supabase } from '../../../supabaseconfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { motion } from 'framer-motion';
import '../../../assets/TextAnimation.css'
const Addmedicament = () => {
    const [formState, setFormState] = useState({
        prixAchat: '',
        idproduit: '',
        designation: '',
        prixVente: '',
        stockMini: '',
        dateExpiration: '',
        fournisseur_id: '',
    });

    const [fournisseurs, setFournisseurs] = useState([]);

    const [alertState, setAlertState] = useState({
        open: false,
        severity: '',
        message: '',
    });

    useEffect(() => {
        const fetchFournisseurs = async () => {
            const { data, error } = await supabase
                .from('fournisseur')
                .select('id, nom');

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setFournisseurs(data);
            }
        };

        fetchFournisseurs();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { error } = await supabase
            .from('produit')
            .insert([formState]);

        if (error) {
            console.error('Error inserting data:', error);
            setAlertState({
                open: true,
                severity: 'error',
                message: 'Erreur lors de l\'ajout du produit!',
            });
        } else {
            setAlertState({
                open: true,
                severity: 'success',
                message: 'Produit ajouté avec succès!',
            });
            setFormState({
                prixAchat: '',
                idproduit: '',
                designation: '',
                prixVente: '',
                stockMini: '',
                dateExpiration: '',
                fournisseur_id: '',
            });

            toast.success("Le produit a été enregistrée avec succès !");
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    return (

        <Container>
            <ToastContainer />
            <Paper sx={{ p: 2, mt: 1 }}>
                <Typography sx={{ textTransform: 'uppercase', borderRadius: 3,textAlign:'center',  mt: 1 }} className="animated-text">ajoute un produit</Typography>
              
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        name="prixAchat"
                        label="Prix d'achat"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={formState.prixAchat}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        name="idproduit"
                        label="ID Produit"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={formState.idproduit}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        name="designation"
                        label="Désignation"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={formState.designation}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        name="prixVente"
                        label="Prix de vente"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={formState.prixVente}
                        onChange={handleInputChange}
                    />


                    <TextField
                        fullWidth
                        name="stockMini"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        label="Stock minimum"
                        value={formState.stockMini}
                        onChange={handleInputChange}
                    />


                    <TextField
                        fullWidth
                        name="dateExpiration"
                        label="Date d'expiration"
                        type="date"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={formState.dateExpiration}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleInputChange}
                    />


                    <FormControl fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}>
                        <InputLabel id="fournisseur_idLabel">Fournisseur</InputLabel>
                        <Select
                            labelId="fournisseur_idLabel"
                            name="fournisseur_id"
                            value={formState.fournisseur_id || ''}
                            onChange={handleInputChange}
                            label="Fournisseur"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {fournisseurs.map((fournisseur) => (
                                <MenuItem key={fournisseur.id} value={fournisseur.id}>
                                    {fournisseur.nom}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary">Soumettre</Button>
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

export default Addmedicament;
