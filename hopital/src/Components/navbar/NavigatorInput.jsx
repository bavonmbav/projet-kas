import React from "react";
import { Routes, Route } from "react-router-dom";
import Addmedicament from "../compoments/produit-stock/Add-medicament";
import Reapprovision from "../compoments/operation/Reapprovisionement-produit";
import Fournisseur from "../composan/fournisseur/Add-fournisseur";
import Facturefournisseur from "../composan/fournisseur/Facture-fournisseur";
import FactureAbonner from "../compoments/operation/Sortie-abonner";
import FactureStandard from "../compoments/operation/Sortie-client";
import { Box } from "@mui/material";


const NavigatorInput = () =>{

    return(
            <Routes >
                <Route path="Addmedicament" element={<Addmedicament/>}/>
                <Route path="Reapprovision" element={<Reapprovision/>}/>
                <Route path="Fournisseur" element={<Fournisseur/>}/>
                <Route path="Facturefournisseur" element={<Facturefournisseur/>}/>
                <Route path="FactureAbonner" element={<FactureAbonner/>}/>
                <Route path="FactureStandard" element={<FactureStandard/>}/>
            </Routes>
    )
}
export default NavigatorInput;