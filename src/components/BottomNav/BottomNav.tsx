import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import FavorisIcon from '@mui/icons-material/Favorite';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';
import { useAppSelector } from '../../hooks/redux';

export default function BottomNav() {
  const [value, setValue] = useState<number>(0);
  // Si l'utilisateur n'est pas loggé certaines icônes de la navbar sont désactivées
  const isLogged = useAppSelector((state) => state.user.isLogged);

  // En fonction de l'icone cliquée, le composant retourne un index
  // On utilise switch pour gérer le cas pour chaque index
  function handleButtonNavClick(newValue: number) {
    setValue(newValue);
    switch (newValue) {
      case 0:
        window.location.replace('/');
        break;
      case 1:
        window.location.replace('/favoris');
        break;
      case 2:
        window.location.replace('/addPost');
        break;
      case 3:
        window.location.replace('/messages');
        break;
      case 4:
        if (isLogged) {
          window.location.replace('/profil');
        } else {
          window.location.replace('/login');
        }
        break;
      default:
        break;
    }
  }

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        handleButtonNavClick(newValue);
      }}
      style={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
      }}
    >
      <BottomNavigationAction label="Accueil" icon={<HomeIcon />} />
      <BottomNavigationAction
        label="Favoris"
        icon={<FavorisIcon />}
        disabled={!isLogged}
        sx={isLogged ? {} : { color: '#bbb' }}
      />
      <BottomNavigationAction
        label="Ajouter"
        icon={<AddCircleIcon />}
        disabled={!isLogged}
        sx={isLogged ? {} : { color: '#bbb' }}
      />
      <BottomNavigationAction
        label="Messages"
        icon={<ChatBubbleIcon />}
        disabled={!isLogged}
        sx={isLogged ? {} : { color: '#bbb' }}
      />
      <BottomNavigationAction
        label={isLogged ? 'Profil' : 'Connexion'}
        icon={<PersonIcon />}
      />
    </BottomNavigation>
  );
}
