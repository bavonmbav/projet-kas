import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid, Badge, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { ShoppingCart } from '@mui/icons-material';
import { supabase } from '../../../supabaseconfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const FactureStandard = () => {
    const [factureabonner, setFactureabonner] = useState({
        nom: '',
        adresse: '',
        idproduit: '',
        designation: '',
        prixVente: '',
        quantity: '',
    });
    const [panier, setPanier] = useState([]);
    const [inputchange, setInputchange] = useState('standard');
    const [openDialog, setOpenDialog] = useState(false);
    const [argentRemis, setArgentRemis] = useState('');
    const [reste, setReste] = useState('');
    const [clientInfo, setClientInfo] = useState({
        nom: '',
        adresse: '', // Ajoutez d'autres informations du client au besoin
    });
    const [produits, setProduits] = useState([]);

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const { data, error } = await supabase.from('produit').select('idproduit, designation, prixVente , stock');
                if (error) {
                    console.error('Error fetching products:', error);
                } else {
                    setProduits(data);
                }
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };
        fetchProduits();
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFactureabonner({ ...factureabonner, [name]: value });
    };

    const handleChangeInput = (event) => {
        setInputchange(event.target.value);
    };

    const handleAddToCart = (event) => {
        event.preventDefault();
        const productToAdd = produits.find((product) => product.idproduit === factureabonner.idproduit);
        if (!productToAdd) {
            console.error("Produit introuvable");
            return;
        }

        if (parseInt(factureabonner.quantity) > productToAdd.stock) {
            alert("Stock insuffisant. La quantité demandée n'est pas disponible en stock.");
            return;
        }

        // Ajouter le clientInfo complet au panier
        setPanier([...panier, { ...factureabonner, nom: clientInfo.nom, adresse: clientInfo.adresse }]);
        // Ne réinitialisez le nom du client que s'il n'est pas déjà défini
        if (!clientInfo.nom) {
            setClientInfo({ nom: factureabonner.nom, adresse: factureabonner.adresse });
        }
        setFactureabonner({
            nom: '',
            adresse: '',
            idproduit: '',
            designation: '',
            prixVente: '',
            quantity: '',
        });
    };

    const handleSubmit = async () => {
        const total = getTotal();
        const resteAmount = parseFloat((argentRemis - total).toFixed(2));

        const { data: transactionData, error: transactionError } = await supabase.from('transactions').insert([
            {
                nom_client: clientInfo.nom,
                produits: panier,
                total: total,
                argent_remis: argentRemis,
                reste: resteAmount,
                date_vente: new Date().toISOString(),
            }
        ]).select();

        if (transactionError) {
            console.error('Error inserting transaction:', transactionError);
            toast.error("Echec lors de la soumission !");
            return;
        }

        for (const item of panier) {
            const productToUpdate = produits.find((product) => product.idproduit === item.idproduit);
            if (!productToUpdate) {
                console.error("Produit introuvable");
                continue;
            }

            const newStock = productToUpdate.stock - item.quantity;
            await supabase
                .from('produit')
                .update({ stock: newStock })
                .eq('idproduit', item.idproduit);
        }

        setPanier([]);
        setOpenDialog(false);
        toast.success("La transaction a été enregistrée avec succès !");
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
        return panier.reduce((total, item) => total + (item.prixVente * item.quantity), 0).toFixed(2);
    };

    const handleProductSelect = (event) => {
        const selectedProductId = event.target.value;
        const selectedProduct = produits.find((product) => product.idproduit === selectedProductId);
        if (selectedProduct) {
            setFactureabonner({
                ...factureabonner,
                idproduit: selectedProduct.idproduit,
                designation: selectedProduct.designation,
                prixVente: selectedProduct.prixVente,
            });
        }
    };

    
    return (
        <Box sx={{ marginLeft: 20 }}>
            <ToastContainer />
            <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginRight: 3, borderRadius: 3, backgroundColor: 'rgb(255 255 255)', mt:2 }}>Bienvenue à la caisse :</Typography>
            <Grid item sx={{ marginLeft: 50, marginTop: 2 }} >
                <Button type="submit" variant="contained" color="inherit" onClick={handleOpenDialog}>
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
                        <Typography sx={{ color: "rgb(229 6830)", textTransform: 'uppercase' }}>Détails client</Typography>
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
                        <Typography sx={{ color: "rgb(229 68 30)", textTransform: 'uppercase' }}>Détails produits</Typography>
                        <Grid item sx={{ marginTop: 1 }}>
                            <TextField
                                select
                                fullWidth
                                name="idproduit"
                                label="ID Produit"
                                value={factureabonner.idproduit}
                                onChange={handleProductSelect}
                                required
                            >
                                {produits.map((produit) => (
                                    <MenuItem key={produit.idproduit} value={produit.idproduit}>
                                        {produit.idproduit}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                name="designation"
                                label="Désignation"
                                value={factureabonner.designation}
                                disabled
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                fullWidth
                                name="prix"
                                label="Prix de vente"
                                value={factureabonner.prixVente}
                                disabled
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
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmation de l'achat</DialogTitle>
                <DialogContent>
                    <Typography>Nom du client : {clientInfo.nom}</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Produit</TableCell>
                                <TableCell>Désignation</TableCell>
                                <TableCell>Prix de vente</TableCell>
                                <TableCell>Quantité</TableCell>
                                <TableCell>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {panier.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.idproduit}</TableCell>
                                    <TableCell>{item.designation}</TableCell>
                                    <TableCell>{item.prixVente}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{(item.prixVente * item.quantity).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <Typography>Totaux: {getTotal()} FC</Typography>
                    </Table>
                    <TextField label="Argent remis" value={argentRemis} onChange={handleArgentRemisChange} fullWidth sx={{ marginTop: 2 }} />
                    <Typography sx={{ marginTop: 2 }}>Reste à rendre : {reste}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Annuler</Button>
                    <Button onClick={handleSubmit} color="primary">Confirmer</Button>
                </DialogActions>
            </Dialog>  
        </Box>
    );
};

export default FactureStandard;
