import { Provider } from 'react-redux';
import { store } from './store/store';
import AuthProvider from './components/AuthProvider';
import AppRoutes from './routes/AppRoutes';
import NotificationToast from './components/NotificationToast';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppRoutes />
        <NotificationToast />
      </AuthProvider>
    </Provider>
  );
}

export default App;
