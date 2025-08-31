import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Modal,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import { Delete, Edit, Visibility, CloudUpload, ManageAccounts } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

import { ApiRoutes } from "../../utils/ApiRoutes";
import useSubmitData from "../../hooks/useSubmitData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ScreenLoader from "../../common/Loader/scren-loader";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};


const InventoryPage = () => {
  const queryClient = useQueryClient()
  const { submitData } = useSubmitData()
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    qty: '',
    supplier_id: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleOpenModal = (item = null, editMode = false) => {
    setCurrentItem(item || { name: "", description: "", qty: "", price: "", image: "" });
    setIsEditMode(editMode);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentItem(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    await submitData({
      data: currentItem,
      endpoint: ApiRoutes.inventory.delete(id),
      method: 'delete',
      reload: false,
    });
    queryClient.invalidateQueries(['inventoryData'])
    setDeleteConfirmOpen(false);
  };


  const handleConfirmBulkDelete = async () => {
    for (let i = 0; i < selected.length; i++) {
      await handleConfirmDelete(selected[i])
    }
    setDeleteConfirmOpen(false);
    queryClient.invalidateQueries(['inventoryData'])
  };

  const toggleSelect = (id) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const { data: inventory = [], isLoading, error } = useQuery({
    queryKey: ['inventoryData'],
    queryFn: async () => {
      const response = await submitData({
        data: {},
        endpoint: ApiRoutes.inventory.get,
        method: 'get',
      })

      if (!response || response?.error) {
        throw new Error('Failed to fetch inventories');
      }

      // make sure it always returns an array
      return response?.data ?? [];
    },
    keepPreviousData: true,
    staleTime: 1000 * 60, // cache for 1 min
  })

  const handleSaveItem = async () => {
    if (!currentItem.name || !currentItem.qty || !currentItem.price) return;

    try {
      if (isEditMode && currentItem?.id) {
        currentItem.id = currentItem.id
      }
      // 🔹 Create new item
      await submitData({
        data: currentItem,
        endpoint: ApiRoutes.inventory.create,
        method: 'post',
        reload: false,
      });
      queryClient.invalidateQueries(['inventoryData'])
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save item:", err);
    }
  }

  const deleteItem = async () => {
    return itemToDelete ? handleConfirmDelete(itemToDelete) : handleConfirmBulkDelete()
  }

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const res = await submitData({ method: 'get', endpoint: ApiRoutes.suppliers.get });
      return res?.data ?? [];
    }
  });
  console.log(suppliers)
  return (
    <>
      <ScreenLoader status={isLoading} />
      <Box p={1} sx={{ maxWidth: 1200, margin: "auto" }}>
        <Stack
          sx={{ mb: 3 }}
          direction={{ xs: 'column', lg: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="h5">Inventory Management</Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/inventory/suppliers')}
          >
            View Suppliers
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate('/inventory/product-stocks')}
          >
            Stock Movement
          </Button>

        </Stack>

        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} />
          <Box display="flex" gap={1}>
            <Button variant="contained" color="primary" onClick={() => handleOpenModal(null, false)}>
              Add Item
            </Button>
            {selected.length > 0 && (
              <Button variant="contained" color="error" onClick={() => setDeleteConfirmOpen(true)}>
                Delete Selected ({selected.length})
              </Button>
            )}
          </Box>
        </Box>

        {/* Inventory Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell>description</TableCell>
                <TableCell>qty</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Manage Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory?.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>${item.total_price}</TableCell>
                  <TableCell>{item.supplier?.name}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenModal(item, false)}>
                      <Visibility />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleOpenModal(item, true)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(item.id)}>
                      <Delete />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => navigate(`/inventory/product-stocks?productId=${item.id}`)}>
                      <ManageAccounts />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {inventory?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">No items found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Item Modal */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="inventory-item-modal"
          aria-describedby="inventory-item-details"
        >
          <Box sx={style}>
            <Typography variant="h6" mb={2}>
              {isEditMode ? "Edit Item" : currentItem?.id ? "Item Details" : "Add New Item"}
            </Typography>

            {currentItem?.image && (
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                <Avatar
                  src={currentItem.image}
                  alt={currentItem.name}
                  sx={{ width: 120, height: 120, mb: 2 }}
                  variant="rounded"
                />
                {(isEditMode || !currentItem?.id) && (
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={triggerFileInput}
                  >
                    Change Image
                  </Button>
                )}
              </Box>
            )}

            {(!currentItem?.image && (isEditMode || !currentItem?.id)) && (
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={triggerFileInput}
                sx={{ mb: 2 }}
                fullWidth
              >
                Upload Image
              </Button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {isEditMode || !currentItem?.id ? (
              <Stack spacing={2}>
                <TextField
                  name="name"
                  label="Name"
                  value={currentItem?.name || ""}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  name="description"
                  label="description"
                  value={currentItem?.description || ""}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                />
                <TextField
                  name="qty"
                  label="qty"
                  type="number"
                  value={currentItem?.qty || ""}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  value={currentItem?.price || ""}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
                <TextField
                  name="sku"
                  label="SKU"
                  value={currentItem?.sku || ""}
                  onChange={handleInputChange}
                  fullWidth
                />

                <TextField
                  name="supplier_id"
                  label="Supplier ID"
                  type="number"
                  value={currentItem?.supplier_id || ""}
                  onChange={handleInputChange}
                  fullWidth
                  select
                >
                  <MenuItem value=''>Select</MenuItem>
                  {
                    suppliers?.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>{supplier.name}</MenuItem>
                    ))
                  }
                </TextField>
              </Stack>
            ) : (
              <Stack spacing={1}>
                <Typography><strong>Name:</strong> {currentItem.name}</Typography>
                <Typography><strong>description:</strong> {currentItem.description}</Typography>
                <Typography><strong>qty:</strong> {currentItem.qty}</Typography>
                <Typography><strong>Price:</strong> ${currentItem.price}</Typography>
                <Typography><strong>Total Value:</strong> ${currentItem.qty * currentItem.price}</Typography>
              </Stack>
            )}

            <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={handleCloseModal}>Close</Button>
              {(isEditMode || !currentItem?.id) && (
                <Button variant="contained" color="primary" onClick={handleSaveItem}>
                  Save
                </Button>
              )}
              {!isEditMode && currentItem?.id && (
                <Button variant="contained" color="primary" onClick={() => setIsEditMode(true)}>
                  Edit
                </Button>
              )}
            </Box>
          </Box>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>
            {itemToDelete ? "Delete Item" : "Delete Selected Items"}
          </DialogTitle>
          <DialogContent>
            <Typography>
              {itemToDelete
                ? "Are you sure you want to delete this item?"
                : `Are you sure you want to delete ${selected.length} selected items?`}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => deleteItem()}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};
export default InventoryPage;