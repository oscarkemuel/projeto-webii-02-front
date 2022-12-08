import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { DashboardComponent } from '../../../components/DashboardComponent';
import { Head } from '../../../infra/components/Head';
import api from '../../../services/api';
import { Store } from '../../../types';
import { withSSRAuth } from '../../../utils/withSSRAuth';

interface IUpdateStorePayload {
  name: string;
  address: string;
  description: string;
}

function StoreSettings(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  async function updateStore(values: IUpdateStorePayload): Promise<void> {
    setUpdateLoading(true);

    api
      .put(`/stores/${id}`, values)
      .then(() => {
        toast.success('Dados atualizados com sucesso!');
      })
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => setUpdateLoading(false));
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
      updateStore(values);
    }
  });

  async function getStore(): Promise<void> {
    setLoading(true);
    api
      .get(`/stores/${id}`)
      .then(({ data }) => {
        const { store } = data as { store: Store };

        formik.setValues({
          name: store.name,
          address: store.address,
          description: store.description
        });
      })
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getStore();
  }, []);

  return (
    <>
      <Head title="Configurações" />

      <DashboardComponent storeId={id} title="Configurações da loja">
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
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
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
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
              disabled={updateLoading}
              sx={{ mt: 3, mb: 2 }}>
              Atualizar dados
            </Button>
          </Box>
        )}
      </DashboardComponent>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {}
  };
});

export default StoreSettings;
