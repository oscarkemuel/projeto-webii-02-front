import { useAuth } from '../contexts/AuthContext';
import { Head } from '../infra/components/Head';
import styles from '../styles/Home.module.css';

function Home(): JSX.Element {
  const { user } = useAuth();

  return (
    <>
      <Head title="Home" />

      <div className={styles.container}>
        <h1 className="text-3xl font-bold underline">
          Hello world! My names is {user?.name || 'John Doe'}
        </h1>
      </div>
    </>
  );
}

export default Home;
