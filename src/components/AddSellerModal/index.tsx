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
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import api from '../../services/api';

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
  openAddSellerModal: boolean;
  refetchSellers: () => void;
  storeId: number;
}

interface SellerPayload {
  email: string;
}

function AddSellerModal({
  openAddSellerModal,
  onClose,
  refetchSellers,
  storeId
}: Props): JSX.Element {
  const [loading, setLoading] = useState(false);

  async function addSeller(payload: SellerPayload): Promise<void> {
    setLoading(true);

    api
      .post(`/stores/${storeId}/add-seller`, payload)
      .then(() => {
        toast.success('Vendedor adicionado com sucesso!');
        onClose();
        refetchSellers();
      })
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => {
        setLoading(false);
      });
  }

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: yup.object({
      email: yup.string().email('Email inválido').required('Campo obrigatório')
    }),
    onSubmit: (values) => {
      addSeller(values);
    }
  });

  return (
    <Modal
      open={openAddSellerModal}
      onClose={onClose}
      aria-labelledby="modal-modal-add-store"
      aria-describedby="modal to create a store">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        sx={styleModal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Adicionar vendedor
        </Typography>

        <Divider variant="middle" sx={{ my: 2, mx: 0 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              placeholder="Digite o email do usuário"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}>
          Adicionar vendendor
        </Button>
      </Box>
    </Modal>
  );
}

export default AddSellerModal;
