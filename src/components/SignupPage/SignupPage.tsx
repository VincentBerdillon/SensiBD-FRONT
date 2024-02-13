import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { useState, ChangeEvent, FormEvent, LegacyRef } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import './SignupPage.scss';
import CustomToast from '../CustomToast/CustomToast';

type UserData = {
  firstname: string;
  lastname: string;
  pseudonym: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
};

//* Composant de page d'inscription

function SignupPage() {
  const googlePlacesAPIKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningEmailOpen, setWarningEmailOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successEmailOpen, setSuccessEmailOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const [userFormData, setUserFormData] = useState<UserData>({
    firstname: '',
    lastname: '',
    pseudonym: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  // Fonction de récupération des coordonnées latitude et longitude depuis l'API google
  const getCoordinates = async (address: string) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${googlePlacesAPIKey}`
    );
    const data = await response.json();

    // Récupération des données découpées par l'API
    if (data.results.length > 0) {
      const { location } = data.results[0].geometry;
      return {
        // full_adress: data.results[0].formatted_address,
        number: data.results[0].address_components[0].short_name,
        street: data.results[0].address_components[1].short_name,
        zipcode: data.results[0].address_components[6].short_name,
        city: data.results[0].address_components[2].short_name,
        country: data.results[0].address_components[5].long_name,
        latitude: location.lat,
        longitude: location.lng,
      };
    }
    throw new Error('Adresse non trouvée');
  };

  // Enregistrer la valeur des inputs en fonction de leur nom
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData((prevData) => ({ ...prevData, [name]: value }));
    // Vérifier la validité du format d'email
    if (name === 'email') {
      const isValidEmail =
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
      console.log('Valide email:', isValidEmail);
      if (!isValidEmail) {
        setWarningEmailOpen(true);
      } else {
        setSuccessEmailOpen(true);
      }
    }
  };

  // Gestion de l'input placesref avec la propriété ref qui permet de cibler un input
  // le hook usePlaceWidget du package googleAutocomplete permet de trouver une addresse, ici limité à la France
  const { ref: placesRef } = usePlacesWidget({
    apiKey: googlePlacesAPIKey,
    onPlaceSelected: (place) => {
      setUserFormData((prevData) => ({
        ...prevData,
        address: place.formatted_address,
      }));
    },
    options: {
      types: ['address'],
      componentRestrictions: { country: 'FR' },
    },
  });

  // Envoie du formulaire
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userFormData.password !== userFormData.confirmPassword) {
      console.error('Passwords match incorrect');
      setWarningOpen(true);
      return;
    }

    try {
      const addressData = await getCoordinates(userFormData.address);
      console.log(userFormData, addressData);
      axios
        .post('http://localhost:3000/users/', {
          ...userFormData,
          ...addressData,
        })
        .then((response) => {
          setSuccessOpen(true);
          setTimeout(() => {
            window.location.replace('/login');
          }, 2000);
        })
        .catch((error) => {
          console.error('Erreur lors de la requête POST:', error);
          setErrorOpen(true);
        });
    } catch (error) {
      console.error('Erreur lors de la récupération des coordonnées:', error);
      throw error;
    }
  };

  return (
    <div className="signupForm">
      <Typography variant="h2" sx={{ marginBottom: '1rem' }}>
        Inscription
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>
          <TextField
            className="signupForm__input"
            label="Prénom (non visible sur le site)"
            name="firstname"
            value={userFormData.firstname}
            InputProps={{
              inputProps: {
                minLength: 2,
                maxLength: 20,
              },
            }}
            onChange={handleChange}
            required
            sx={{ marginBottom: '1rem' }}
          />
        </div>
        <TextField
          label="Nom (non visible sur le site)"
          name="lastname"
          value={userFormData.lastname}
          InputProps={{
            inputProps: {
              minLength: 2,
              maxLength: 20,
            },
          }}
          onChange={handleChange}
          required
          sx={{ marginBottom: '1rem' }}
        />
        <TextField
          label="Pseudo"
          name="pseudonym"
          value={userFormData.pseudonym}
          InputProps={{
            inputProps: {
              minLength: 2,
              maxLength: 20,
            },
          }}
          onChange={handleChange}
          required
          sx={{ marginBottom: '1rem' }}
        />
        <TextField
          label="Email"
          name="email"
          value={userFormData.email}
          onChange={handleChange}
          required
          sx={{ marginBottom: '1rem' }}
        />
        <input
          ref={placesRef as unknown as LegacyRef<HTMLInputElement>}
          className="signupForm__address"
          placeholder="Addresse*"
          autoComplete="off"
          name="address"
          type="text"
          onChange={handleChange}
          value={userFormData.address}
          required
        />
        <TextField
          label="Password (lg.8, mini une A,a,0,+"
          type="password"
          name="password"
          value={userFormData.password}
          onChange={handleChange}
          inputProps={{
            pattern:
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
          }}
          required
          sx={{ marginBottom: '1rem' }}
        />
        <TextField
          label="Confirmez le password"
          type="password"
          name="confirmPassword"
          value={userFormData.confirmPassword}
          onChange={handleChange}
          required
          sx={{ marginBottom: '1rem' }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#95C23D',
            '&:hover': {
              backgroundColor: '#7E9D2D',
            },
          }}
        >
          S&apos;inscrire
        </Button>
      </form>
      <CustomToast
        open={warningOpen}
        onClose={() => setWarningOpen(false)}
        severity="warning"
      >
        Les mots de passe ne correspondent pas !
      </CustomToast>
      <CustomToast
        open={warningEmailOpen}
        onClose={() => setWarningEmailOpen(false)}
        severity="warning"
      >
        attention à saisir un format d'email valide !
      </CustomToast>
      <CustomToast
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        severity="success"
      >
        Inscription réussie !
      </CustomToast>
      <CustomToast
        open={successEmailOpen}
        onClose={() => setSuccessEmailOpen(false)}
        severity="info"
      >
        Email valide !
      </CustomToast>
      <CustomToast
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        severity="error"
      >
        Vérifier vos infos, ce compte existe peut-être déjà !
      </CustomToast>
    </div>
  );
}

export default SignupPage;
