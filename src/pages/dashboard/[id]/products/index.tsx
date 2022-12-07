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
import Paper from '@mui/material/Paper';
import { Delete, Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { DashboardComponent } from '../../../../components/DashboardComponent';
import { Head } from '../../../../infra/components/Head';
import api from '../../../../services/api';
import { Product } from '../../../../types';
import { withSSRAuth } from '../../../../utils/withSSRAuth';
import CreateProductModal from '../../../../components/CreateProductModal';

function Products(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  async function getProducts(): Promise<void> {
    api
      .get(`/stores/${id}/products`)
      .then(({ data }) => setProducts(data.products))
      .catch((error) => toast.error(error.response.data.message));
  }

  async function deleteProduct(productId: number): Promise<void> {
    api
      .delete(`/products/${productId}`)
      .then(() => {
        toast.success('Produto deletado com sucesso');
        getProducts();
      })
      .catch((error) => toast.error(error.response.data.message));
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <Head title="Produtos" />
      <CreateProductModal
        storeId={Number(id)}
        onClose={() => {
          setOpenCreateProductModal(false);
          setSelectedProduct(null);
        }}
        openCreateProductModal={openCreateProductModal}
        refetchProducts={() => {
          getProducts();
          setSelectedProduct(null);
        }}
        selectedProduct={selectedProduct}
      />

      <DashboardComponent storeId={id} title="Produtos da loja">
        <Button
          variant="outlined"
          onClick={() => setOpenCreateProductModal(true)}>
          Criar produto
        </Button>
        <Divider variant="middle" sx={{ my: 2, mx: 0 }} />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="products table">
            <TableHead>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Preço</TableCell>
                <TableCell>Estoque</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>R$ {product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      sx={{ mr: 1, border: 1, borderColor: 'error.main' }}
                      onClick={() => deleteProduct(product.id)}>
                      <Delete color="error" />
                    </Button>

                    <Button
                      size="small"
                      sx={{ border: 1, borderColor: 'primary.main' }}
                      onClick={() => {
                        setOpenCreateProductModal(true);
                        setSelectedProduct(product);
                      }}>
                      <Edit color="primary" />
                    </Button>
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

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {}
  };
});

export default Products;
