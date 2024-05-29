import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import ReactToPrint from 'react-to-print'; // Importez ReactToPrint
import Tooltip from '@mui/material/Tooltip';

import { orderBy } from 'lodash';

const Tablecommande = ({ produits }) => {
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
        { id: 1, designation: 'Produit A', quantity: 10,fournisseur: 'Fournisseur A', dateExpiration: '2024-06-30' },
        { id: 2, designation: 'Produit B', quantity: 20,fournisseur: 'Fournisseur B', dateExpiration: '2024-07-15' },
        { id: 3, designation: 'Produit C', quantity: 15,fournisseur: 'Fournisseur C', dateExpiration: '2024-08-20' },
        { id: 4, designation: 'Produit D', quantity: 5, fournisseur: 'Fournisseur A', dateExpiration: '2024-07-10' },
        { id: 5, designation: 'Produit A', quantity: 10,fournisseur: 'Fournisseur A', dateExpiration: '2024-06-30' },
        { id: 6, designation: 'Produit B', quantity: 20,fournisseur: 'Fournisseur B', dateExpiration: '2024-07-15' },
        { id: 7, designation: 'Produit C', quantity: 15,fournisseur: 'Fournisseur C', dateExpiration: '2024-08-20' },
        { id: 8, designation: 'Produit D', quantity: 5,fournisseur: 'Fournisseur A', dateExpiration: '2024-07-10' },
        { id: 9, designation: 'Produit E', quantity: 25,fournisseur: 'Fournisseur B', dateExpiration: '2024-09-05' }
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
                        <TableCell>ID Produit</TableCell>
                        <TableCell>
                            <IconButton onClick={() => handleSort('designation')}>
                                Désignation
                                {orderByField === 'designation' && (
                                    order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                                )}
                            </IconButton>
                        </TableCell>
                        <TableCell>quantity</TableCell>
                       
                        <TableCell>Fournisseur</TableCell>
                        <TableCell>Date commande</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedProduits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((produit) => (
                        <TableRow key={produit.id}>
                            <TableCell>{produit.id}</TableCell>
                            <TableCell>{produit.designation}</TableCell>
                            <TableCell>{produit.quantity}</TableCell>
                            
                            <TableCell>{produit.fournisseur}</TableCell>
                            <TableCell>{produit.dateExpiration}</TableCell>
                            <TableCell>
                                    
                                        <ReactToPrint
                                            trigger={() => (
                                                <Tooltip title="Print">
                                                <IconButton aria-label="Print" color="info">
                                                    <PrintIcon />
                                                </IconButton>
                                                </Tooltip> 
                                            )}
                                            content={() => this.componentRef}
                                        />
                                   
                                 <Tooltip title="Edit">   
                                    <IconButton aria-label="Edit" color="success">
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip> 

                                <Tooltip title="Delete">
                                    <IconButton aria-label="Delete" color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip> 

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

export default Tablecommande;
