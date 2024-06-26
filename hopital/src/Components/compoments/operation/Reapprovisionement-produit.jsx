import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Box, Typography, MenuItem, Snackbar, Alert } from "@mui/material";
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

        <Box sx={{ marginLeft: 20 }}>
            <Typography sx={{ textTransform: "uppercase", textAlign: "center", marginRight: 3, borderRadius: 3, backgroundColor: "rgb(255 255 255)", mt:2}}>Reapprovisionner</Typography>
            <Grid container spacing={-1}>
                <form onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            display: "grid",
                            columnGap: 3,
                            textAlign: "center",
                            rowGap: 3,
                            gridTemplateColumns: "repeat(2, 1fr)",
                            marginTop: 2,
                            borderRadius: 2,
                            p: 2,
                            borderColor: "primary.main",
                            backgroundColor: "rgb(255 255 255)"
                        }}
                    >
                        <Grid item>
                            <TextField
                                select
                                fullWidth
                                name="ID"
                                label="ID"
                                value={formState.ID}
                                onChange={handleInputChange}
                            >
                                {produits.map((produit) => (
                                    <MenuItem key={produit.id} value={produit.idproduit}>
                                        {produit.idproduit}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                name="Designation"
                                label="Designation"
                                value={formState.Designation}
                                disabled
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                name="Quantity"
                                label="Quantity"
                                value={formState.Quantity}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Soumettre
                            </Button>
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
};

export default Reapprovision;
