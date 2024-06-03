import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Typography, Badge } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { ShoppingCart } from '@mui/icons-material';

const FactureStandard = () => {
    const [factureabonner, setFactureabonner] = useState({
        idfacture: '',
        nom: '',
        adresse: '',
        idproduit: '',
        designation: '',
        prix: '',
        quantity: '',
    });

    const [panier, setPanier] = useState([]);
    const [inputchange, setInputchage] = useState('standard');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFactureabonner({ ...factureabonner, [name]: value });
    };

    const handleChangeInput = (event) => {
        setInputchage(event.target.value);
    };

    const handleAddToCart = (event) => {
        event.preventDefault();
        setPanier([...panier, factureabonner]);
        setFactureabonner({
            idfacture: '',
            nom: '',
            adresse: '',
            idproduit: '',
            designation: '',
            prix: '',
            quantity: '',
        });
    };

    const handleSubmit = () => {
        console.log('Panier soumis:', panier);
        // Ici, vous pouvez gérer la logique de soumission, comme envoyer les données au serveur
        setPanier([]);
    };

    const getTotal = () => {
        return panier.reduce((total, item) => total + (item.prix * item.quantity), 0).toFixed(2);
    };

    return (
        <>
            <Box sx={{ borderRadius: 3, backgroundColor: 'rgb(255 255 255)', textAlign: 'center', marginBottom: 2 }}>
                <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginRight: 30 }}>Bienvenue à la caisse :</Typography>
            </Box>

            <Grid item sx={{ marginLeft: 50 }} >
                <Button type="submit" variant="contained" color="inherit">
                    <Badge badgeContent={panier.length} color="secondary">
                        <ShoppingCart />
                    </Badge>
                    Panier client
                </Button>
            </Grid>

            <Grid container spacing={-1} sx={{ marginRight: 8, marginBottom: 4 }}>
                <Typography sx={{ color: "rgb(229 68 30)", textTransform: 'uppercase', marginRight: 2 }}>Sélectionner le client :</Typography>
                <label>
                    <NavLink to={'/FactureStandard'} style={{ textDecoration: "none", color: 'black' }}>
                        Standard
                        <input
                            value="standard"
                            checked={inputchange === 'standard'}
                            onChange={handleChangeInput}
                            type='radio'
                        />
                    </NavLink>
                </label>
                <label>
                    <NavLink to={'/FactureAbonner'} style={{ textDecoration: "none", color: 'black' }}>
                        Abonner
                        <input
                            value="abonner"
                            checked={inputchange === 'abonner'}
                            onChange={handleChangeInput}
                            type='radio'
                        />
                    </NavLink>
                </label>
            </Grid>

            <Grid container spacing={-1}>
                <form onSubmit={handleAddToCart}>
                    <Box
                        sx={{
                            display: 'grid',
                            columnGap: 2,
                            textAlign: 'center',
                            rowGap: 4,
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            marginTop: 2,
                            borderRadius: 2,
                            p: 2,
                            borderColor: 'primary.main',
                            backgroundColor: 'rgb(255 255 255)'
                        }}
                    >
                        <Typography sx={{ color: "rgb(229 68 30)", textTransform: 'uppercase' }}>Détails client</Typography>
                        <Grid item>
                            <TextField
                                fullWidth
                                name="nom"
                                label="Nom de l'abonné"
                                value={factureabonner.nom}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                name="adresse"
                                label="Adresse"
                                value={factureabonner.adresse}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Typography sx={{ color: "rgb(229 68 30)", textTransform: 'uppercase', marginTop: 1 }}>Détails produits</Typography>
                        <Grid item sx={{ marginTop: 1 }}>
                            <TextField
                                fullWidth
                                name="idproduit"
                                label="ID Produit"
                                value={factureabonner.idproduit}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                name="designation"
                                label="Désignation"
                                value={factureabonner.designation}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                name="prix"
                                label="Prix de vente"
                                value={factureabonner.prix}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                name="quantity"
                                label="Quantité"
                                value={factureabonner.quantity}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">Ajouter au panier</Button>
                        </Grid>
                    </Box>
                </form>
            </Grid>

            <Grid container spacing={-1}>
                <Box
                    sx={{
                        display: 'grid',
                        columnGap: 2,
                        textAlign: 'center',
                        rowGap: 2,
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        marginTop: 2,
                        borderRadius: 2,
                        p: 2,
                        borderColor: 'primary.main',
                        backgroundColor: 'rgb(255 255 255)'
                    }}
                >
                    <Typography sx={{ color: "rgb(229 68 30)", textTransform: 'uppercase' }}>Panier</Typography>
                    {panier.map((item, index) => (
                        <Grid item key={index}>
                            <Typography> produit: {item.designation} - {item.prix} x {item.quantity} = {item.prix * item.quantity} FC</Typography>
                        </Grid>
                    ))}
                    {panier.length > 0 && (
                        <>
                            <Grid item >
                                <Typography sx={{ textTransform: 'uppercase' }}>Total: {getTotal()}€</Typography>
                            </Grid>
                            <Grid item >
                                <Button variant="contained" color="primary" onClick={handleSubmit}>Soumettre le panier</Button>
                            </Grid>
                        </>
                    )}
                </Box>
            </Grid>
        </>
    );
};

export default FactureStandard;
