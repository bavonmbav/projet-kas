import React from "react";
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';








const DialogCommande = ({id, designation, quantity, produits}) =>{
    const [productList, setProductList] = useState(produits);
    const [editProduct, setEditProduct] = useState(null); // Ajoutez cette ligne pour définir l'état editProduct
    const [open, setOpen] = useState(false);

    // Fonction pour fermer le dialogue
    const handleClose = () => {
        setOpen(false);
        setEditProduct(null);
    };

    const des = [{idi: id, design:designation, qaunt:quantity}];
   

    // Fonction pour sauvegarder les modifications
    const handleSave = () => {
        const updatedProductList = productList.map(produit =>
            produit.idi === editProduct.idi ? editProduct : produit
        );
        setProductList(updatedProductList);
        handleClose();
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditProduct({ ...editProduct, [name]: value });
    };
     return(
        <>
         <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Commander</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Désignation"
                        name="designation"
                        value={editProduct.design}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Quantité"
                        name="quantity"
                        value={editProduct.qaunt}
                        onChange={handleChange}
                        fullWidth
                    />
                   
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="warning">
                        Annuler
                    </Button>
                    <Button onClick={handleSave} color="success">
                        Sauvegarder
                    </Button>
                </DialogActions>
            </Dialog>
        </>
     )
}
export default DialogCommande;