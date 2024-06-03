import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PrintIcon from '@mui/icons-material/Print';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';

import { orderBy } from 'lodash';

const Tablefactureclient = ({ produits }) => {
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
        { id: 1, montant: 2500, montantremis: 5000, montantrendu: 2500, numerofacture: '002-04-2024'},
        { id: 2, montant: 6000, montantremis: 10000, montantrendu: 4000, numerofacture: '003-04-2024',  },
        { id: 3, montant: 3500, montantremis: 5000, montantrendu: 1500, numerofacture: '004-04-2024',  },
        { id: 4, montant: 15000, montantremis: 20000, montantrendu: 5, numerofacture: '005-04-2024',  },
        { id: 5, montant: 30000, montantremis: 30000, montantrendu: 0, numerofacture: '006-04-2024',  },
    ];
    // Fonction pour filtrer les produits en fonction du terme de recherche
    const filteredProduits = mockProduits ? mockProduits.filter(produit =>
        produit.numerofacture.toLowerCase().includes(searchTerm.toLowerCase())
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
                }} sx={{m:3}}
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>
                            <IconButton onClick={() => handleSort('montant')}>
                            Montant
                                {orderByField === 'montant' && (
                                    order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                                )}
                            </IconButton>
                        </TableCell>
                        <TableCell>Montant remis</TableCell>
                        <TableCell>Montant rendu</TableCell>
                        <TableCell>numero facture</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedProduits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produit) => (
                        <TableRow key={produit.id}>
                            <TableCell>{produit.id}</TableCell>
                            <TableCell>{produit.montant}</TableCell>
                            <TableCell>{produit.montantremis}</TableCell>
                            <TableCell>{produit.montantrendu}</TableCell>
                            <TableCell>{produit.numerofacture}</TableCell>
                            <TableCell>
                                <IconButton aria-label="Print">
                                    <PrintIcon />
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

export default Tablefactureclient;
