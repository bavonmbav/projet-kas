import React, { useState,useEffect } from "react";
import axios from "axios";
import { Box, TextField, Button, Grid, Snackbar, Alert } from '@mui/material';

const Fournisseur = () => {
    const [formState, setFormState] = useState({
        idfourniseur: null,
        nom: '',
        adresse: '',
        telephone: '',
    });

    const [alertState, setAlertState] = useState({
        open: false,
        severity: '',
        message: '',
    });

    const [errors, setErrors] = useState({});
    

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });

        // Validate phone number when it's changed
        if (name === 'telephone') {
            validatePhoneNumber(value);
        }
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setErrors({ ...errors, telephone: 'Le numéro de téléphone doit commencer par 0 et contenir exactement 10 chiffres.' });
        } else {
            const { telephone, ...rest } = errors; // Remove the phone number error if it's valid
            setErrors(rest);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate phone number before submitting
        validatePhoneNumber(formState.telephone);
        if (errors.telephone) {
            setAlertState({
                open: true,
                severity: 'error',
                message: errors.telephone,
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/api/fournisseurs', formState);
            setAlertState({
                open: true,
                severity: 'success',
                message: 'Fournisseur ajouté avec succès!',
            });
            setFormState({
                nom: '',
                adresse: '',
                telephone: '',
            });
        } catch (error) {
            setAlertState({
                open: true,
                severity: 'error',
                message: 'Erreur lors de l\'ajout du fournisseur!',
            });
            console.error('Erreur lors de l\'ajout du fournisseur:', error);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    return (
        <>
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
                            name="nom"
                            label="Nom ou société"
                            value={formState.nom}
                            onChange={handleInputChange}
                            error={!!errors.nom}
                            helperText={errors.nom}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            name="adresse"
                            label="Adresse"
                            value={formState.adresse}
                            onChange={handleInputChange}
                            error={!!errors.adresse}
                            helperText={errors.adresse}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            name="telephone"
                            label="Contact"
                            value={formState.telephone}
                            onChange={handleInputChange}
                            error={!!errors.telephone}
                            helperText={errors.telephone}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">Soumettre</Button>
                    </Grid>
                </Grid>
                </Box>
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
    );
};

export default Fournisseur;
