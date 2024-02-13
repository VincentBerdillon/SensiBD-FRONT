import { createBrowserRouter } from 'react-router-dom';
import App from './components/App/App';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import AddPostPage from './components/AddPostPage/AddPostPage';
import SignupPage from './components/SignupPage/SignupPage';
import UserProfilePage from './components/ProfilPage/ProfilPage';
import CreditPage from './components/CreditPage/CreditPage';
import ConversationPage from './components/ConversationPage/ConversationPage';
import DiscussionsPage from './components/DiscussionsPage/DiscussionsPage';
import Error from './components/ErrorPage/ErrorPage';
// eslint-disable-next-line import/prefer-default-export
export const router = createBrowserRouter([
  {
    // path correspond à l'url
    path: '/',
    // l'élément JSX à afficher sur cette page
    element: <App />,
    // En cas d'erreur, on pourra spécifier un composant à afficher
    errorElement: <Error />,

    // En fonction de certaines url, on peut afficher certains composants enfants qui prendront la place de l'élément outlet
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/addPost',
        element: <AddPostPage />,
      },
      {
        path: '/profil',
        element: <UserProfilePage />,
      },

      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/credits',
        element: <CreditPage />,
      },
      {
        path: '/messages/:postId/:userId',
        element: <ConversationPage />,
      },
      {
        path: '/messages',
        element: <DiscussionsPage />,
      },
    ],
  },
]);
