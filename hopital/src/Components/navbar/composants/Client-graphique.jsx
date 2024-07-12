import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseconfig';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const GraphiqueClient = () => {
    const [transactions, setTransactions] = useState([]);
    const [dailyTotal, setDailyTotal] = useState(0);
    const [dailyProducts, setDailyProducts] = useState(0);
    const [weeklyTotal, setWeeklyTotal] = useState(0);
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            const { data, error } = await supabase
                .from('transactions')
                .select('*');

            if (error) {
                console.error('Error fetching transactions:', error);
            } else {
                setTransactions(data);
                calculateTotals(data);
                generateChartData(data);
            }
        };

        fetchTransactions();
    }, []);
    const calculateTotals = (data) => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        let dailyTotalRemis = 0;
        let dailyTotalQuantite = 0; // Nouvelle variable pour le total des quantités vendues
        let weeklyTotalRemis = 0;
        let monthlyTotal = 0;

        data.forEach(transaction => {
            const transactionDate = new Date(transaction.date_vente);
            if (transactionDate.toDateString() === new Date().toDateString()) {
                dailyTotalRemis += parseFloat(transaction.argent_remis);

                // Parse des produits comme un tableau d'objets
                const produits = transaction.produits;
                console.log('transaction.produits:', transaction.produits);
                // Calcul du total des quantités vendues aujourd'hui
                produits.forEach(produit => {
                    dailyTotalQuantite += parseInt(produit.quantity, 10);
                });
            }
            if (transactionDate >= startOfWeek) {
                weeklyTotalRemis += parseFloat(transaction.argent_remis);
            }
            if (transactionDate >= startOfMonth) {
                monthlyTotal += parseFloat(transaction.total);
            }
        });

        setDailyTotal(dailyTotalRemis);
        console.log(dailyTotal)
        setDailyProducts(dailyTotalQuantite); // Mise à jour du state pour le total des quantités
        setWeeklyTotal(weeklyTotalRemis);
        setMonthlyTotal(monthlyTotal);
    };

    const generateChartData = (data) => {
        const monthlySales = Array(12).fill(0);
        const yearlySales = {};

        data.forEach(transaction => {
            const transactionDate = new Date(transaction.date_vente);
            const month = transactionDate.getMonth();
            const year = transactionDate.getFullYear();

            monthlySales[month] += parseFloat(transaction.total);

            if (!yearlySales[year]) {
                yearlySales[year] = 0;
            }
            yearlySales[year] += parseFloat(transaction.total);
        });

        setChartData({
            labels: Object.keys(yearlySales),
            datasets: [
                {
                    label: 'Sales by Year',
                    data: Object.values(yearlySales),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Dashboard des Transactions</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3} >
                    <Paper elevation={3} sx={{ padding: 2, backgroundColor: 'rgb(146 215 235)' }}>
                        <Typography variant="h6">Total Argent Vendu Aujourd'hui</Typography>
                        <Typography variant="h4">{dailyTotal} FC</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2, backgroundColor: 'rgb(241 44 54)'}}>
                        <Typography variant="h6">Total Produits Vendus Aujourd'hui</Typography>
                        <Typography variant="h4">{dailyProducts}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2, backgroundColor: 'rgb(29 255 13)'}}>
                        <Typography variant="h6">Total Argent Vendu cette Semaine</Typography>
                        <Typography variant="h4">{weeklyTotal.toFixed(2)} FC</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2}}>
                        <Typography variant="h6">Total Argent Vendu ce Mois</Typography>
                        <Typography variant="h4">{monthlyTotal.toFixed(2)} FC</Typography>
                    </Paper>
                </Grid>
            </Grid>
            {chartData ? (
                <Paper elevation={2} sx={{ padding: 1, marginTop: 2 }}>
                    <Bar data={chartData} />
                </Paper>
            ) : (
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>Loading chart...</Typography>
            )}
        </Container>
    );
};

export default GraphiqueClient;


// import React, { useState, useEffect } from 'react';
// import { Grid, Typography, Button} from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import { supabase } from '../../../supabaseconfig';

// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
// import { Bar } from 'react-chartjs-2';
// import 'chart.js/auto';
// import { Container,Paper} from '@mui/material';

// const Dashboard = () => {
//     const [transactions, setTransactions] = useState([]);
//     const [dailyTotal, setDailyTotal] = useState(0);
//     const [dailyProducts, setDailyProducts] = useState(0);
//     const [weeklyTotal, setWeeklyTotal] = useState(0);
//     const [monthlyTotal, setMonthlyTotal] = useState(0);
//     const [chartData, setChartData] = useState({});

//     useEffect(() => {
//         const fetchTransactions = async () => {
//             const { data, error } = await supabase
//                 .from('transactionabonner')
//                 .select('*');

//             if (error) {
//                 console.error('Error fetching transactions:', error);
//             } else {
//                 setTransactions(data);
//                 calculateTotals(data);
//                 generateChartData(data);
//             }
//         };

//         fetchTransactions();
//     }, []);

//     const calculateTotals = (data) => {
//         const today = new Date();
//         const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
//         const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//         let dailyTotal = 0;
//         let dailyProducts = 0;
//         let weeklyTotal = 0;
//         let monthlyTotal = 0;

//         data.forEach(transaction => {
//             const transactionDate = new Date(transaction.date_vente);
//             if (transactionDate.toDateString() === new Date().toDateString()) {
//                 dailyTotal += parseFloat(transaction.total);
//                 dailyProducts += JSON.parse(transaction.produits).length;
//             }
//             if (transactionDate >= startOfWeek) {
//                 weeklyTotal += parseFloat(transaction.total);
//             }
//             if (transactionDate >= startOfMonth) {
//                 monthlyTotal += parseFloat(transaction.total);
//             }
//         });

//         setDailyTotal(dailyTotal);
//         setDailyProducts(dailyProducts);
//         setWeeklyTotal(weeklyTotal);
//         setMonthlyTotal(monthlyTotal);
//     };

//     const generateChartData = (data) => {
//         const monthlySales = Array(12).fill(0);
//         const yearlySales = {};

//         data.forEach(transaction => {
//             const transactionDate = new Date(transaction.date_vente);
//             const month = transactionDate.getMonth();
//             const year = transactionDate.getFullYear();

//             monthlySales[month] += parseFloat(transaction.total);

//             if (!yearlySales[year]) {
//                 yearlySales[year] = 0;
//             }
//             yearlySales[year] += parseFloat(transaction.total);
//         });

//         setChartData({
//             labels: Object.keys(yearlySales),
//             datasets: [
//                 {
//                     label: 'Sales by Year',
//                     data: Object.values(yearlySales),
//                     backgroundColor: 'rgba(75, 192, 192, 0.6)',
//                     borderColor: 'rgba(75, 192, 192, 1)',
//                     borderWidth: 1,
//                 },
//             ],
//         });
//     };


//     useEffect(() => {
//         // Fetch data from Supabase or any other backend service
//         const fetchDashboardData = async () => {
//             // Example: Fetch produits, ventes, clients
//             const { data: produitsData, error: produitsError } = await supabase
//                 .from('produit')
//                 .select('*');

//             const { data: ventesData, error: ventesError } = await supabase
//                 .from('transactionabonner')
//                 .select('*');

//             const { data: clientsData, error: clientsError } = await supabase
//                 .from('transactionabonner')
//                 .select('*');

//             if (produitsError || ventesError || clientsError) {
//                 console.error('Error fetching data:', produitsError || ventesError || clientsError);
//                 // Handle error state
//             } else {
//                 setProduits(produitsData);
//                 setVentes(ventesData);
//                 setClients(clientsData);
//             }
//         };

//         fetchDashboardData();
//     }, []);

//     // Example function to export data to CSV
//     const exportToCSV = (csvData, fileName) => {
//         const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//         const fileExtension = '.xlsx';
//         const ws = XLSX.utils.json_to_sheet(csvData);
//         const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
//         const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//         const data = new Blob([excelBuffer], { type: fileType });
//         FileSaver.saveAs(data, fileName + fileExtension);
//     };

//     // Example function to export data to PDF
//     const exportToPDF = () => {
//         // Implement PDF export logic here
//         // Example using jsPDF library
//     };

//     return (
//         <>
//             <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                     <Typography variant="h4" component="h1" gutterBottom>
//                         Tableau de Bord
//                     </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                     <Button variant="contained" color="primary" onClick={() => exportToCSV(produits, 'produits')}>
//                         Exporter Produits vers CSV
//                     </Button>
//                     <Button variant="contained" color="primary" onClick={exportToPDF}>
//                         Exporter Ventes vers PDF
//                     </Button>
//                     {/* Add more export buttons for different data */}
//                 </Grid>
//                 <Grid item xs={12}>
//                     {/* Example DataGrid from MUI */}
//                     <DataGrid
//                         rows={produits}
//                         columns={[
//                             { field: 'id', headerName: 'ID', width: 100 },
//                             { field: 'designation', headerName: 'Désignation', width: 200 },
//                             { field: 'stock', headerName: 'Stock', width: 150 },
//                             // Add more columns as needed
//                         ]}
//                         pageSize={5}
//                         rowsPerPageOptions={[5, 10, 20]}
//                         pagination
//                         checkboxSelection
//                     />
//                 </Grid>
//             </Grid>
//             <Container>
//                 <Typography variant="h4" gutterBottom>Dashboard des Transactions</Typography>
//                 <Grid container spacing={3}>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Paper elevation={3} sx={{ padding: 2 }}>
//                             <Typography variant="h6">Total Argent Vendu Aujourd'hui</Typography>
//                             <Typography variant="h4">{dailyTotal.toFixed(2)} €</Typography>
//                         </Paper>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Paper elevation={3} sx={{ padding: 2 }}>
//                             <Typography variant="h6">Total Produits Vendus Aujourd'hui</Typography>
//                             <Typography variant="h4">{dailyProducts}</Typography>
//                         </Paper>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Paper elevation={3} sx={{ padding: 2 }}>
//                             <Typography variant="h6">Total Argent Vendu cette Semaine</Typography>
//                             <Typography variant="h4">{weeklyTotal.toFixed(2)} €</Typography>
//                         </Paper>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Paper elevation={3} sx={{ padding: 2 }}>
//                             <Typography variant="h6">Total Argent Vendu ce Mois</Typography>
//                             <Typography variant="h4">{monthlyTotal.toFixed(2)} €</Typography>
//                         </Paper>
//                     </Grid>
//                 </Grid>
//                 <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
//                     <Bar data={chartData} />
//                 </Paper>
//                 <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>Détails des Transactions

//                 </Typography>

//             </Container>
//         </>
//     );
// };

// export default Dashboard;
