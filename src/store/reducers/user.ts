import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axios';
import { LocalStorage } from '../../utils/LocalStorage';

// typage des données récupérées par le server à la connexion
type UserData = {
  pseudo: string;
  token: string;
  isLogged: boolean;
  role: number;
  userId: number;
};

type UserState = {
  pseudo?: string;
  token?: string;
  isLogged?: boolean;
  role?: number;
  credentials: { email: string; password: string };
  checked: boolean;
  isLoading: boolean;
  error?: string;
  userId?: number;
};

// Récupération des données de l'utilisateur dans le localStorage
const userData = LocalStorage.getItem('user');

//* Données initiales

export const initialState: UserState = {
  pseudo: undefined,
  token: undefined,
  role: undefined,
  isLogged: false,
  userId: undefined,
  credentials: {
    email: '',
    password: '',
  },
  isLoading: false,
  error: undefined,
  ...userData, // déversement des données du localsorage. Si null, rien, si utilisateur alors on écrase les données prédécentes
};

// fonction login
type LoginCredentials = { email: string; password: string };
export const login = createAsyncThunk(
  'LoginForm',
  async (credentials: LoginCredentials) => {
    try {
      const { data } = await axiosInstance.post<UserData>(
        '/users/login',
        credentials
      );
      // Je vais enregistrer dans le localStorage les données de l'utilisateur que me retourne l'API avec un setItem
      // comme ça au rafraichissement de la page, il reste connecté

      // Les infos sont stockées sur le navigateur en mode clé/valeur :
      // La clé me permet de pouvoir récupérer / modifier / supprimer la valeur
      // La valeur doit être une chaine de caractère. On transforme donc notre objet en chaines de caractères dans le fichier utils localstorage
      LocalStorage.setItem('user', data);

      // Je retourne les données récupérer depuis mon API qui seront récupérées par un getItem et déversées dans les données initiales
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

//* Création d'une slice pour gérer l'utilisateur connecté

const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeCredentialValue(
      state,
      action: PayloadAction<{
        textfieldName: keyof UserState['credentials']; // ici textfieldName 'email'|'password'
        value: string;
      }>
    ) {
      const { textfieldName, value } = action.payload;
      state.credentials[textfieldName] = value;
    },
    handleLogout(state) {
      // a la deconnection je supprime les infos de l'utilisateur dans le navigateur avec removeItem
      LocalStorage.removeItem('user');
      state.isLogged = false;
      state.pseudo = undefined;
      state.token = undefined;
      state.role = undefined;
      state.userId = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(login.rejected, (state) => {
      state.isLogged = false;
      state.isLoading = false;
      state.error = 'Identifiants incorrects';
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;

      if (action.payload) {
        state.pseudo = action.payload.pseudo;
        state.token = action.payload.token;
        state.isLogged = action.payload.isLogged;
        state.role = action.payload.role;
        state.userId = action.payload.userId;
      }
    });
  },
});

export const { changeCredentialValue, handleLogout } = userReducer.actions;
export default userReducer.reducer;
