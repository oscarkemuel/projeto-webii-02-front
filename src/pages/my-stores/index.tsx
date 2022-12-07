import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { grey } from '@mui/material/colors';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { Delete } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { Head } from '../../infra/components/Head';
import api from '../../services/api';
import { withSSRAuth } from '../../utils/withSSRAuth';
import CreateStoreModal from '../../components/CreateStoreModal';

interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
}

function MyStores(): JSX.Element {
  const { user } = useAuth();
  const [openCreateStoreModal, setOpenCreateStoreModal] = useState(false);

  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  async function getMyStores(): Promise<void> {
    setLoading(true);

    await api
      .get(`/stores/my-stores/${user?.id}`)
      .then((response) => setStores(response.data.stores))
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => setLoading(false));
  }

  async function deleteStore(id: string): Promise<void> {
    await api
      .delete(`/stores/${id}`)
      .then(() => {
        toast.success('Loja excluída com sucesso!');
        getMyStores();
      })
      .catch((error) => toast.error(error.response.data.message));
  }

  useEffect(() => {
    getMyStores();
  }, []);

  return (
    <>
      <Head title="Meus estabelecimentos" />
      <CreateStoreModal
        openCreateStoreModal={openCreateStoreModal}
        onClose={() => setOpenCreateStoreModal(false)}
        refetchStores={() => getMyStores()}
      />

      <Container>
        <h1>Meus estabelecimentos</h1>

        <Button
          variant="outlined"
          onClick={() => setOpenCreateStoreModal(true)}>
          Criar loja
        </Button>
        <Divider variant="middle" sx={{ my: 2, mx: 0 }} />

        {!loading && stores.length === 0 && (
          <Typography variant="h6" color="textSecondary" align="center">
            Você ainda não possui nenhum estabelecimento cadastrado.
          </Typography>
        )}

        <Box flexDirection="row" display="flex" width="100%" flexWrap="wrap">
          {stores.map((store) => {
            return (
              <Card
                sx={{
                  width: 250,
                  bgcolor: grey[300],
                  m: 1,
                  justifyContent: 'space-between',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                key={store.id}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {store.name}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {store.description}
                  </Typography>
                  <Typography variant="body2">{store.address}</Typography>
                </CardContent>
                <CardActions>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%">
                    <Button
                      size="small"
                      onClick={() => Router.push(`/dashboard/${store.id}`)}>
                      Acessar
                    </Button>
                    <Button size="small" onClick={() => deleteStore(store.id)}>
                      <Delete color="error" />
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            );
          })}
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

export default MyStores;
