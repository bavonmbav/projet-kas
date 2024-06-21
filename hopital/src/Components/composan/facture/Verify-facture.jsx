import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../supabaseconfig';

const VerifyFacture = () => {
    const { factureId } = useParams();
    const [facture, setFacture] = useState(null);

    useEffect(() => {
        const fetchFacture = async () => {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('id', factureId)
                .single();
            if (error) console.error('Error fetching facture:', error);
            else setFacture(data);
        };
        fetchFacture();
    }, [factureId]);

    if (!facture) return <div>Loading...</div>;

    return (
        <div>
            <h1>Facture ID: {facture.id}</h1>
            <p>Nom du client: {facture.nom_client}</p>
            <p>Total: {facture.total} FC</p>
            <p>Argent remis: {facture.argent_remis} FC</p>
            <p>Reste: {facture.reste} FC</p>
            <p>Date de Vente: {new Date(facture.date_vente).toLocaleDateString()}</p>
            <table>
                <thead>
                    <tr>
                        <th>Désignation</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                    </tr>
                </thead>
                <tbody>
                    {facture.produits.map((produit) => (
                        <tr key={produit.designation}>
                            <td>{produit.designation}</td>
                            <td>{produit.quantity}</td>
                            <td>{produit.prixVente} FC</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VerifyFacture;
