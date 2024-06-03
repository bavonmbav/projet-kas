import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PrintIcon from '@mui/icons-material/Print';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';

import { orderBy } from 'lodash';

const Tablefacture = ({ produits }) => {
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
        { id: 1, montant: 2500, nom: "gabriel", avance: 2500, datefacture: '002-04-2024', dateEcheance: '006-04-2024', },
        { id: 2, montant: 6000, nom: "gabriel", avance: 4000, datefacture: '003-04-2024', dateEcheance: '006-04-2024', },
        { id: 3, montant: 3500, nom: "gabriel", avance: 1500, datefacture: '004-04-2024', dateEcheance: '006-04-2024', },
        { id: 4, montant: 15000, nom: "gabriel", avance: 5, datefacture: '005-04-2024', dateEcheance: '006-04-2024', },
        { id: 5, montant: 30000, nom: "gabriel", avance: 0, datefacture: '006-04-2024', dateEcheance: '006-04-2024', },
    ];
    // Fonction pour filtrer les produits en fonction du terme de recherche
    const filteredProduits = mockProduits ? mockProduits.filter(produit =>
        produit.dateEcheance.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <IconButton onClick={() => handleSort('nom')}>
                                NOM
                                {orderByField === 'nom' && (
                                    order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                                )}
                            </IconButton>
                        </TableCell>
                        <TableCell>Montant</TableCell>
                        <TableCell>Avance</TableCell>
                        <TableCell>date de facturation</TableCell>
                        <TableCell>date d'echeance</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedProduits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produit) => (
                        <TableRow key={produit.id}>
                            <TableCell>{produit.id}</TableCell>
                            <TableCell>{produit.nom}</TableCell>
                            <TableCell>{produit.montant}</TableCell>
                            <TableCell>{produit.avance}</TableCell>
                            <TableCell>{produit.datefacture}</TableCell>
                            <TableCell>{produit.dateEcheance}</TableCell>
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

export default Tablefacture;
