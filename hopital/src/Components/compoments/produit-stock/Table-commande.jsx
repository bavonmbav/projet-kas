import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import ReactToPrint from 'react-to-print';
import Tooltip from '@mui/material/Tooltip';
import { supabase } from '../../../supabaseconfig';
import LogoMarie from '../../../assets/marie.png';
import LogoCroix from '../../../assets/croix.png';
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
    const [selectedCommande, setSelectedCommande] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editFormData, setEditFormData] = useState({
        produit_id: '',
        quantity: '',
        fournisseur_id: '',
        date_commande: ''
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
        produit.fournisseur.nom.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const sortedCommandes = orderBy(filteredProduits, orderByField, order);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('commande')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting data:', error);
                setAlertState({
                    open: true,
                    severity: 'error',
                    message: 'Erreur lors de la suppression de la commande!',
                });
            } else {
                setFournisseurs(fournisseurs.filter((commande) => commande.id !== id));
                setAlertState({
                    open: true,
                    severity: 'success',
                    message: 'Commande supprimée avec succès!',
                });
            }
        } catch (error) {
            console.error('Error deleting data:', error.message);
            setAlertState({
                open: true,
                severity: 'error',
                message: 'Erreur lors de la suppression de la commande!',
            });
        }
    };

    const handleEditClick = (commande) => {
        setSelectedCommande(commande);
        setEditFormData({
            produit_id: commande.produit_id,
            quantity: commande.quantity,
            fournisseur_id: commande.fournisseur_id,
            date_commande: commande.date_commande
        });
        setOpenDialog(true);
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setEditFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditSubmit = async () => {
        try {
            const { error } = await supabase
                .from('commande')
                .update(editFormData)
                .eq('id', selectedCommande.id);

            if (error) {
                console.error('Error updating data:', error);
                setAlertState({
                    open: true,
                    severity: 'error',
                    message: 'Erreur lors de la mise à jour de la commande!',
                });
            } else {
                const updatedFournisseurs = fournisseurs.map((commande) =>
                    commande.id === selectedCommande.id ? { ...commande, ...editFormData } : commande
                );
                setFournisseurs(updatedFournisseurs);
                setAlertState({
                    open: true,
                    severity: 'success',
                    message: 'Commande mise à jour avec succès!',
                });
                setOpenDialog(false);
                setSelectedCommande(null);
            }
        } catch (error) {
            console.error('Error updating data:', error.message);
            setAlertState({
                open: true,
                severity: 'error',
                message: 'Erreur lors de la mise à jour de la commande!',
            });
        }
    };

    //imprimer la table de facture 
    const handlePrintTable = () => {
        const visibleFactures = sortedCommandes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

        const content = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                     div{
                            display: flex;
                        }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
            <body>
            <div>
                 <img
                    src=${LogoMarie}
                         width="60px", height="auto" />
                            <p>
                                REPUBLIQUE DEMOCRATIQUE DU CONGO <br />
                                PROVINCE : HAUT-KATANGA <br />
                                ZONE DE SANTE : SAKANIA <br />
                                CENTRE MEDICAL : NOTRE DAME DE LOURDES AV. DON BOSCO <br />
                                N°08 NEW KOYO/KASUMBALESA <br />
                               
                            </p>
                          <img
                                src=${LogoCroix}
                                width="60px", height="auto" />
                    </div>
                <h1>Tableaux Commandes</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Designation</th>
                            <th>Quantity</th>
                            <th>Fournisseur</th>
                            <th>Date de Facture</th>
                           
                        </tr>
                    </thead>
                    <tbody>
                        ${visibleFactures.map(facture => `
                            <tr key=${facture.id}>
                                <td>${facture.produit.designation}</td>
                                <td>${facture.quantity}</td>
                                <td>${facture.fournisseur.nom}</td>
                                <td>${new Date(facture.date_commande).toLocaleDateString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
        `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    };

    //impression de la facture 
    const handlePrints = (transaction) => {
        const facture = fournisseurs.find((facture) => facture.id === transaction);
        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11
            const year = d.getFullYear();
            return `${day}${month}${year}`;
        };
        const content = `
                                <style>
                                body {
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    text-align: center;
                                }
                                hr {
                                    width: 80%;
                                }
                                table {
                                    margin: 20px 0;
                                }
                        th, td {
                                padding: 8px;
                            }
                        div{
                            display: flex;
                        }

                    span{
                        display: flex;
                        margin: 20px;
                    }
                        h6{
                        padding: 8px;
                        }
                    </style>
                 <body>
                 <div>
                 <img
                    src=${LogoMarie}
                         width="60px", height="auto" />
                            <p>
                                REPUBLIQUE DEMOCRATIQUE DU CONGO <br />
                                PROVINCE : HAUT-KATANGA <br />
                                ZONE DE SANTE : SAKANIA <br />
                                CENTRE MEDICAL : NOTRE DAME DE LOURDES AV. DON BOSCO <br />
                                N°08 NEW KOYO/KASUMBALESA <br />
                               
                            </p>
                          <img
                                src=${LogoCroix}
                                width="60px", height="auto" />
                    </div>
                     DIOCESE DE SAKANIA KIPUSHI
                       
                    <p> Commande de produit  N° ${facture.id}${formatDate(facture.date_commande)}</p>
                     <p>Date de Vente: ${new Date(facture.date_commande).toLocaleDateString()}
                    </p>
                    <hr/>
                    <p>Fournisseur : ${facture.fournisseur.nom}</p>
                    <table>
                        <tr>
                            <th>designation</th>
                            <th>quantity</th>
                        </tr>
                        <tr> 
                                <td>${facture.produit.designation}</td>
                                <td>${facture.quantity}  Produits demander</td>
                            </tr>                                        
                    </table>
                    <span>
                    <h6>Signature du responsable</h6>
                    <h6>Nom & Signature du fournisseur <br/>
                    ${facture.fournisseur.nom}</h6>
                    </span>
          </body> 
                    `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <>
            <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginLeft: 20, borderRadius: 3, backgroundColor: 'rgb(255 255 255)' }} variant="h4" component="h2" gutterBottom>
                table des commandes
            </Typography>

            <Button
                variant="contained"
                color="primary"
                startIcon={<PrintIcon />}
                onClick={handlePrintTable}
            >
                Imprimer
            </Button>
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
                                <TableCell>{new Date(commande.date_commande).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <ReactToPrint
                                        trigger={() => (
                                            <Tooltip title="Print">
                                                <IconButton aria-label="Print" color="info">
                                                    <PrintIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        content={() => handlePrints(commande.id)}
                                    />
                                    <Tooltip title="Edit">
                                        <IconButton aria-label="Edit" color="success" onClick={() => handleEditClick(commande)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton aria-label="Delete" color="error" onClick={() => handleDelete(commande.id)}>
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

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Modifier la commande</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Modifiez les champs nécessaires puis cliquez sur "Enregistrer" pour mettre à jour la commande.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        label="ID Produit"
                        type="text"
                        fullWidth
                        name="produit_id"
                        value={editFormData.produit_id}
                        onChange={handleEditChange}
                    />
                    <TextField
                        margin="dense"
                        label="Quantité"
                        type="text"
                        fullWidth
                        name="quantity"
                        value={editFormData.quantity}
                        onChange={handleEditChange}
                    />
                    <TextField
                        margin="dense"
                        label="ID Fournisseur"
                        type="text"
                        fullWidth
                        name="fournisseur_id"
                        value={editFormData.fournisseur_id}
                        onChange={handleEditChange}
                    />
                    <TextField
                        margin="dense"
                        label="Date Commande"
                        type="date"
                        fullWidth
                        name="date_commande"
                        value={editFormData.date_commande}
                        onChange={handleEditChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary">
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Tablecommande;
