import React from "react";
import { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Snackbar, Alert, Typography, Box} from '@mui/material';
import { supabase } from '../../../supabaseconfig';

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
        <>
            <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginRight: 30, borderRadius: 3, backgroundColor: 'rgb(255 255 255)' }}>creer une facture fournisseur</Typography>
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
                                label="Montant"
                                name="montant"
                                type="number"
                                value={facture.montant}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item>
                            <FormControl fullWidth>
                                <InputLabel id="idFournisseurLabel">Fournisseur</InputLabel>
                                <Select
                                    labelId="idFournisseurLabel"
                                    id="fournisseur"
                                    name="fournisseur_id"
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
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                label="Avance"
                                name="avance"
                                type="number"
                                value={facture.avance}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                label="Date de Facture"
                                name="datefacture"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={facture.datefacture}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                label="Date d'Échéance"
                                name="dateecheance"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={facture.dateecheance}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item>
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
        </>
    );
}

export default Facturefournisseur;
