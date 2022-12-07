import { useRouter } from 'next/router';
import { DashboardComponent } from '../../../../components/DashboardComponent';
import { Head } from '../../../../infra/components/Head';
import { withSSRAuth } from '../../../../utils/withSSRAuth';

function Sales(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;

  // async function getSales() {}

  return (
    <>
      <Head title="Vendas" />

      <DashboardComponent storeId={id} title="Vendas da loja">
        <h2>hello</h2>
      </DashboardComponent>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {}
  };
});

export default Sales;
