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
} from "@mui/material";
import { Delete, Edit, Visibility, CloudUpload } from "@mui/icons-material";

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

const mockInventory = [
  {
    id: 1,
    name: "Item A",
    description: "High-quality item A",
    quantity: 10,
    price: 25,
    image: "data:image/jpeg;base64,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",
  },
  {
    id: 2,
    name: "Item B",
    description: "Durable item B",
    quantity: 5,
    price: 40,
    image: "data:image/jpeg;base64,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",
  },
];

const InventoryPage = () => {
  const [items, setItems] = useState(mockInventory);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const fileInputRef = useRef(null);

  const handleOpenModal = (item = null, editMode = false) => {
    setCurrentItem(item || { name: "", description: "", quantity: "", price: "", image: "" });
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

  const handleSaveItem = () => {
    if (!currentItem.name || !currentItem.quantity || !currentItem.price) return;

    if (isEditMode) {
      setItems(items.map(item => item.id === currentItem.id ? currentItem : item));
    } else {
      const newId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
      const newItem = {
        ...currentItem,
        id: newId,
        quantity: Number(currentItem.quantity),
        price: Number(currentItem.price)
      };
      setItems([...items, newItem]);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setItems(items.filter(item => item.id !== itemToDelete));
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleBulkDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const handleConfirmBulkDelete = () => {
    setItems(items.filter(item => !selected.includes(item.id)));
    setSelected([]);
    setDeleteConfirmOpen(false);
  };

  const toggleSelect = (id) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const filteredItems = items.filter(
    item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={1} sx={{ maxWidth: 1200, margin: "auto" }}>
      <Typography variant="h5" mb={1}>Inventory Management</Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} />
        <Box display="flex" gap={1}>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal(null, false)}>
            Add Item
          </Button>
          {selected.length > 0 && (
            <Button variant="contained" color="error" onClick={handleBulkDelete}>
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
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>${item.quantity * item.price}</TableCell>
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
                </TableCell>
              </TableRow>
            ))}
            {filteredItems.length === 0 && (
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
                label="Description"
                value={currentItem?.description || ""}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                value={currentItem?.quantity || ""}
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
            </Stack>
          ) : (
            <Stack spacing={1}>
              <Typography><strong>Name:</strong> {currentItem.name}</Typography>
              <Typography><strong>Description:</strong> {currentItem.description}</Typography>
              <Typography><strong>Quantity:</strong> {currentItem.quantity}</Typography>
              <Typography><strong>Price:</strong> ${currentItem.price}</Typography>
              <Typography><strong>Total Value:</strong> ${currentItem.quantity * currentItem.price}</Typography>
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
            onClick={itemToDelete ? handleConfirmDelete : handleConfirmBulkDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryPage;