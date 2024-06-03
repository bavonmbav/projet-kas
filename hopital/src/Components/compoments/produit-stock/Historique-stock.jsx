import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import { BusAlert } from '@mui/icons-material';

import { orderBy } from 'lodash';

const Tablehistorique = ({ produits }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderByField, setOrderByField] = useState('');
    const [order, setOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [productList, setProductList] = useState(produits);
    const [editProduct, setEditProduct] = useState(null); // Ajoutez cette ligne pour définir l'état editProduct
    const [open, setOpen] = useState(false);

   


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

    // Fonction de gestion de l'édition
    const handleEdit = (product) => {
        setEditProduct(product); // Définissez le produit en cours d'édition
        setOpen(true); // Ouvrez le dialogue
    };

    // Fonction pour fermer le dialogue
    const handleClose = () => {
        setOpen(false);
        setEditProduct(null);
    };

    // Fonction pour sauvegarder les modifications
    const handleSave = () => {
        const updatedProductList = productList.map(produit =>
            produit.id === editProduct.id ? editProduct : produit
        );
        setProductList(updatedProductList);
        handleClose();
    };

     // Fonction pour gérer les modifications de champ
     const handleChange = (event) => {
        const { name, value } = event.target;
        setEditProduct({ ...editProduct, [name]: value });
    };

    // Mock data for testing
    const mockProduits = [
        { id: 1, designation: 'Produit A', stock: 10, stockMini: 5, prixAchat: 10 },
        { id: 2, designation: 'Produit B', stock: 20, stockMini: 10, prixAchat: 15, },
        { id: 3, designation: 'Produit C', stock: 15, stockMini: 8, prixAchat: 12,  },
        { id: 4, designation: 'Produit D', stock: 5, stockMini: 2, prixAchat: 8, },
        { id: 5, designation: 'Produit A', stock: 10, stockMini: 5, prixAchat: 10, },
        { id: 6, designation: 'Produit B', stock: 20, stockMini: 10, prixAchat: 15,  },
        { id: 7, designation: 'Produit C', stock: 15, stockMini: 8, prixAchat: 12, },
        { id: 8, designation: 'Produit D', stock: 5, stockMini: 2, prixAchat: 8,  },
        { id: 9, designation: 'Produit E', stock: 25, stockMini: 12, prixAchat: 18,}
    ];
    // Fonction pour filtrer les produits en fonction du terme de recherche
    const filteredProduits = mockProduits ? mockProduits.filter(produit =>
        produit.designation.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];
    

    // Trie les produits filtrés
    const sortedProduits = orderBy(filteredProduits, orderByField, order);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                }}  sx={{m:3}}
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
                        <TableCell>stockage</TableCell>
                        <TableCell>Stock Mini</TableCell>
                        <TableCell>Prix d'Achat</TableCell>
                        <TableCell>Commander</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedProduits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produit) => (
                        <TableRow key={produit.id}>
                            <TableCell>{produit.id}</TableCell>
                            <TableCell>{produit.designation}</TableCell>
                            <TableCell>{produit.stock}</TableCell>
                            <TableCell>{produit.stockMini}</TableCell>
                            <TableCell>{produit.prixAchat}</TableCell>
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
                count={produits ? produits.length : mockProduits.length}
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

    </div>
    );
};

export default Tablehistorique;
