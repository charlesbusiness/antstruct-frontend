import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    MenuItem,
} from "@mui/material";
import { ApiRoutes } from "../../utils/ApiRoutes";
import useSubmitData from "../../hooks/useSubmitData";
import { useQueryClient } from "@tanstack/react-query";

const InventoryFormModal = ({ open, handleClose, products, productId }) => {
    const { submitData } = useSubmitData()
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        product_id: "",
        type: "in",
        qty: '',
        note: "",
    });


    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    /** Handle adding a stock movement */
    const handleAddMovement = async (e) => {
        e.preventDefault()

        await submitData({
            endpoint: ApiRoutes.stock.create(formData.product_id),
            method: "post",
            data: { ...formData }
        });

        // Refresh stock list after successful post
        queryClient.invalidateQueries(["StockData"]);
        handleClose(!open)
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                p={3}
                bgcolor="white"
                sx={{ width: 400, mx: "auto", mt: "10%", borderRadius: 2 }}
            >
                <Typography variant="h6" mb={2}>
                    Add Stock Movement
                </Typography>

                <form onSubmit={handleAddMovement}>
                    {/* Product selector */}
                    <TextField
                        select
                        fullWidth
                        label="Product"
                        name="product_id"
                        value={formData.product_id || ''}
                        onChange={handleChange}
                        margin="normal"
                        required
                        disabled={productId ? true : false}
                    >
                        <MenuItem value=''>Select Product</MenuItem>
                        {products?.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        fullWidth
                        label="Type"
                        name="type"
                        value={formData.type || ''}
                        onChange={handleChange}
                        margin="normal"
                    >
                        <MenuItem value="in">In</MenuItem>
                        <MenuItem value="out">Out</MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        name="qty"
                        value={formData.qty}
                        onChange={handleChange}
                        margin="normal"
                        inputProps={{ min: 1 }}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Supplier / Note"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        margin="normal"
                    />

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Save Movement
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default InventoryFormModal;
