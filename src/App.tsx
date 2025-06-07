import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ErrorFallbackUI from './components/ErrorFallbackUI';
import { ErrorBoundary } from 'react-error-boundary';
const App = () => {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000, position: 'top-right' }} />
      <ErrorBoundary fallback={<ErrorFallbackUI />}>
        <AppRoutes />
      </ErrorBoundary>
    </div>
  );
};

export default App;
