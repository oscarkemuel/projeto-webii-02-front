import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import api from '../../services/api';
import { Product } from '../../types';

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
  openCreateProductModal: boolean;
  refetchProducts: () => void;
  storeId: number;
  selectedProduct: Product | null;
}

interface ProductPayload {
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  storeId: number;
}

function CreateProductModal({
  openCreateProductModal,
  onClose,
  refetchProducts,
  storeId,
  selectedProduct
}: Props): JSX.Element {
  const [loading, setLoading] = useState(false);

  async function createProduct(payload: ProductPayload): Promise<void> {
    setLoading(true);

    if (selectedProduct) {
      api
        .put(`/products/${selectedProduct.id}`, payload)
        .then(() => {
          toast.success('Produto atualizado com sucesso!');
          refetchProducts();
          onClose();
        })
        .catch((error) => toast.error(error.response.data.message))
        .finally(() => setLoading(false));
    } else {
      api
        .post('/products', payload)
        .then(() => {
          toast.success('Produto criado com sucesso!');
          refetchProducts();
          onClose();
        })
        .catch((error) => toast.error(error.response.data.message))
        .finally(() => setLoading(false));
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      quantity: 0
    },
    validationSchema: yup.object({
      name: yup.string().required('Nome obrigatório'),
      description: yup.string().required('Descrição obrigatória'),
      price: yup.number().required('Preço obrigatório'),
      category: yup.string().required('Categoria obrigatória'),
      quantity: yup.number().required('Quantidade obrigatória')
    }),
    onSubmit: (values) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      createProduct({ ...values, storeId });
    }
  });

  useEffect(() => {
    if (selectedProduct) {
      formik.setValues({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        category: selectedProduct.category,
        quantity: selectedProduct.quantity
      });
    } else {
      formik.resetForm();
    }
  }, [selectedProduct]);

  return (
    <Modal
      open={openCreateProductModal}
      onClose={onClose}
      aria-labelledby="modal-modal-add-product"
      aria-describedby="modal to create a product">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        sx={styleModal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Criar Produto
        </Typography>

        <Divider variant="middle" sx={{ my: 2, mx: 0 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nome"
              placeholder="Digite o nome do produto"
              name="name"
              autoComplete="name"
              autoFocus
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="category"
              label="Categoria"
              placeholder="Digite a categoria do produto"
              id="category"
              autoComplete="current-category"
              onChange={formik.handleChange}
              value={formik.values.category}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="description"
              label="Descrição"
              placeholder="Digite uma descrição para o produto"
              id="description"
              autoComplete="current-description"
              onChange={formik.handleChange}
              value={formik.values.description}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              type="number"
              required
              fullWidth
              name="price"
              label="Preço"
              placeholder="Digite o preço"
              id="price"
              autoComplete="current-price"
              onChange={formik.handleChange}
              value={formik.values.price}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              type="number"
              required
              fullWidth
              name="quantity"
              label="Estoque"
              placeholder="Digite o estoque"
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
          {selectedProduct ? 'Editar' : 'Cadastrar'} produto
        </Button>
      </Box>
    </Modal>
  );
}

export default CreateProductModal;
