import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './AppRoutes';
import NavigationBar from './components/NavigationBar';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <NavigationBar />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;