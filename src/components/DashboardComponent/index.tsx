import {
  Box,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import { Settings, People, ShoppingCart, LocalMall } from '@mui/icons-material';
import Link from 'next/link';
import Router from 'next/router';
import { useCanDashboard } from '../../hooks/useCanDashboard';
import Login from '../../pages/login';

interface Props {
  children: React.ReactNode;
  title: string;
  storeId: string | string[] | undefined;
}

export function DashboardComponent({
  children,
  title,
  storeId
}: Props): JSX.Element {
  const userHassPermission = useCanDashboard({ storeId: Number(storeId) });

  if (!userHassPermission) return <Login />;

  const links = [
    {
      title: 'Configurações',
      href: `/dashboard/${storeId}`,
      icon: <Settings />
    },
    {
      title: 'Produtos',
      href: `/dashboard/${storeId}/products`,
      icon: <LocalMall />
    },
    {
      title: 'Vendedores',
      href: `/dashboard/${storeId}/sellers`,
      icon: <People />
    },
    {
      title: 'Vendas',
      href: `/dashboard/${storeId}/sales`,
      icon: <ShoppingCart />
    }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box'
          }
        }}
        variant="permanent"
        anchor="left">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            <Link href="/">Store Manager</Link>
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {links.map((link) => (
            <ListItem
              key={link.title}
              disablePadding
              onClick={() => Router.push(link.href)}>
              <ListItemButton>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Container>
        <h1>{title}</h1>
        {children}
      </Container>
    </Box>
  );
}
