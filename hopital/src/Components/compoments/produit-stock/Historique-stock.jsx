import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle, Button, Chip, Snackbar, Alert } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import { BusAlert } from '@mui/icons-material';
import { supabase } from '../../../supabaseconfig';
import { orderBy } from 'lodash';

const Tablehistorique = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderByField, setOrderByField] = useState('');
    const [order, setOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [productList, setProductList] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [open, setOpen] = useState(false);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [alertState, setAlertState] = useState({
        open: false,
        severity: '',
        message: '',
    });

    useEffect(() => {
        const fetchFactures = async () => {
            const { data, error } = await supabase
                .from('produit')
                .select(`
                    id,
                    fournisseur_id,
                    idproduit,
                    designation,
                    prixAchat,
                    stock,                                    
                    stockMini,
                    fournisseur: fournisseur (nom)
                `);

            if (error) {
                console.error('Error fetching data:', error);
                setAlertState({
                    open: true,
                    severity: 'error',
                    message: 'Erreur lors de la récupération des factures!',
                });
            } else {
                setFournisseurs(data);
            }
        };
        fetchFactures();
    }, []);

    const handleSort = (field) => {
        if (orderByField === field) {
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            setOrderByField(field);
            setOrder('asc');
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditProduct(null);

    };
    const handleSave = async () => {
        if (!editProduct || !editProduct.id) {
            console.error('Invalid editProduct:', editProduct);
            // Gérer le cas où editProduct est invalide ou manque d'ID
            return;
        }

        try {
            const { data, error } = await supabase
                .from('commande')
                .insert([
                    { produit_id: editProduct.id, quantity: editProduct.quantity, fournisseur_id: editProduct.fournisseur_id }
                ]); 
                setAlertState({
                    open: true,
                    severity: 'success',
                    message: 'Commande sauvegardée avec succès!',
                });
            if (error) {
                throw error;
            }  
            handleClose();
        } catch (error) {
            console.error('Error inserting data:', error);
            setAlertState({
                open: true,
                severity: 'error',
                message: 'Erreur lors de la sauvegarde de la commande!',
            });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditProduct({ ...editProduct, [name]: value });
    };

    const filteredProduits = fournisseurs ? fournisseurs.filter(produit =>
        produit.designation.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const sortedProduits = orderBy(filteredProduits, orderByField, order);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatut = (produit) => {
        return produit.stock >= produit.stockMini ? <Chip label="disponible" color='success' /> : <Chip label="indisponible" color='error' />;
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <TextField
                    variant="outlined"
                    label="Rechercher"
                    value={searchTerm}
                    onChange={handleSearch}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }} sx={{ m: 3 }}
                />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Produit</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleSort('designation')}>
                                    Désignation
                                    {orderByField === 'designation' && (
                                        order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                                    )}
                                </IconButton>
                            </TableCell>
                            <TableCell>Stockage</TableCell>
                            <TableCell>Stock Mini</TableCell>
                            <TableCell>Prix d'Achat</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell>Commander</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedProduits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produit) => (
                            <TableRow key={produit.id}>
                                <TableCell>{produit.idproduit}</TableCell>
                                <TableCell>{produit.designation}</TableCell>
                                <TableCell>{produit.stock}</TableCell>
                                <TableCell>{produit.stockMini}</TableCell>
                                <TableCell>{produit.prixAchat}</TableCell>
                                <TableCell>{getStatut(produit)}</TableCell>
                                <TableCell>
                                    <IconButton aria-label="commande" onClick={() => handleEdit(produit)} color="primary">
                                        <BusAlert />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={fournisseurs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {editProduct && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Commander</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Désignation"
                            name="designation"
                            value={editProduct.designation}
                            onChange={handleChange}
                            fullWidth
                            disabled
                        />
                        <TextField
                            margin="dense"
                            label="Quantité"
                            name="quantity"
                            value={editProduct.quantity}
                            onChange={handleChange}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="warning">
                            Annuler
                        </Button>
                        <Button onClick={handleSave} color="success">
                            Sauvegarder
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={alertState.severity} sx={{ width: '100%' }}>
                    {alertState.message}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default Tablehistorique;
