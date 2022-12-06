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
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Link from 'next/link';
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
          {['Inbox', 'Starred'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
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
