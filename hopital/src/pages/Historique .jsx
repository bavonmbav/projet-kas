import { useState, useEffect } from 'react';
import { supabase } from '../supabaseconfig';

function SalesHistory() {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        const { data, error } = await supabase
            .from('transactionabonner')
            .select('*');
        if (error) console.error(error);
        else setSales(data);
    };

    return (
        <div>
            <h1>Historique des ventes</h1>
            <ul>
                {sales.produits.map((sale) => (
                    <li key={sale.id}>
                        Médicament ID: {sale.designation}, Quantité: {sale.quantity}, Date: {sale.date_vente}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SalesHistory;
