/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { LocalStorage } from './LocalStorage';

// Création d'une instance axios préconfiguré
// Cela permet de spécifier une configuration pour toutes les requêtes
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

// Ajout d'un intercepteur, cela permet avant que la requête soit faite de modifier la configuration
axiosInstance.interceptors.request.use((config) => {
  // Récupération de l'utilisateur connecter en localStorage
  const user = LocalStorage.getItem('user');

  // Si il y a un utilisateur stocké
  if (user) {
    // Ajout de son token dans le header Authorization de la requête
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});
