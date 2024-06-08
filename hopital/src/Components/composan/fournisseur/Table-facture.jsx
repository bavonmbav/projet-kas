import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment, Snackbar, Alert, Typography, Box, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PrintIcon from '@mui/icons-material/Print';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import { useReactToPrint } from 'react-to-print';
import { orderBy } from 'lodash';
import { supabase } from '../../../supabaseconfig';

const Tablefacture = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderByField, setOrderByField] = useState('');
    const [order, setOrder] = useState('asc');
    const [factures, setFactures] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [alertState, setAlertState] = useState({
        open: false,
        severity: '',
        message: '',
    });
    const componentRef = useRef();

    useEffect(() => {
        const fetchFactures = async () => {
            const { data, error } = await supabase
                .from('facturefournisseur')
                .select(`
                    id,
                    fournisseur_id,
                    montant,
                    avance,
                    datefacture,
                    dateecheance,
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
                setFactures(data);
            }
        };
        fetchFactures();
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState({ ...alertState, open: false });
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

    const filteredFactures = factures.filter(facture =>
        facture.fournisseur.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedFactures = orderBy(filteredFactures, orderByField, order);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Factures Fournisseur
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PrintIcon />}
                    onClick={handlePrint}
                >
                    Imprimer
                </Button>
            </Box>
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
            <TableContainer component={Paper} ref={componentRef}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleSort('fournisseur.nom')}>
                                    NOM
                                    {orderByField === 'fournisseur.nom' && (
                                        order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                                    )}
                                </IconButton>
                            </TableCell>
                            <TableCell>Montant</TableCell>
                            <TableCell>Avance</TableCell>
                            <TableCell>Date de Facture</TableCell>
                            <TableCell>Date d'Échéance</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedFactures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((facture) => (
                            <TableRow key={facture.id}>
                                <TableCell>{facture.id}</TableCell>
                                <TableCell>{facture.fournisseur.nom}</TableCell>
                                <TableCell>{facture.montant}</TableCell>
                                <TableCell>{facture.avance}</TableCell>
                                <TableCell>{facture.datefacture}</TableCell>
                                <TableCell>{facture.dateecheance}</TableCell>
                                <TableCell>
                                    <IconButton aria-label="Print" onClick={handlePrint}>
                                        <PrintIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredFactures.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={alertState.severity} sx={{ width: '100%' }}>
                    {alertState.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Tablefacture;
