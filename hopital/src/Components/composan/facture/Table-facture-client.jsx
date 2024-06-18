import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TablePagination, TextField, InputAdornment, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PrintIcon from '@mui/icons-material/Print';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SearchIcon from '@mui/icons-material/Search';
import { orderBy } from 'lodash';
import { supabase } from '../../../supabaseconfig';
import LogoMarie from '../../../assets/marie.png';
import LogoCroix from '../../../assets/croix.png';


const Tablefactureclient = () => {
    const [factures, setFactures] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderByField, setOrderByField] = useState('');
    const [order, setOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    


    useEffect(() => {
        fetchFactures();
    }, []);

    const fetchFactures = async () => {
        const { data, error } = await supabase
            .from('transactions')
            .select('*');
        if (error) console.error('Error fetching factures:', error);
        else setFactures(data);
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
        facture.nom_client.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedFactures = orderBy(filteredFactures, [orderByField], [order]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const handlePrint = (transaction) => {
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
                    </p>
                    <hr/>
                    <p>Nom: ${facture.nom_client}</p>
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

    return (
        <>
        <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginLeft: 20, borderRadius: 3, backgroundColor: 'rgb(255 255 255)' }} variant="h4" component="h2" gutterBottom>
                   gestionnaire Factures payant cache
                </Typography>
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
                        <TableCell>ID</TableCell>
                        <TableCell>
                            <IconButton onClick={() => handleSort('total')}>
                                Montant
                                {orderByField === 'total' && (
                                    order === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                                )}
                            </IconButton>
                        </TableCell>
                        <TableCell>Nom du client</TableCell>
                        <TableCell>Argent remis</TableCell>
                        <TableCell>Reste</TableCell>
                        <TableCell>Date de Vente</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedFactures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((facture) => (
                        <TableRow key={facture.id}>
                            <TableCell>{facture.id}</TableCell>
                            <TableCell>{facture.total}</TableCell>
                            <TableCell>{facture.nom_client}</TableCell>
                            <TableCell>{facture.argent_remis}</TableCell>
                            <TableCell>{facture.reste}</TableCell>
                            <TableCell>{new Date(facture.date_vente).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <IconButton aria-label="Print" onClick={() => handlePrint(facture.id)} color='secondary'> 
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
                count={factures.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
        </>
    );
};

export default Tablefactureclient;
