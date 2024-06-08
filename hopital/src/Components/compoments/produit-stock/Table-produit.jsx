import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';
import { supabase } from '../../../supabaseconfig';

import { orderBy } from 'lodash';

const ProduitsTable = ({ produits }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderByField, setOrderByField] = useState('');
    const [order, setOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
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
        setPage(0); // Reset page when searching
    };

    // Fonction pour filtrer les produits en fonction du terme de recherche
    const filteredProduits = fournisseurs ? fournisseurs.filter(produit =>
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
                }} sx={{ m: 3 }}
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell >ID Produit</TableCell>
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
                        <TableRow key={produit.id}>
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
                                    <IconButton aria-label="View" color="info">
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                    <IconButton aria-label="Edit" color="success">
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete" >
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
                count={produits ? produits.length : fournisseurs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
};

export default ProduitsTable;
