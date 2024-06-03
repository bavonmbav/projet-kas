import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Table, TableBody, TableCell, Grid, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import { orderBy } from 'lodash';
import axios from 'axios';

const TableFournisseur = ({ produits }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderByField, setOrderByField] = useState('');
    const [order, setOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [fournisseurs, setFournisseurs] = useState([]);
    const [editFournisseur, setEditFournisseur] = useState(null); // Ajoutez cette ligne pour définir l'état editProduct
    const [open, setOpen] = useState(false);
    const [alertState, setAlertState] = useState({
        open: false,
        severity: '',
        message: '',
    });

    useEffect(() => {
        // Appeler l'API pour récupérer les fournisseurs
        axios.get('http://localhost:8081/api/fournisseurs')
            .then(response => {
                setFournisseurs(response.data);
            })
            .catch(error => {
                console.error('Il y a eu une erreur!', error);
            });
    }, [editFournisseur]);


    // Fonction de gestion de l'édition
    const handleEdit = (product) => {
        setEditFournisseur(product); // Définissez le produit en cours d'édition
        setOpen(true); // Ouvrez le dialogue
    };
    // Fonction pour fermer le dialogue
    const handleClose = () => {
        setOpen(false);
        setEditFournisseur(null);
    };


    const handleCloses = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState({ ...alertState, open: false });
    };
    // Fonction pour sauvegarder les modifications
    const handleSave = () => {
        // Envoyer une requête de mise à jour à votre backend
        axios.put(`http://localhost:8081/api/fournisseurs/${editFournisseur.idfourniseur}`, editFournisseur)
            .then(response => {
                // Mettre à jour l'état des fournisseurs ou gérer la réponse en conséquence
                console.log('Fournisseur mis à jour avec succès');
                setAlertState({
                    open: true,
                    severity: 'success',
                    message: 'fournisseur modifier',
                });
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour du fournisseur', error);
            });
        handleClose();
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8081/api/fournisseurs/${id}`)
            .then(response => {
                console.log('Fournisseur supprimé avec succès');
                // Supprimer l'élément de la liste locale des fournisseurs
                setFournisseurs(prevFournisseurs => prevFournisseurs.filter(fournisseur => fournisseur.id !== id));
                // Recharger les données depuis le serveur
                axios.get('http://localhost:8081/api/fournisseurs')
                    .then(response => {
                        setFournisseurs(response.data);
                    })
                    .catch(error => {
                        console.error('Erreur lors du chargement des fournisseurs après suppression', error);
                    });
            })
            .catch(error => {
                console.error('Erreur lors de la suppression du fournisseur', error);
            });
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditFournisseur({ ...editFournisseur, [name]: value });
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
                                <TableCell>{fournisseur.contact}</TableCell>
                                <TableCell>
                                    <IconButton aria-label="Edit" onClick={() => handleEdit(fournisseur)} color='primary'>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="Delete" onClick={() => handleDelete(fournisseur.idfourniseur)} color='error'>
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

            {editFournisseur && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Modifier Fournisseur</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    name="nom"
                                    label="Nom ou société"
                                    value={editFournisseur.nom}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    name="adresse"
                                    label="Adresse"
                                    value={editFournisseur.adresse}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    name="telephone"
                                    label="Contact"
                                    value={editFournisseur.telephone}
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
                        <Button onClick={handleSave} color="success">
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
