
import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { supabase } from '../../../supabaseconfig';
import dayjs from 'dayjs';

const Dashboard = () => {
    const [totalStock, setTotalStock] = useState(0);
    const [expiredProducts, setExpiredProducts] = useState(0);
    const [daysOutOfStock, setDaysOutOfStock] = useState(0);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('produit')
                .select('*');

            if (error) {
                console.error('Erreur lors de la récupération des produits :', error);
            } else {
                calculateTotals(data);
                generateChartData(data);
            }
        };

        fetchProducts();
    }, []);

    const calculateTotals = (products) => {
        if (!products) return;

        const today = dayjs();
        let totalStock = 0;
        let expiredProducts = 0;
        let totalDaysOutOfStock = 0;

        products.forEach(product => {
            totalStock += parseFloat(product.stock);

            if (dayjs(product.dateExpiration).isBefore(today)) {
                expiredProducts += parseFloat(product.stock);
            }

            if (parseFloat(product.stock) === 0 && product.lastStockUpdate) {
                const daysOutOfStock = today.diff(dayjs(product.lastStockUpdate), 'day');
                totalDaysOutOfStock += daysOutOfStock;
            }
        });

        setTotalStock(totalStock);
        setExpiredProducts(expiredProducts);
        setDaysOutOfStock(totalDaysOutOfStock);
    };

    const generateChartData = (products) => {
        if (!products) return;

        const labels = products.map(product => product.designation);
        const stockData = products.map(product => product.stock);
        const expiredData = products.map(product => (dayjs(product.dateExpiration).isBefore(dayjs()) ? product.stock : 0));

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Stock',
                    data: stockData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Expiré',
                    data: expiredData,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Tableau de Bord</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2, backgroundColor: 'rgb(29 255 13)' }}>
                        <Typography variant="h6">Total Produits en Stock</Typography>
                        <Typography variant="h4">{totalStock}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2, backgroundColor: 'rgb(0 115 255)' }}>
                        <Typography variant="h6">Total Produits Expirés</Typography>
                        <Typography variant="h4">{expiredProducts}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6">Nombre de Jours de Rupture de Stock</Typography>
                        <Typography variant="h4">{daysOutOfStock}</Typography>
                    </Paper>
                </Grid>
            </Grid>
            <Paper elevation={3} sx={{ padding: 2, marginTop: 3 }}>
                {chartData.labels && chartData.datasets ? (
                    <Bar data={chartData} />
                ) : (
                    <Typography variant="h6">Chargement des données...</Typography>
                )}
            </Paper>
        </Container>
    );
};

export default Dashboard;
