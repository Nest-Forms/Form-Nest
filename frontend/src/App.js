import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './AppRoutes';
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavigationBar />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
