import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment, CircularProgress, Backdrop, Dialog, DialogActions, DialogContent, DialogTitle, Button, List, ListItem, ListItemText, Typography, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import { supabase } from '../../../supabaseconfig';
import LogoMarie from '../../../assets/marie.png';
import LogoCroix from '../../../assets/croix.png';
import PaymentIcon from '@mui/icons-material/Payment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCode from 'qrcode';

const Tablefactureclient = () => {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [amountPaid, setAmountPaid] = useState('');
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState([]);


    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('transactionabonner')
                .select('id, nom_client, adresse, contact, produits, total, argent_remis, reste, date_vente')
                .order('id', { ascending: true });

            if (error) {
                console.error('Error fetching transactions:', error.message);
            } else {
                setTransactions(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset page when searching
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handlePrint = async(transaction) => {
        const facture = transactions.find((facture) => facture.id === transaction);
        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11
            const year = d.getFullYear();
            return `${day}${month}${year}`;
        };
        const qrCodeData = `https://127.0.0.1:5173/TablefactureAbonner/${facture.id} ${formatDate(facture.date_vente)} ${facture.total} ${facture.nom_client} ${facture.adresse}`;
        const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
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
                       
                    <p> Facture de la pharmacie  N° ${facture.id}${formatDate(facture.date_vente)}</p>
                     <p>Date de Vente: ${new Date(facture.date_vente).toLocaleDateString()}
                      <img class="qr-code" src="${qrCodeUrl}" alt="QR Code" />
                    </p>
                    <hr/>
                    <p>Nom: ${facture.nom_client}</p>
                    <p>adresse: ${facture.adresse}</p>
                    <p>contact: ${facture.contact}</p>
                    <table>
                        <tr>
                            <th>designation</th>
                            <th>Quantité</th>
                            <th>Prix unitaire</th>
                        </tr>

                        ${facture.produits.map((produit) =>
            `<tr> 
                                <td>${produit.designation}</td>
                                <td>${produit.quantity}</td>
                                <td>${produit.prixVente} FC</td>
                            </tr>
                            `
        ).join('')}                                                              
                    </table>
                 
            <p>Total: ${facture.total} FC</p>
            <p>Argent remis: ${facture.argent_remis} FC</p>
            <p>Reste: ${facture.reste} FC</p>
          </body> 
                    `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();

    };

    // Payement
    const handleConfirm = async (transactionId) => {
        const facture = transactions.find((f) => f.id === transactionId);
        const montantRestant = facture.reste;

        const montantPaye = prompt(`Montant payé par le client (max: ${montantRestant}):`);
        if (!montantPaye || isNaN(montantPaye) || parseFloat(montantPaye) <= 0) {
            alert('Montant invalide.');
            return;
        }

        const montantPayeFloat = parseFloat(montantPaye);
        const montantRestantNouveau = montantRestant + montantPayeFloat;
        const argentRemisNouveau = facture.argent_remis + montantPayeFloat;

        try {
            // Insérer dans la table paiements
            const { data: paiementData, error: paiementError } = await supabase.from('paiements').insert([
                {
                    client_id: facture.id,
                    montant_paye: montantPayeFloat,
                    montant_restant: montantRestantNouveau,
                    date_paiement: new Date().toISOString() // Date et heure du paiement
                }
            ]);

            if (paiementError) {
                console.error('Erreur lors de l\'enregistrement du paiement partiel:', paiementError.message);
                alert('Erreur lors de l\'enregistrement du paiement partiel.');
                return;
            }

            // Mettre à jour la table transactionabonner
            const { data: updateData, error: updateError } = await supabase
                .from('transactionabonner')
                .update({
                    argent_remis: argentRemisNouveau,
                    reste: montantRestantNouveau
                })
                .eq('id', transactionId);

            if (updateError) {
                console.error('Erreur lors de la mise à jour de la transaction:', updateError.message);
                alert('Erreur lors de la mise à jour de la transaction.');
            } else {
                alert('Paiement partiel enregistré avec succès.');
                // Mettre à jour l'état local ou recharger les transactions si nécessaire
                fetchTransactions(); // Actualiser la liste des transactions après la mise à jour
            }
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du paiement partiel:', error.message);
            alert('Erreur lors de l\'enregistrement du paiement partiel.');
        }

        handleClose();
    };

    // Historique des paiements
    const handleViewHistory = async (clientId) => {
        try {
            const { data, error } = await supabase
                .from('paiements')
                .select('montant_paye, montant_restant, date_paiement')
                .eq('client_id', clientId);

            if (error) {
                console.error('Erreur lors de la récupération de l\'historique des paiements:', error.message);
                alert('Erreur lors de la récupération de l\'historique des paiements.');
            } else {
                setPaymentHistory(data);
                setHistoryDialogOpen(true);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des paiements:', error.message);
            alert('Erreur lors de la récupération de l\'historique des paiements.');
        }
    };

    const handleCloseHistoryDialog = () => {
        setHistoryDialogOpen(false);
    };

    return (
        <>
            <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginLeft: 20, borderRadius: 3, backgroundColor: 'rgb(255 255 255)' }} variant="h4" component="h2" gutterBottom>
                gestionnaire Factures Abonner
            </Typography>
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
                }} sx={{ m: 1 }}
            />
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nom du client</TableCell>
                            <TableCell>Adresse</TableCell>
                            <TableCell>Contact</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Argent remis</TableCell>
                            <TableCell>Reste</TableCell>
                            <TableCell>Date de Vente</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.id}</TableCell>
                                <TableCell>{transaction.nom_client}</TableCell>
                                <TableCell>{transaction.adresse}</TableCell>
                                <TableCell>{transaction.contact}</TableCell>
                                <TableCell>{transaction.total}</TableCell>
                                <TableCell>{transaction.argent_remis}</TableCell>
                                <TableCell>{transaction.reste}</TableCell>
                                <TableCell>{new Date(transaction.date_vente).toLocaleDateString()}</TableCell>
                                <TableCell>
                                   
                                    <Tooltip title="Imprimer">
                                        <IconButton onClick={() => handlePrint(transaction.id)} color='secondary'>
                                            <PrintIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Solder">
                                        <IconButton onClick={() => handleConfirm(transaction.id)} color='warning'>
                                            <PaymentIcon />
                                        </IconButton>
                                    </Tooltip>
                                    
                                      <Tooltip title="Detail">
                                        <IconButton onClick={() => handleViewHistory(transaction.id)} color='success'>
                                            <VisibilityIcon />
                                        </IconButton>
                                      </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={transactions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Entrer le montant payé</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="amount"
                        label="Montant Payé"
                        type="number"
                        fullWidth
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={historyDialogOpen} onClose={handleCloseHistoryDialog}>
                <DialogTitle>Historique des paiements</DialogTitle>
                <DialogContent>
                    <List>
                        {paymentHistory.map((payment, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`Montant payé: ${payment.montant_paye}`}
                                    secondary={`Montant restant: ${payment.montant_restant} - Date: ${new Date(payment.date_paiement).toLocaleString()}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseHistoryDialog} color="primary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Tablefactureclient;
