import React from "react";
import { Routes, Route } from "react-router-dom";
import ProduitsTable from "../compoments/produit-stock/Table-produit";
import Tablecommande from "../compoments/produit-stock/Table-commande";
import Tablehistorique from "../compoments/produit-stock/Historique-stock";
import TableFournisseur from "../composan/fournisseur/Table-fournisseur";
import Tablefactureclient from "../composan/facture/Table-facture-client";
import TablefactureAbonner from "../composan/facture/Table-facture-abonner";
import Tablefacture from "../composan/fournisseur/Table-facture";
import VerifyFacture from "../composan/facture/Verify-facture";
import Dashboard from "./composants/Graphique";
const Navigator = () => {

    return (

        <Routes >
            <Route exact path="/" element={<Dashboard />}/>
            <Route path="ProduitsTable" element={<ProduitsTable />} />
            <Route path="Tablecommande" element={<Tablecommande />} />
            <Route path="Tablehistorique" element={<Tablehistorique />} />
            <Route path="TableFournisseur" element={<TableFournisseur />} />
            <Route path="Tablefactureclient" element={<Tablefactureclient />} />
            <Route path="TablefactureAbonner" element={<TablefactureAbonner />} />
            <Route path="Tablefacture" element={<Tablefacture />} />
            <Route path="/verify" element={<VerifyFacture />} />
        </Routes>
    )
}
export default Navigator;