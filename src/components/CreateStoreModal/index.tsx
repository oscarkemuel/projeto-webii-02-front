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
import { useAuth } from '../../contexts/AuthContext';
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
  openCreateStoreModal: boolean;
  refetchStores: () => void;
}

interface StorePayload {
  name: string;
  address: string;
  description: string;
  ownerId: number;
}

function CreateStoreModal({
  openCreateStoreModal,
  onClose,
  refetchStores
}: Props): JSX.Element {
  const { user, addStore } = useAuth();
  const [loading, setLoading] = useState(false);

  async function createStore(payload: StorePayload): Promise<void> {
    setLoading(true);

    api
      .post('/stores', payload)
      .then(({ data }) => {
        toast.success('Estabelecimento criado com sucesso!');
        addStore(data.store);
        onClose();
        refetchStores();
      })
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => {
        setLoading(false);
      });
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
      description: ''
    },
    validationSchema: yup.object({
      name: yup.string().required('Nome obrigatório'),
      address: yup.string().required('Senha obrigatória'),
      description: yup.string().required('Descrição obrigatória')
    }),
    onSubmit: (values) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      createStore({ ...values, ownerId: user!.id });
    }
  });

  return (
    <Modal
      open={openCreateStoreModal}
      onClose={onClose}
      aria-labelledby="modal-modal-add-store"
      aria-describedby="modal to create a store">
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        noValidate
        sx={styleModal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Criar Estabelecimento
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
              placeholder="Digite seu nome"
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
              name="address"
              label="Endereço"
              placeholder="Digite o endereço da loja"
              id="address"
              autoComplete="current-address"
              onChange={formik.handleChange}
              value={formik.values.address}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="description"
              label="Descrição"
              placeholder="Digite uma descrição para a loja"
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
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}>
          Cadastrar loja
        </Button>
      </Box>
    </Modal>
  );
}

export default CreateStoreModal;
