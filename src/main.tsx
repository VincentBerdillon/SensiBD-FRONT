import React from 'react';
// ReactDom permet d'injecter notre application dans le DOM
import ReactDOM from 'react-dom/client';

import './styles/index.scss';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import store from './store';
import { router } from './routes';

// Création d'un élément root pour mon application
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// On injecte notre application dans le DOM
// On utilise un RouterProvider pour aiguiller notre application en fonction de l'url, chaque url correspond à un composant définis dans le `router`
root.render(
  <Provider store={store}>
    {/* on englobe l'application du provider de react-redux afin de fournir les données du store */}
    <RouterProvider router={router} />
  </Provider>
);
