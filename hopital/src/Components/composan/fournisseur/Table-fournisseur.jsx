import React, { useState, } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';

import { orderBy } from 'lodash';

const TableFournisseur = ({ produits }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderByField, setOrderByField] = useState('');
    const [order, setOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');

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

    // Mock data for testing
    const mockProduits = [
        { id: 1, fournisseur: 'Produit A', address: 10, contact: 5},
        { id: 2, fournisseur: 'Produit B', address: 20, contact: 10},
        { id: 3, fournisseur: 'Produit C', address: 15, contact: 8},
        { id: 4, fournisseur: 'Produit D', address: 5, contact: 2},
        { id: 5, fournisseur: 'Produit A', address: 10, contact: 5},
        { id: 6, fournisseur: 'Produit B', address: 20, contact: 10},
        { id: 7, fournisseur: 'Produit C', address: 15, contact: 8},
        { id: 8, fournisseur: 'Produit D', address: 5, contact: 2},
        { id: 9, fournisseur: 'Produit E', address: 25, contact: 12},
    ];
    // Fonction pour filtrer les produits en fonction du terme de recherche
    const filteredProduits = mockProduits ? mockProduits.filter(produit =>
        produit.fournisseur.toLowerCase().includes(searchTerm.toLowerCase())
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
                }}
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>
                            <IconButton onClick={() => handleSort('fournisseur')}>
                                Fournisseur
                                {orderByField === 'fournisseur' && (
                                    order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                                )}
                            </IconButton>
                        </TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Contact</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedProduits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((fournisseurs) => (
                        <TableRow key={fournisseurs.id}>
                            <TableCell>{fournisseurs.id}</TableCell>
                            <TableCell>{fournisseurs.fournisseur}</TableCell>
                            <TableCell>{fournisseurs.address}</TableCell>
                            <TableCell>{fournisseurs.contact}</TableCell>
                            <TableCell>
                                <IconButton aria-label="Edit">
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="Delete">
                                    <DeleteIcon />
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
    );
};

export default TableFournisseur;
