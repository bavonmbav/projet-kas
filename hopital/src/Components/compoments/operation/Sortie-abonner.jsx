import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Grid, Badge, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { ShoppingCart } from '@mui/icons-material'

const FactureAbonner = () => {
    const [factureabonner, setFactureabonner] = useState({
        idfacture: '',
        nom: '',
        adresse: '',
        telephone: '',
        idproduit: '',
        designation: '',
        prix: '',
        Quantity: '',
    });
    const [panier, setPanier] = useState([]);
    const [inputchange, setInputchage] = useState('abonner');
    const [openDialog, setOpenDialog] = useState(false);
    const [argentRemis, setArgentRemis] = useState('');
    const [reste, setReste] = useState('');
    const [clientInfo, setClientInfo] = useState({ nom: '', adresse: '', telephone: '' });

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
        setClientInfo({ nom: factureabonner.nom, adresse: factureabonner.adresse, telephone: factureabonner.telephone });
        setFactureabonner({
            idfacture: '',
            nom: '',
            adresse: '',
            telephone: '',
            idproduit: '',
            designation: '',
            prix: '',
            Quantity: '',
        });
    };

    const handleSubmit = () => {
        console.log('Panier soumis:', panier);
        setPanier([]);
        setOpenDialog(false);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setArgentRemis('');
        setReste('');
    };

    const handleArgentRemisChange = (event) => {
        const value = event.target.value;
        setArgentRemis(value);
        setReste((value - getTotal()).toFixed(2));
    };

    const getTotal = () => {
        return panier.reduce((total, item) => total + (item.prix * item.Quantity), 0).toFixed(2);
    };

    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginRight: 30, borderRadius: 3, backgroundColor: 'rgb(255 255 255)' }}>bienvenue a la caise:</Typography>

            <Grid item sx={{ marginLeft: 50, marginTop: 2 }} >
                <Button variant="contained" color="inherit" onClick={handleOpenDialog}>
                    <Badge badgeContent={panier.length} color="secondary">
                        <ShoppingCart />
                    </Badge>
                    Panier Abonner
                </Button>
            </Grid>

            <Grid container spacing={-1} sx={{ marginRight: 8, marginBottom: 2 }}>
                <Typography sx={{ color: "rgb(229 68 30)", textTransform: 'uppercase', marginRight: 2 }}>selectionner le client:</Typography>

                <label>
                    <NavLink to={'/FactureStandard'}
                        value="standard"
                        checked={inputchange === 'standard'}
                        onChange={handleChangeInput}
                        style={{ textDecoration: "none", color: 'black' }}>
                        Standard
                        <input type='radio' />
                    </NavLink>
                </label>
                <label>
                    <NavLink to={'/FactureAbonner'}
                        style={{ textDecoration: "none", color: 'black' }}>
                        Abonner
                        <input
                            value="abonner"
                            checked={inputchange === 'abonner'}
                            onChange={handleChangeInput}
                            type='radio' />
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
                        <Typography sx={{ color: "rgb(229 68 30)", textTransform: 'uppercase' }}>details client</Typography>

                        <Grid item>
                            <TextField
                                fullWidth
                                name="nom"
                                label="Nom de l'abonner"
                                value={factureabonner.nom}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="adresse"
                                label="adresse"
                                value={factureabonner.adresse}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="telephone"
                                label="telephone"
                                value={factureabonner.telephone}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Typography sx={{ color: "rgb(229 68 30)", textTransform: 'uppercase', marginTop: 2 }}>details produits</Typography>

                        <Grid item sx={{ marginTop: 4 }}>
                            <TextField
                                fullWidth
                                name="idproduit"
                                label="ID Produit"
                                value={factureabonner.idproduit}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="designation"
                                label="designation"
                                value={factureabonner.designation}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="prix"
                                label="Prix"
                                value={factureabonner.prix}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="Quantity"
                                label="Quantity"
                                value={factureabonner.Quantity}
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
                            <Typography> produit: {item.designation} - {item.prix} x {item.Quantity} = {item.prix * item.Quantity} FC</Typography>
                        </Grid>
                    ))}
                    {panier.length > 0 && (
                        <>
                            <Grid item >
                                <Typography sx={{ textTransform: 'uppercase' }}>Total: {getTotal()} FC</Typography>
                            </Grid>
                            <Grid item >
                                <Button variant="contained" color="primary" onClick={handleOpenDialog}>Soumettre le panier</Button>
                            </Grid>
                        </>
                    )}
                </Box>
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Résumé de la Facture</DialogTitle>
                <DialogContent>
                    <Typography>Nom: {clientInfo.nom}</Typography>
                    <Typography>Adresse: {clientInfo.adresse}</Typography>
                    <Typography>Téléphone: {clientInfo.telephone}</Typography>
                    <Typography>Total: {getTotal()} FC</Typography>
                    <TextField
                        label="Argent remis"
                        type="number"
                        fullWidth
                        value={argentRemis}
                        onChange={handleArgentRemisChange}
                        sx={{ mt: 2 }}
                    />
                    <Typography sx={{ mt: 2 }}>Reste: {reste} FC</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Annuler</Button>
                    <Button onClick={handleSubmit} color="primary">Confirmer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FactureAbonner;
