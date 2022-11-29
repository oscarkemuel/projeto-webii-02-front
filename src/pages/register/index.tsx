import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Divider } from '@mui/material';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { useState } from 'react';
import api from '../../services/api';
import { Head } from '../../infra/components/Head';

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  password_confirmation: string;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
  };
}

function Register(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (payload: RegisterPayload): Promise<void> => {
    setIsLoading(true);

    await api
      .post('/users', payload)
      .then(() => {
        toast.success('Usuário cadastrado com sucesso!');
        setIsLoading(false);
        Router.push('/login');
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setIsLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      address: {
        street: '',
        number: '',
        city: '',
        state: ''
      }
    },
    validationSchema: yup.object({
      name: yup.string().required('Nome obrigatório'),
      email: yup.string().email('Email inválido').required('Email obrigatório'),
      phone: yup.string().required('Telefone obrigatório'),
      password: yup.string().required('Senha obrigatória'),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Senhas não conferem')
        .required('Confirmação de senha obrigatória'),
      address: yup.object({
        street: yup.string().required('Rua obrigatória'),
        number: yup.string().required('Número obrigatório'),
        city: yup.string().required('Cidade obrigatória'),
        state: yup.string().max(2).min(2).required('Estado obrigatório')
      })
    }),
    onSubmit: (values) => {
      submit({ password_confirmation: values.confirmPassword, ...values });
    }
  });

  return (
    <>
      <Head title="Registro" />

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registrar-se
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
            sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Nome"
                  autoFocus
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Telefone"
                  name="phone"
                  autoComplete="phone"
                  placeholder="84940028922"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Senha"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmar senha"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                />
              </Grid>
            </Grid>

            <Divider variant="middle" sx={{ m: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="address.street"
                  label="Rua"
                  name="address.street"
                  autoComplete="street"
                  value={formik.values.address.street}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address &&
                    formik.touched.address.street &&
                    Boolean(formik.errors.address?.street)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="address.number"
                  label="Número"
                  name="address.number"
                  autoComplete="number"
                  value={formik.values.address.number}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address &&
                    formik.touched.address.number &&
                    Boolean(formik.errors.address?.number)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="address.city"
                  label="Cidade"
                  name="address.city"
                  autoComplete="city"
                  value={formik.values.address.city}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address &&
                    formik.touched.address.city &&
                    Boolean(formik.errors.address?.city)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="address.state"
                  label="Estado"
                  name="address.state"
                  autoComplete="state"
                  placeholder="RN"
                  value={formik.values.address.state}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address &&
                    formik.touched.address.state &&
                    Boolean(formik.errors.address?.state)
                  }
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}>
              Registrar
            </Button>
            <Grid container justifyContent="flex-end" sx={{ mb: 10 }}>
              <Grid item>
                <Link
                  href="/login"
                  style={{
                    textDecoration: 'underline',
                    color: 'blue'
                  }}>
                  Já possui conta? Entrar
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Register;
