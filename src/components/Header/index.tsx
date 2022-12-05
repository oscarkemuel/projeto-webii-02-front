import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import Router from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

function Header(): JSX.Element {
  const { user, signOut, isAuthenticated } = useAuth();

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <Link href="/">Store Manager</Link>
        </Typography>

        <nav>
          {isAuthenticated && (
            <Button variant="text" onClick={() => Router.push('/my-stores')}>
              Minhas Lojas
            </Button>
          )}
        </nav>
        {user ? (
          <Button variant="text" onClick={() => signOut()}>
            Sair
          </Button>
        ) : (
          <Button
            variant="outlined"
            sx={{ my: 1, mx: 1.5 }}
            onClick={() => Router.push('/login')}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
