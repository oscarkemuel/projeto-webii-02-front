import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DashboardComponent } from '../../../components/DashboardComponent';
import { Head } from '../../../infra/components/Head';
import api from '../../../services/api';
import { Store } from '../../../types';
import { withSSRAuth } from '../../../utils/withSSRAuth';

function StoreSettings(): JSX.Element {
  const [store, setStore] = useState<Store>({} as Store);
  const router = useRouter();
  const { id } = router.query;

  async function getStore(): Promise<void> {
    api.get(`/stores/${id}`).then((response) => {
      setStore(response.data.store);
    });
  }

  useEffect(() => {
    getStore();
  }, []);

  return (
    <>
      <Head title="Configurações" />

      <DashboardComponent storeId={id} title="Configurações de loja">
        <h2>Loja id {store.name}</h2>
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
