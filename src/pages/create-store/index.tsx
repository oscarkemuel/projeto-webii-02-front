import {
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Box
} from '@mui/material';
import { useFormik } from 'formik';
import Router from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { Head } from '../../infra/components/Head';
import api from '../../services/api';
import { withSSRAuth } from '../../utils/withSSRAuth';

interface StorePayload {
  name: string;
  address: string;
  description: string;
  ownerId: number;
}

function CreateStore(): JSX.Element {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  async function createStore(payload: StorePayload): Promise<void> {
    setLoading(true);

    api
      .post('/stores', payload)
      .then(() => {
        toast.success('Estabelecimento criado com sucesso!');

        Router.push('/my-stores');
      })
      .catch((error) => toast.error(error.response.data.message));

    setLoading(false);
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
    <>
      <Head title="Criar estabelecimento" />

      <Container>
        <h1>Criar estabelecimento</h1>

        <Divider variant="middle" sx={{ my: 2, mx: 0 }} />

        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1 }}>
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
                  formik.touched.description &&
                  Boolean(formik.errors.description)
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
      </Container>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {}
  };
});

export default CreateStore;
