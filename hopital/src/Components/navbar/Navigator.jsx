import React from "react";
import { Routes, Route } from "react-router-dom";
import ProduitsTable from "../compoments/produit-stock/Table-produit";
import Tablecommande from "../compoments/produit-stock/Table-commande";
import Tablehistorique from "../compoments/produit-stock/Historique-stock";
import TableFournisseur from "../composan/fournisseur/Table-fournisseur";
import Tablefactureclient from "../composan/facture/Table-facture-client";
import TablefactureAbonner from "../composan/facture/Table-facture-abonner";
import Tablefacture from "../composan/fournisseur/Table-facture"; 

const Navigator = () =>{

    return(
        
            <Routes >
                <Route path="ProduitsTable" element={<ProduitsTable/>}/>
                <Route path="Tablecommande" element={<Tablecommande/>}/>
                <Route path="Tablehistorique" element={<Tablehistorique/>}/>
                <Route path="TableFournisseur" element={<TableFournisseur/>}/>
                <Route path="Tablefactureclient" element={<Tablefactureclient/>}/>
                <Route path="TablefactureAbonner" element={<TablefactureAbonner/>}/>
                <Route path="Tablefacture" element={<Tablefacture/>}/>
            </Routes>
    )
}
export default Navigator;