import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid, Badge, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { ShoppingCart } from '@mui/icons-material';
import { supabase } from '../../../supabaseconfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FactureAbonner = () => {
    const [factureabonner, setFactureabonner] = useState({
        idfacture: '',
        nom: '',
        adresse: '',
        contact: '',
        idproduit: '',
        designation: '',
        prix: '',
        quantity: '',
    });
    const [panier, setPanier] = useState([]);
    const [inputchange, setInputchage] = useState('abonner');
    const [openDialog, setOpenDialog] = useState(false);
    const [argentRemis, setArgentRemis] = useState('');
    const [reste, setReste] = useState('');
    const [clientInfo, setClientInfo] = useState({ nom: '', adresse: '', contact: '' });

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

    // panier
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
        setPanier([...panier, { ...factureabonner, nom: clientInfo.nom, adresse: clientInfo.adresse, contact: clientInfo.telephone }]);
        // Ne réinitialisez le nom du client que s'il n'est pas déjà défini
        if (!clientInfo.nom) {
            setClientInfo({ nom: factureabonner.nom, adresse: factureabonner.adresse });
        }
        setFactureabonner({
            idfacture: '',
            nom: '',
            adresse: '',
            contact: '',
            idproduit: '',
            designation: '',
            prix: '',
            quantity: '',
        });
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFactureabonner({ ...factureabonner, [name]: value });
    };

    const handleChangeInput = (event) => {
        setInputchage(event.target.value);
    };

    const handleSubmit = async () => {
        const total = getTotal();
        const resteAmount = parseFloat((argentRemis - total).toFixed(2));

        const { data: transactionData, error: transactionError } = await supabase.from('transactionabonner').insert([
            {
                nom_client: clientInfo.nom,
                adresse: clientInfo.adresse,
                contact: clientInfo.telephone,
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
        <>
            <ToastContainer />
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
                                name="contact"
                                label="telephone"
                                value={factureabonner.contact}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Typography sx={{ color: "rgb(229 68 30)", textTransform: 'uppercase', marginTop: 2 }}>details produits</Typography>

                        <Grid item sx={{ marginTop: 4 }}>
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
                        <Grid item >
                            <TextField
                                fullWidth
                                name="designation"
                                label="designation"
                                value={factureabonner.designation}
                                disabled
                                required
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="prix"
                                label="Prix"
                                value={factureabonner.prixVente}
                                disabled
                                required
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="quantity"
                                label="Quantity"
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
                    <Typography>Adresse : {clientInfo.adresse}</Typography>
                    <Typography>Contact : {clientInfo.telephone}</Typography>
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
        </>
    );
};

export default FactureAbonner;
