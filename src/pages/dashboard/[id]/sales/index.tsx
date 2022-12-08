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
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import { DashboardComponent } from '../../../../components/DashboardComponent';
import { Head } from '../../../../infra/components/Head';
import api from '../../../../services/api';
import { Sale } from '../../../../types';
import { withSSRAuth } from '../../../../utils/withSSRAuth';
import CreateSaleModal from '../../../../components/CreateSaleModal';

function Sales(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const [sales, setSales] = useState<Sale[]>([]);
  const [openCreateSaleModal, setOpenCreateSaleModal] = useState(false);

  async function getSales(): Promise<void> {
    api
      .get(`/stores/${id}/sales`)
      .then(({ data }) => setSales(data.sales))
      .catch((error) => toast.error(error.response.data.message));
  }

  useEffect(() => {
    getSales();
  }, []);

  return (
    <>
      <Head title="Vendas" />
      <CreateSaleModal
        openCreateSaleModal={openCreateSaleModal}
        onClose={() => setOpenCreateSaleModal(false)}
        refetchSales={() => getSales()}
        storeId={Number(id)}
      />

      <DashboardComponent storeId={id} title="Vendas da loja">
        <Button variant="outlined" onClick={() => setOpenCreateSaleModal(true)}>
          Adicionar venda
        </Button>
        <Divider variant="middle" sx={{ my: 2, mx: 0 }} />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="products table">
            <TableHead>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>Produto</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Vendedor</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sales.map((sale) => (
                <TableRow
                  key={sale.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{sale.id}</TableCell>
                  <TableCell>{sale.product.name}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>R$ {sale.price}</TableCell>
                  <TableCell>{sale.seller.user.name}</TableCell>
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

export default Sales;
