import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Table, TableBody, TableCell, Grid, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import { orderBy } from 'lodash';
import { supabase } from '../../../supabaseconfig';

const TableFournisseur = ({ produits }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderByField, setOrderByField] = useState('');
    const [order, setOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [fournisseurs, setFournisseurs] = useState([]);
    const [currentFournisseur, setCurrentFournisseur] = useState(null); // Ajoutez cette ligne pour définir l'état editProduct
    const [open, setOpen] = useState(false);
    const [alertState, setAlertState] = useState({
        open: false,
        severity: '',
        message: '',
    });

    useEffect(() => {
        const fetchFournisseurs = async () => {
            const { data, error } = await supabase
                .from('fournisseur')
                .select('*');

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setFournisseurs(data);
            }
        };
        fetchFournisseurs();
    }, [currentFournisseur]);

  
    // Fonction pour fermer le dialogue
    const handleClose = () => {
        setOpen(false);
        setCurrentFournisseur(null);
    };
    const handleOpen = (fournisseur) => {
        setCurrentFournisseur(fournisseur);
        setOpen(true);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentFournisseur({ ...currentFournisseur, [name]: value });
    };
    const handleCloses = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };
    // delete un fournisseur
    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('fournisseur')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting data:', error);
        } else {
            setFournisseurs(fournisseurs.filter((fournisseur) => fournisseur.id !== id));
        }
    };

    // mettre a jour un fournisseur
    const handleEdit = async () => {
        const { error } = await supabase
            .from('fournisseur')
            .update(currentFournisseur)
            .eq('id', currentFournisseur.id);

        if (error) {
            console.error('Error updating data:', error);
            setAlertState({
                open: true,
                severity: 'error',
                message: 'une erreur de connexion!',
            });
        } else {
            setFournisseurs(fournisseurs.map((fournisseur) => fournisseur.id === currentFournisseur.id ? currentFournisseur : fournisseur));
            setAlertState({
                open: true,
                severity: 'success',
                message: 'modification avec succès!',
            });
            handleClose();
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



    // Fonction pour filtrer les produits en fonction du terme de recherche
    const filteredProduits = fournisseurs ? fournisseurs.filter(fournisseur =>
        fournisseur.nom.toLowerCase().includes(searchTerm.toLowerCase())
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
        <>
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
                                    Fournisseur
                                    {orderByField === 'nom' && (
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
                        {sortedProduits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((fournisseur) => (
                            <TableRow key={fournisseur.idfourniseur}>
                                <TableCell>{fournisseur.idfourniseur}</TableCell>
                                <TableCell>{fournisseur.nom}</TableCell>
                                <TableCell>{fournisseur.adresse}</TableCell>
                                <TableCell>{fournisseur.telephone}</TableCell>
                                <TableCell>
                                    <IconButton aria-label="Edit" onClick={() => handleOpen(fournisseur)} color='primary'>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="Delete" onClick={() => handleDelete(fournisseur.id)} color='error'>
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
                    count={produits ? produits.length : fournisseurs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {currentFournisseur && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Modifier Fournisseur</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    name="nom"
                                    label="Nom ou société"
                                    value={currentFournisseur?.nom || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    name="adresse"
                                    label="Adresse"
                                    value={currentFournisseur?.adresse || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    name="telephone"
                                    label="Contact"
                                    value={currentFournisseur?.telephone || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="warning">
                            Annuler
                        </Button>
                        <Button onClick={handleEdit} color="success">
                            Sauvegarder
                        </Button>
                    </DialogActions>
                </Dialog>
            )}


            <Snackbar
                open={alertState.open}
                autoHideDuration={6000}
                onClose={handleCloses}
            >
                <Alert onClose={handleCloses} severity={alertState.severity} sx={{ width: '100%' }}>
                    {alertState.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default TableFournisseur;
