import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Typography, Snackbar, Alert } from '@mui/material';
import { supabase } from '../../../supabaseconfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

        <Box sx={{ marginLeft: 30 }}>
            <ToastContainer />
            <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginRight: 32, borderRadius: 3, backgroundColor: 'rgb(255 255 255)', mt:2 }}>ajoute un produit</Typography>
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
                        <Grid item>
                            <TextField
                                fullWidth
                                name="prixAchat"
                                label="Prix d'achat"
                                value={formState.prixAchat}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="idproduit"
                                label="ID Produit"
                                value={formState.idproduit}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="designation"
                                label="Désignation"
                                value={formState.designation}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="prixVente"
                                label="Prix de vente"
                                value={formState.prixVente}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="stockMini"
                                label="Stock minimum"
                                value={formState.stockMini}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="dateExpiration"
                                label="Date d'expiration"
                                type="date"
                                value={formState.dateExpiration}
                                InputLabelProps={{ shrink: true }}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item >
                            <FormControl fullWidth>
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
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">Soumettre</Button>
                        </Grid>
                    </Box>
                </form>
            </Grid>
            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={alertState.severity} sx={{ width: '100%' }}>
                    {alertState.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Addmedicament;
