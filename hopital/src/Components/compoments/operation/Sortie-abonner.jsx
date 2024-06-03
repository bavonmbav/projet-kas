import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Grid, Badge } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { ShoppingCart } from '@mui/icons-material'


const FactureAbonner = () => {

    const [factureabonner, setFactureabonner] = useState({
        idfacture: '',
        nom: '',
        adresse: '',
        telephone: '',
        idproduit: '',
        designation: '',
        prix: '',
        quantity: '',
    })
    const [inputchange, setInputchage] = useState('abonner')
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFactureabonner({ ...factureabonner, [name]: value });
    };
    const handleChangeInput = (event) => {
        setInputchage(event.target.value)
    }

    return (
        <Box sx={{
            textAlign: 'center',
        }}>
            <Box sx={{ borderRadius: 3, backgroundColor: 'rgb(255 255 255)', textAlign: 'center', marginBottom: 2 }}>
                <Typography sx={{ textTransform: 'uppercase', textAlign: 'center', marginRight: 30 }}>bienvenue a la caise:</Typography>
            </Box>
            <Grid item sx={{ marginLeft: 50 }} >
                <Button type="submit" variant="contained" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                        <ShoppingCart />
                    </Badge>
                    Panier Abonner</Button>
            </Grid>
            <Grid container spacing={-1} sx={{ marginRight: 8, marginBottom: 2 }}>
                <Typography sx={{ color: "rgb(229 68 30)", textTransform: 'uppercase', marginRight: 2 }}>selectionner le client:</Typography>

                <label>
                    <NavLink to={'/FactureStandard'}
                        value="standard"
                        checked={inputchange === 'standard'}
                        onChange={handleChangeInput}
                        style={{ textDecoration: "none", color: 'black' }}>
                        Standard
                        <input type='radio' />
                    </NavLink>

                </label>
                <label>
                    <NavLink to={'/FactureAbonner'}
                        style={{ textDecoration: "none", color: 'black' }}>
                        Abonner
                        <input
                            value="abonner"
                            checked={inputchange === 'abonner'}
                            onChange={handleChangeInput}
                            type='radio' />
                    </NavLink>
                </label>
            </Grid>


            <Grid container spacing={-1}>
                <form>
                    <Box
                        sx={{
                            display: 'grid',
                            columnGap: 2,
                            textAlign: 'center',
                            rowGap: 4,
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            marginTop: 2,
                            borderRadius: 2,
                            p: 2,
                            borderColor: 'primary.main',
                            backgroundColor: 'rgb(255 255 255)'
                        }}
                    >
                        <Typography sx={{ color: "rgb(229 68 30)", textTransform: 'uppercase' }}>details client</Typography>

                        <Grid item>
                            <TextField
                                fullWidth
                                name="nom"
                                label="Nom de l'abonner"
                                value={factureabonner.nom}
                                onChange={handleInputChange}
                                required
                            >

                            </TextField>
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="adresse"
                                label="adresse"
                                value={factureabonner.adresse}
                                onChange={handleInputChange}
                                required>

                            </TextField>
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="telephone"
                                label="telephone"
                                value={factureabonner.telephone}
                                onChange={handleInputChange}
                                required>

                            </TextField>
                        </Grid>
                        <Typography sx={{ color: "rgb(229 68 30)", textTransform: 'uppercase', marginTop: 2 }}>details produits</Typography>

                        <Grid item sx={{ marginTop: 4 }}>
                            <TextField
                                fullWidth
                                name="idproduit"
                                label="ID Produit"
                                value={factureabonner.idproduit}
                                onChange={handleInputChange}
                                required>

                            </TextField>
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="designation"
                                label="designation"
                                value={factureabonner.designation}
                                onChange={handleInputChange}
                                required>

                            </TextField>
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="prix"
                                label="Prix"
                                value={factureabonner.prix}
                                onChange={handleInputChange}
                                required>

                            </TextField>
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                name="Quantity"
                                label="Quantity"
                                value={factureabonner.quantity}
                                onChange={handleInputChange}
                                required>

                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">Soumettre</Button>
                        </Grid>
                    </Box>
                </form>
            </Grid>

        </Box>
    )
}
export default FactureAbonner;