import {
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useRouter } from 'next/router';
import Paper from '@mui/material/Paper';
import { Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DashboardComponent } from '../../../../components/DashboardComponent';
import { Head } from '../../../../infra/components/Head';
import { withSSRAuth } from '../../../../utils/withSSRAuth';
import { Seller } from '../../../../types';
import api from '../../../../services/api';
import AddSellerModal from '../../../../components/AddSellerModal';
import { useAuth } from '../../../../contexts/AuthContext';

function Home(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [openAddSellerModal, setOpenAddSellerModal] = useState(false);
  const [sellerIsDeleting, setSellerIsDeleting] = useState(false);

  async function getSellers(): Promise<void> {
    api
      .get(`/stores/${id}/sellers`)
      .then(({ data }) => setSellers(data.sellers))
      .catch((error) => toast.error(error.response.data.message));
  }

  async function removeSeller(sellerId: number): Promise<void> {
    setSellerIsDeleting(true);

    api
      .delete(`/stores/${id}/remove-seller/${sellerId}`)
      .then(() => {
        toast.success('Vendedor deletado com sucesso');
        getSellers();
      })
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => setSellerIsDeleting(false));
  }

  useEffect(() => {
    getSellers();
  }, []);

  return (
    <>
      <Head title="Vendedores" />
      <AddSellerModal
        openAddSellerModal={openAddSellerModal}
        onClose={() => setOpenAddSellerModal(false)}
        refetchSellers={() => getSellers()}
        storeId={Number(id)}
      />

      <DashboardComponent storeId={id} title="Vendedores da loja">
        <Button variant="outlined" onClick={() => setOpenAddSellerModal(true)}>
          Adicionar vendedor
        </Button>

        <Divider variant="middle" sx={{ my: 2, mx: 0 }} />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="products table">
            <TableHead>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow
                  key={seller.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{seller.id}</TableCell>
                  <TableCell>{seller.user.name}</TableCell>
                  <TableCell>{seller.user.name}</TableCell>
                  <TableCell>
                    {seller.user.id !== user?.id && (
                      <Button
                        size="small"
                        disabled={sellerIsDeleting}
                        sx={{ mr: 1, border: 1, borderColor: 'error.main' }}
                        onClick={() => removeSeller(seller.id)}>
                        <Delete color="error" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardComponent>
    </>
  );
}

// export const getServerSideProps = withSSRAuth(async () => {
//   return {
//     props: {}
//   };
// });

export default Home;
