import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ErrorFallbackUI from './components/ErrorFallbackUI';
import { ErrorBoundary } from 'react-error-boundary';
import { PersistGate } from 'redux-persist/integration/react';
import Loader from './components/ui/loader';
import store, { persistor } from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from 'react-oidc-context';
import { oidcConfig } from './auth/oidcConfig';
import PreventBackNavigation from './components/PreventBackButton';

const App = () => {
  return (
    <div>
      <AuthProvider {...oidcConfig}>
        <BrowserRouter>
          <Provider store={store}>
            <PersistGate loading={<Loader />} persistor={persistor}>
              <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{ duration: 3000, position: 'top-right' }}
              />
              <PreventBackNavigation />
              <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000, position: 'top-right' }} />
              <ErrorBoundary fallback={<ErrorFallbackUI />}>
                <AppRoutes />
              </ErrorBoundary>
            </PersistGate>
          </Provider>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
