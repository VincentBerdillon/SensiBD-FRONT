import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ChangeEvent, useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { changeCredentialValue, login } from '../../store/reducers/user';
import CustomToast from '../CustomToast/CustomToast';

//* Composant page de connexion

export default function LoginPage() {
  const dispatch = useAppDispatch();
  // récupération de l'email et du password depuis le store pour les lier à leurs inputs
  const emailValue = useAppSelector((state) => state.user.credentials.email);
  const passwordValue = useAppSelector(
    (state) => state.user.credentials.password
  );
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  // Enregistrement de la valeur de l'email dans le store avec l'émission d'un intention (disptach) de changer sa valeur (changeCredentialValue)
  const handleChangeEmail = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;
    dispatch(
      changeCredentialValue({
        textfieldName: 'email',
        value: newValue,
      })
    );
  };

  // Enregistrement de la valeur de l'email dans le store avec l'émission d'un intention (disptach) de changer sa valeur (changeCredentialValue)
  const handleChangePassword = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;
    dispatch(
      changeCredentialValue({
        textfieldName: 'password',
        value: newValue,
      })
    );
  };

  // Soumission du formulaire
  const handleSignInSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (emailValue === '' || passwordValue === '') {
      setErrorOpen(true);
      return;
    }

    const credentials = { email: emailValue, password: passwordValue };
    try {
      await dispatch(login(credentials));
      setSuccessOpen(true);

      setTimeout(() => {
        window.location.replace('/');
      }, 1500);
      // redirection au succès vers la home page
    } catch (error) {
      console.log('Error:', error);
      setErrorOpen(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '90vh',
        }}
      >
        <Typography variant="h2" sx={{ marginBottom: '0.8rem' }}>
          Connexion
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={handleSignInSubmit}
        >
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            type="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={emailValue}
            onChange={handleChangeEmail}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={passwordValue}
            onChange={handleChangePassword}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 3,
              backgroundColor: '#95C23D',
              '&:hover': {
                backgroundColor: '#7E9D2D',
              },
            }}
          >
            se connecter
          </Button>
          <Link href="/signup" variant="body2">
            Pas encore de compte? Inscrivez-vous !
          </Link>
        </Box>
      </Box>
      <CustomToast
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        severity="success"
      >
        Connexion réussie !
      </CustomToast>
      <CustomToast
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        severity="error"
      >
        Identifiant ou mot de passe incorrect
      </CustomToast>
    </Container>
  );
}
