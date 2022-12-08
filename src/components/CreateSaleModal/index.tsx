import {
  Box,
  Button,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import api from '../../services/api';
import { Product, Seller } from '../../types';

const styleModal = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

interface Props {
  onClose: () => void;
  openCreateSaleModal: boolean;
  refetchSales: () => void;
  storeId: number;
}

interface SalePayload {
  productId: number;
  sellerId: number;
  quantity: number;
}

function CreateSaleModal({
  openCreateSaleModal,
  onClose,
  refetchSales,
  storeId
}: Props): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);

  async function getProducts(): Promise<void> {
    api
      .get(`/stores/${storeId}/products`)
      .then(({ data }) => setProducts(data.products))
      .catch((error) => toast.error(error.response.data.message));
  }

  async function getSellers(): Promise<void> {
    api
      .get(`/stores/${storeId}/sellers`)
      .then(({ data }) => setSellers(data.sellers))
      .catch((error) => toast.error(error.response.data.message));
  }

  useEffect(() => {
    getSellers();
    getProducts();
  }, []);

  async function createSale(payload: SalePayload): Promise<void> {
    setLoading(true);

    api
      .post(`/stores/${storeId}/add-sale`, payload)
      .then(() => {
        toast.success('Venda adicionada com sucesso!');
        refetchSales();
      })
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => {
        onClose();
        setLoading(false);
      });
  }

  const formik = useFormik({
    initialValues: {
      productId: 0,
      sellerId: 0,
      quantity: 0
    },
    validationSchema: yup.object({
      productId: yup.number().required('Campo obrigatório').min(1),
      sellerId: yup.number().required('Campo obrigatório').min(1),
      quantity: yup.number().required('Campo obrigatório').min(1)
    }),
    onSubmit: (values) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (values.productId && values.sellerId && values.quantity) {
        createSale({ ...values });
      }
    }
  });

  return (
    <Modal
      open={openCreateSaleModal}
      onClose={onClose}
      aria-labelledby="modal-modal-add-store"
      aria-describedby="modal to create a store">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        sx={styleModal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Adicionar Venda
        </Typography>

        <Divider variant="middle" sx={{ my: 2, mx: 0 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InputLabel id="product-select-label">Produto</InputLabel>
            <Select
              labelId="product-select-label"
              id="product-select"
              fullWidth
              value={formik.values.productId}
              label="Produto"
              name="productId"
              error={
                formik.touched.productId && Boolean(formik.errors.productId)
              }
              onChange={formik.handleChange}>
              {products.map((product) => {
                return (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} / R${product.price} / {product.quantity}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel id="seller-select-label">Vendedor</InputLabel>
            <Select
              labelId="seller-select-label"
              id="seller-select"
              fullWidth
              value={formik.values.sellerId}
              label="Produto"
              name="sellerId"
              error={formik.touched.sellerId && Boolean(formik.errors.sellerId)}
              onChange={formik.handleChange}>
              {sellers.map((seller) => {
                return (
                  <MenuItem key={seller.id} value={seller.id}>
                    {seller.user.name}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <TextField
              margin="normal"
              type="number"
              required
              fullWidth
              name="quantity"
              label="Quantidade"
              placeholder="Digite a quantidade"
              id="quantity"
              autoComplete="current-quantity"
              onChange={formik.handleChange}
              value={formik.values.quantity}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}>
          Adicionar venda
        </Button>
      </Box>
    </Modal>
  );
}

export default CreateSaleModal;
