import '../styles/globals.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '../contexts/AuthContext';

import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';

const theme = createTheme();

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ToastContainer />
        <Header />
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
