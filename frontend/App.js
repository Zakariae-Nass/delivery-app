import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import store from './src/redux/store';
import { AppProvider } from './src/context/AppContext';
import StackNavigator from './src/navigation/StackNavigator';

/**
 * App.js — Point d'entrée de l'application.
 *
 * Ordre des providers (de l'extérieur vers l'intérieur) :
 *
 * 1. <Provider store={store}>
 *    → Rend le store Redux accessible à TOUS les composants via useSelector/useDispatch.
 *    → Doit être le plus haut possible dans l'arbre.
 *
 * 2. <AppProvider>
 *    → Context React pour les commandes et notifications (logique agence locale).
 *    → Reste inchangé.
 *
 * 3. <NavigationContainer>
 *    → Conteneur de navigation React Navigation.
 *    → Doit envelopper tous les navigateurs.
 *
 * 4. <StackNavigator>
 *    → Gère la navigation conditionnelle selon Redux state.auth.isLoggedIn
 */
export default function App() {
  return (
    <Provider store={store}>
      <AppProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </AppProvider>
    </Provider>
  );
}