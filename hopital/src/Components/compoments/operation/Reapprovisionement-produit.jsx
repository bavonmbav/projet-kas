import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Box, Typography, MenuItem, Snackbar, Alert, Container, Paper } from "@mui/material";
import { supabase } from '../../../supabaseconfig';

const Reapprovision = () => {
    const [formState, setFormState] = useState({
        ID: "",
        Designation: "",
        Quantity: "",
    });

    const [produits, setProduits] = useState([]);

    const [alertState, setAlertState] = useState({
        open: false,
        severity: '',
        message: '',
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };


    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const { data, error } = await supabase.from("produit").select("idproduit, designation");
                if (error) {
                    console.error("Error fetching data:", error);
                } else {
                    setProduits(data);
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };
        fetchProduits();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };

    useEffect(() => {
        const selectedProduit = produits.find((produit) => produit.idproduit === formState.ID);
        if (selectedProduit) {
            setFormState((prevState) => ({ ...prevState, Designation: selectedProduit.designation }));
        }
    }, [formState.ID, produits]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const produitToUpdate = produits.find((produit) => produit.idproduit === formState.ID);
            if (!produitToUpdate) {
                console.error("Produit introuvable");
                return;
            }

            const quantity = parseInt(formState.Quantity, 10);
            if (isNaN(quantity)) {
                console.error("La quantité saisie n'est pas valide");
                return;
            }

            const currentStock = produitToUpdate.stock || 0; // Utilisez 0 si le stock est null ou undefined
            const newStock = currentStock + quantity;

            const { data, error } = await supabase
                .from("produit")
                .update({ stock: newStock })
                .eq("idproduit", formState.ID);

            if (error) {
                console.error("Error updating stock:", error);
                setAlertState({
                    open: true,
                    severity: 'error',
                    message: 'Error updating stock:',
                });
            } else {
                console.log("Stock updated successfully:", data);
                setAlertState({
                    open: true,
                    severity: 'success',
                    message: 'Stock updated successfully',
                });
                setFormState({
                    ID: "",
                    Designation: "",
                    Quantity: "",
                });
            }
        } catch (error) {
            console.error("Error updating stock:", error.message);
        }
    };

    return (


        <Container>
            <Paper sx={{ p: 2, mt: 1 }}>
                <Typography sx={{ textTransform: "uppercase", textAlign: "center", mt: 2 }}>Reapprovisionner</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        select
                        fullWidth
                        name="ID"
                        label="ID"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={formState.ID}
                        onChange={handleInputChange}
                    >
                        {produits.map((produit) => (
                            <MenuItem key={produit.id} value={produit.idproduit}>
                                {produit.idproduit}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        name="Designation"
                        label="Designation"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={formState.Designation}
                        disabled
                    />
                    <TextField
                        fullWidth
                        name="Quantity"
                        label="Quantity"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={formState.Quantity}
                        onChange={handleInputChange}
                    />
                    <Button type="submit"  variant="contained" color="primary">
                        Soumettre
                    </Button>
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
};

export default Reapprovision;
