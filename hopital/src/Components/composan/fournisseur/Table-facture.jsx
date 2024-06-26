import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment, Snackbar, Alert, Typography, Box, Button, Tooltip } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PrintIcon from '@mui/icons-material/Print';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import { orderBy } from 'lodash';
import { supabase } from '../../../supabaseconfig';
import LogoMarie from '../../../assets/marie.png';
import LogoCroix from '../../../assets/croix.png';

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

    const handlePrints = (transaction) => {
        const facture = factures.find((facture) => facture.id === transaction);
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
                       
                    <p> Bon de sortie  N° ${facture.id}${formatDate(facture.datefacture)}</p>
                     <p>Date de Vente: ${new Date(facture.datefacture).toLocaleDateString()}
                    </p>
                    <hr/>
                    <p>Nom: ${facture.fournisseur.nom}</p>
                    <table>
                        <tr>
                            <th>Montant</th>
                            <th>Avance</th>
                        </tr>
                        <tr> 
                                <td>${facture.montant} FC</td>
                                <td>${facture.avance} FC</td>
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

    const handlePrintTable = () => {
        const visibleFactures = sortedFactures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                <h1>Tableaux Factures</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Montant</th>
                            <th>Avance</th>
                            <th>Date de Facture</th>
                            <th>Date d'Échéance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${visibleFactures.map(facture => `
                            <tr key=${facture.id}>
                                <td>${facture.id}</td>
                                <td>${facture.fournisseur.nom}</td>
                                <td>${facture.montant}</td>
                                <td>${facture.avance}</td>
                                <td>${new Date(facture.datefacture).toLocaleDateString()}</td>
                                <td>${new Date(facture.dateecheance).toLocaleDateString()}</td>
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
            <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginLeft: 2, borderRadius: 3, backgroundColor: 'rgb(255 255 255)', mt:2 }} variant="h4" component="h2" gutterBottom>
                   gestionnaire Factures Fournisseur
                </Typography>
                
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PrintIcon />}
                    onClick={handlePrintTable}
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
            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
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
                                    <Tooltip title="Imprimer">
                                        <IconButton aria-label="Print" onClick={() => handlePrints(facture.id)} color='secondary'>
                                            <PrintIcon />
                                        </IconButton>
                                    </Tooltip>
                                   
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
