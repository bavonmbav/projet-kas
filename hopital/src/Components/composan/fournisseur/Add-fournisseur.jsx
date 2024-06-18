import React, { useState } from "react";
import { Box, TextField, Button, Grid, Snackbar, Alert, Typography } from '@mui/material';
import { supabase } from '../../../supabaseconfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Fournisseur = () => {
    const [nom, setNom] = useState('');
    const [adresse, setAdresse] = useState('');
    const [telephone, setTelephone] = useState('');


    const handleSubmits = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('fournisseur')
            .insert([{ nom, adresse, telephone }]);

        if (error) {
            setAlertState({
                open: true,
                severity: 'error',
                message: 'Erreur lors de l\'ajout du fournisseur!',
            });
            console.error('Error inserting data:', error);
        } else {
            console.log('Data inserted successfully:', data);
            setAlertState({
                open: true,
                severity: 'success',
                message: 'Fournisseur ajouté avec succès!',
            });
            // Clear form fields
            setNom('');
            setAdresse('');
            setTelephone('');
            toast.success("Nouveau fournisseur a été enregistrée avec succès !");
        }
    };

    const [alertState, setAlertState] = useState({
        open: false,
        severity: '',
        message: '',
    });

    const [errors, setErrors] = useState({});


    const handleInputChange = (event) => {
        setTelephone(event.target.value);
        // Validate phone number when it's changed
        if (telephone === telephone) {
            validatePhoneNumber(telephone);
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
    //alert
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };

    return (
        <>
            <ToastContainer />
            <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginRight: 30, borderRadius: 3, backgroundColor: 'rgb(255 255 255)' }}>creer un fournisseur</Typography>

            <Grid container spacing={-1}>
                <form onSubmit={handleSubmits}>
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
                                name="nom"
                                label="Nom ou société"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                error={!!errors.nom}
                                helperText={errors.nom}
                                required
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="adresse"
                                label="Adresse"
                                value={adresse}
                                onChange={(e) => setAdresse(e.target.value)}

                                error={!!errors.adresse}
                                helperText={errors.adresse}
                                required
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="telephone"
                                label="Contact"
                                value={telephone}
                                onChange={handleInputChange}
                                error={!!errors.telephone}
                                helperText={errors.telephone}
                                required
                            />
                        </Grid>
                        <Grid item >
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
};

export default Fournisseur;
