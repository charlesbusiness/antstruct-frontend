import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
} from "@mui/material";
import InventoryFormModal from "./StockMovementForm";
import { ApiRoutes } from "../../utils/ApiRoutes";
import { useQuery } from "@tanstack/react-query";
import ScreenLoader from "../../common/Loader/scren-loader";
import useSubmitData from "../../hooks/useSubmitData";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatDateOnly } from "../../utils/general";

const StockManagement = () => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const { submitData } = useSubmitData();
  const [searchParams] = useSearchParams()
  const productId = searchParams.get("productId");

  /** ✅ Fetch stock movements */
  const { data: stocks = [], isLoading: loadingStocks } = useQuery({
    queryKey: ["StockData", productId], // include productId in the cache key
    queryFn: async () => {
      const response = await submitData({
        data: {},
        endpoint: ApiRoutes.stock.get(productId),
        method: "get",
      });

      if (!response || response?.error) {
        throw new Error("Failed to fetch stock movements");
      }

      return response?.data ?? [];
    },
    keepPreviousData: false,
  });


  /** ✅ Fetch inventory products */
  const { data: inventories = [], isLoading: loadingInventories } = useQuery({
    queryKey: ["InventoryData"],
    queryFn: async () => {
      const response = await submitData({
        data: {},
        endpoint: ApiRoutes.inventory.get,
        method: "get",
      });

      if (!response || response?.error) {
        throw new Error("Failed to fetch inventories");
      }

      return response?.data ?? [];
    },
    enabled: modalOpen, // 👈 only fetch when modal is opened
    staleTime: 1000 * 60,
  });



  return (
    <Box p={3}>
      <ScreenLoader status={loadingStocks || loadingInventories} />
      <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate('/inventory')}>
        Back to Inventory
      </Button>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Stock Movements</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Add Movement
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Action Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Supplier</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks?.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{formatDateOnly(p.created_at)}</TableCell>
                <TableCell>{p.product?.name}</TableCell>
                <TableCell>{p.type}</TableCell>
                <TableCell>{p.qty}</TableCell>
                <TableCell>{p.product?.supplier?.name}</TableCell>
              </TableRow>
            ))}
            {
              !stocks?.length &&
              <TableRow>
                <TableCell colSpan={5}>No Stock movement available for now</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Form with product selector */}
      <InventoryFormModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        products={inventories}
        productData={productId}
      />
    </Box>
  );
};

export default StockManagement;
