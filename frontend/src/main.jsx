import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { SiteProvider } from './contexts/SiteContext';
import { UiProvider } from './contexts/UiContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <UiProvider>
          <AuthProvider>
            <SiteProvider>
              <App />
            </SiteProvider>
          </AuthProvider>
        </UiProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
