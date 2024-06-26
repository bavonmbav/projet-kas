import React, { useState } from "react";
import { Box, TextField, Button, Grid, Snackbar, Alert, Typography, Container, Paper } from '@mui/material';
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
        <Box >
            <Container>
                <Paper sx={{ p: 2, mt: 1 }}>
                    <ToastContainer />
                    <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', mt: 2 }}>creer un fournisseur</Typography>
                    <form onSubmit={handleSubmits}>
                        <TextField
                            fullWidth
                            name="nom"
                            label="Nom ou société"
                            variant="outlined"
                            sx={{ mb: 2 }} 
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            error={!!errors.nom}
                            helperText={errors.nom}
                            required
                        />
                        <TextField
                            fullWidth
                            name="adresse"
                            label="Adresse"
                            variant="outlined"
                            sx={{ mb: 2 }} 
                            value={adresse}
                            onChange={(e) => setAdresse(e.target.value)}
                            error={!!errors.adresse}
                            helperText={errors.adresse}
                            required
                        />
                        <TextField
                            fullWidth
                            name="telephone"
                            label="Contact"
                            variant="outlined"
                            sx={{ mb: 2 }} 
                            value={telephone}
                            onChange={handleInputChange}
                            error={!!errors.telephone}
                            helperText={errors.telephone}
                            required
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
        </Box >
    );
};

export default Fournisseur;
