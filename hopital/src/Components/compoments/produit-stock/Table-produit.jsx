import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Button, DialogActions, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import { supabase } from '../../../supabaseconfig';
import { orderBy } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProduitsTable = ({ produits }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderByField, setOrderByField] = useState('');
    const [order, setOrder] = useState('asc');
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [fournisseurs, setFournisseurs] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
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
                    fournisseur_id,
                    idproduit,
                    designation,
                    stock,
                    prixAchat,
                    dateExpiration,
                    prixVente,
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
                checkExpiredProducts(data);
            }
        };
        fetchFactures();
    }, []);

    const checkExpiredProducts = (products) => {
        const today = new Date().toISOString().split('T')[0];
        const expiredProducts = products.filter(product => product.dateExpiration <= today);
        if (expiredProducts.length > 0) {
            setAlertState({
                open: true,
                severity: 'warning',
                message: `Attention ! ${expiredProducts.length} produit(s) ont atteint leur date d'expiration.`,
            });
        }
    };

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
        setPage(0); // Reset page when searching
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

    const handleViewHistory = async (clientId) => {
        try {
            const { data, error } = await supabase
                .from('produit')
                .select('fournisseur_id, idproduit, designation, prixAchat,stock, stockMini,  fournisseur: fournisseur (nom)')
                .eq('idproduit', clientId);

            if (error) {
                console.error('Erreur lors de la récupération de l\'historique des paiements:', error.message);
                alert('Erreur lors de la récupération de l\'historique des paiements.');
            } else {
                setPaymentHistory(data);
                setHistoryDialogOpen(true);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des paiements:', error.message);
            alert('Erreur lors de la récupération de l\'historique des paiements.');
        }
    };

    const handleCloseHistoryDialog = () => {
        setHistoryDialogOpen(false);
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setCurrentProduct(null);
    };

    const handleSaveEdit = async () => {
        try {
            const { idproduit, fournisseur, ...updatedProduct } = currentProduct; // Exclude fournisseur from the update
            const { data, error } = await supabase
                .from('produit')
                .update(updatedProduct)
                .eq('idproduit', idproduit);

            if (error) {
                console.error('Erreur lors de la mise à jour du produit:', error.message);
                setAlertState({
                    open: true,
                    severity: 'error',
                    message: 'Erreur lors de la mise à jour du produit!',
                });
            } else {
                setAlertState({
                    open: true,
                    severity: 'success',
                    message: 'Produit mis à jour avec succès!',
                });
                const updatedFournisseurs = fournisseurs.map((product) =>
                    product.idproduit === idproduit ? { ...product, ...updatedProduct } : product
                );
                setFournisseurs(updatedFournisseurs);
                handleCloseEditDialog();
                toast.success("Le produit a été mise a jour avec succès !");
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour du produit:', error.message);
            setAlertState({
                open: true,
                severity: 'error',
                message: 'Erreur lors de la mise à jour du produit!',
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct({ ...currentProduct, [name]: value });
    };

    const isExpired = (date) => {
        const today = new Date().toISOString().split('T')[0];
        return date <= today;
    };

    return (
        <>
            <ToastContainer />
            {alertState.open && (
                <Typography sx={{ textAlign: 'center', marginBottom: 2, color: alertState.severity === 'warning' ? 'orange' : 'red' }}>
                    {alertState.message}
                </Typography>
            )}
            <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginLeft: 2, borderRadius: 3, backgroundColor: 'rgb(255 255 255)', mt:2 }} variant="h4" component="h2" gutterBottom>
                gestionnaire des produits
            </Typography>
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
                }} sx={{ m: 1 }}
            />
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead >
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
                            <TableCell>stockage</TableCell>
                            <TableCell>Stock Mini</TableCell>
                            <TableCell>Prix d'Achat</TableCell>
                            <TableCell>Prix de Vente</TableCell>
                            <TableCell>Fournisseur</TableCell>
                            <TableCell>Date d'Expiration</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedProduits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produit) => (
                            <TableRow key={produit.idproduit} style={{ backgroundColor: isExpired(produit.dateExpiration) ? 'rgba(255, 0, 0, 0.1)' : 'inherit' }}>
                                <TableCell>{produit.idproduit}</TableCell>
                                <TableCell>{produit.designation}</TableCell>
                                <TableCell>{produit.stock}</TableCell>
                                <TableCell>{produit.stockMini}</TableCell>
                                <TableCell>{produit.prixAchat}</TableCell>
                                <TableCell>{produit.prixVente}</TableCell>
                                <TableCell>{produit.fournisseur.nom}</TableCell>
                                <TableCell>{produit.dateExpiration}</TableCell>
                                <TableCell>
                                    <Tooltip title="View">
                                        <IconButton aria-label="View" color="info" onClick={() => handleViewHistory(produit.idproduit)} disabled={isExpired(produit.dateExpiration)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <IconButton aria-label="Edit" color="success" onClick={() => handleEdit(produit)} disabled={isExpired(produit.dateExpiration)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={produits ? produits.length : fournisseurs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Dialog open={historyDialogOpen} onClose={handleCloseHistoryDialog}>
                <DialogTitle>Historique des produit</DialogTitle>
                <DialogContent>
                    <List>
                        {paymentHistory.map((payment, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`Nom fournisseur: ${payment.fournisseur.nom}`}
                                    secondary={`ID produit: ${payment.idproduit} - Designation: ${payment.designation} Prix achat: ${payment.prixAchat} Stock: ${payment.stock} StockMin: ${payment.stockMini}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseHistoryDialog} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
                <DialogTitle>Modifier le produit</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="designation"
                        label="Désignation"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={currentProduct?.designation || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="stock"
                        label="Stock"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={currentProduct?.stock || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="stockMini"
                        label="Stock Mini"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={currentProduct?.stockMini || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="prixAchat"
                        label="Prix d'Achat"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={currentProduct?.prixAchat || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="prixVente"
                        label="Prix de Vente"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={currentProduct?.prixVente || ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="dateExpiration"
                        label="Date d'Expiration"
                        type="date"
                        fullWidth
                        variant="standard"
                        value={currentProduct?.dateExpiration || ''}
                        onChange={handleInputChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleSaveEdit} color="primary">
                        Sauvegarder
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProduitsTable;
