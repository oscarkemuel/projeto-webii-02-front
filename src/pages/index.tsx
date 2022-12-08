import {
  Card,
  CardContent,
  Typography,
  Divider,
  Container
} from '@mui/material';
import { useEffect, useState } from 'react';
import { grey } from '@mui/material/colors';
import { toast } from 'react-toastify';
import { Head } from '../infra/components/Head';
import api from '../services/api';
import { Store } from '../types';

function Home(): JSX.Element {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  async function getAllStores(): Promise<void> {
    setLoading(true);

    api
      .get('/stores')
      .then((response) => {
        setStores(response.data.stores);
      })
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getAllStores();
  }, []);

  return (
    <>
      <Head title="Home" />

      <Container>
        <h3>Lista de lojas:</h3>
        {stores.map((store) => {
          return (
            <Card
              sx={{
                width: 250,
                bgcolor: grey[100],
                m: 1,
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 6
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
                <Divider variant="middle" sx={{ my: 2, mx: 0 }} />
                <Typography variant="body2">
                  Dono: {store.owner.name}
                </Typography>
                <Typography variant="body2">
                  Criado em: {new Date(store.created_at).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
        {!loading && stores.length === 0 && (
          <Typography variant="h6" color="textSecondary" align="center">
            Você ainda não possui nenhum estabelecimento cadastrado como dono.
          </Typography>
        )}
      </Container>
    </>
  );
}

export default Home;
