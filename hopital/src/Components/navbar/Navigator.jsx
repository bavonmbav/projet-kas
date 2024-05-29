import React from "react";
import { Routes, Route } from "react-router-dom";
import Addmedicament from "../compoments/produit-stock/Add-medicament";
import ProduitsTable from "../compoments/produit-stock/Table-produit";
import Tablecommande from "../compoments/produit-stock/Table-commande";
import Tablehistorique from "../compoments/produit-stock/Historique-stock";
import TableFournisseur from "../composan/fournisseur/Table-fournisseur";
import Tablefactureclient from "../composan/facture/Table-facture-client";
import TablefactureAbonner from "../composan/facture/Table-facture-abonner";
import Reapprovision from "../compoments/operation/Reapprovisionement-produit";
import Fournisseur from "../composan/fournisseur/Add-fournisseur";
import Facturefournisseur from "../composan/fournisseur/Facture-fournisseur";


const Navigator = () =>{

    return(
        <>
            <Routes >
                <Route path="Addmedicament" element={<Addmedicament/>}/>
                <Route path="ProduitsTable" element={<ProduitsTable/>}/>
                <Route path="Tablecommande" element={<Tablecommande/>}/>
                <Route path="Tablehistorique" element={<Tablehistorique/>}/>
                <Route path="TableFournisseur" element={<TableFournisseur/>}/>
                <Route path="Tablefactureclient" element={<Tablefactureclient/>}/>
                <Route path="TablefactureAbonner" element={<TablefactureAbonner/>}/>
                <Route path="Reapprovision" element={<Reapprovision/>}/>
                <Route path="Fournisseur" element={<Fournisseur/>}/>
                <Route path="Facturefournisseur" element={<Facturefournisseur/>}/>
            </Routes>
        </>
    )
}
export default Navigator;