import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ShoppingCart } from '@mui/icons-material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';

import { orderBy } from 'lodash';

const TablefactureAbonner = ({ produits }) => {
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
        { id: 1, nom: 'walter', montantpayer: 5000, montantavance: 2500, resteapayer: 20, numerofacture: '002-04-2024', date: '02-04-2024' },
        { id: 2, nom: 'walter', montantpayer: 10000, montantavance: 4000, resteapayer: 20, numerofacture: '003-04-2024', date: '02-04-2024' },
        { id: 3, nom: 'walter', montantpayer: 5000, montantavance: 1500, resteapayer: 20, numerofacture: '004-04-2024', date: '02-04-2024' },
        { id: 4, nom: 'walter', montantpayer: 20000, montantavance: 5, resteapayer: 20, numerofacture: '005-04-2024', date: '02-04-2024' },
        { id: 5, nom: 'walter', montantpayer: 30000, montantavance: 0, resteapayer: 20, numerofacture: '006-04-2024', date: '02-04-2024' },
    ];
    // Fonction pour filtrer les produits en fonction du terme de recherche
    const filteredProduits = mockProduits ? mockProduits.filter(produit =>
        produit.nom.toLowerCase().includes(searchTerm.toLowerCase())
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
                }} sx={{ m: 3 }}
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>
                            <IconButton onClick={() => handleSort('nom')}>
                                Nom
                                {orderByField === 'nom' && (
                                    order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                                )}
                            </IconButton>
                        </TableCell>
                        <TableCell>Montant a payer</TableCell>
                        <TableCell>Montant avancer</TableCell>
                        <TableCell>Rest a payer</TableCell>
                        <TableCell>numero facture</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedProduits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produit) => (
                        <TableRow key={produit.id}>
                            <TableCell>{produit.id}</TableCell>
                            <TableCell>{produit.nom}</TableCell>
                            <TableCell>{produit.montantpayer}</TableCell>
                            <TableCell>{produit.montantavance}</TableCell>
                            <TableCell>{produit.resteapayer}</TableCell>
                            <TableCell>{produit.numerofacture}</TableCell>
                            <TableCell>{produit.date}</TableCell>
                            <TableCell>
                                <IconButton aria-label="Print" color="primary">
                                    <PrintIcon />
                                </IconButton>
                                <IconButton aria-label="VisibilityIcon" color="warning">
                                    <VisibilityIcon />
                                </IconButton>
                                <IconButton aria-label="addAlert" color="secondary">
                                    <ShoppingCart />
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

export default TablefactureAbonner;
