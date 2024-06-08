import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import ReactToPrint from 'react-to-print'; // Importez ReactToPrint
import Tooltip from '@mui/material/Tooltip';
import { supabase } from '../../../supabaseconfig';

import { orderBy } from 'lodash';

const Tablecommande = () => {
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
        const fetchCommandes = async () => {
            try {
                const { data, error } = await supabase
                    .from('commande')
                    .select(`
                        id,
                        produit_id,
                        quantity,
                        fournisseur_id,
                        date_commande,
                        produit: produit(designation),
                        fournisseur: fournisseur(nom)
                    `);
                if (error) {
                    console.error('Error fetching data:', error);
                    setAlertState({
                        open: true,
                        severity: 'error',
                        message: 'Erreur lors de la récupération des commandes!',
                    });
                } else {
                    setFournisseurs(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
                setAlertState({
                    open: true,
                    severity: 'error',
                    message: 'Erreur lors de la récupération des commandes!',
                });
            }
        };
        fetchCommandes();
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

    const filteredProduits = fournisseurs ? fournisseurs.filter(produit =>
        produit.produit.designation.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const sortedCommandes = orderBy(filteredProduits, orderByField, order);

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
                        <TableCell>ID Produit</TableCell>
                        <TableCell>
                            <IconButton onClick={() => handleSort('designation')}>
                                Désignation
                                {orderByField === 'designation' && (
                                    order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                                )}
                            </IconButton>
                        </TableCell>
                        <TableCell>Quantité</TableCell>
                        <TableCell>Fournisseur</TableCell>
                        <TableCell>Date commande</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedCommandes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((commande) => (
                        <TableRow key={commande.id}>
                            <TableCell>{commande.id}</TableCell>
                            <TableCell>{commande.produit.designation}</TableCell>
                            <TableCell>{commande.quantity}</TableCell>
                            <TableCell>{commande.fournisseur.nom}</TableCell>
                            <TableCell>{commande.date_commande}</TableCell>
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
                count={fournisseurs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
};

export default Tablecommande;
