import { Head } from '../infra/components/Head';
import styles from '../styles/Home.module.css';

function Home(): JSX.Element {
  return (
    <>
      <Head title="Home" />

      <div className={styles.container}>
        <h1 className="text-3xl font-bold underline">Store manager</h1>
      </div>
    </>
  );
}

export default Home;
