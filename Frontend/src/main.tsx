import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './styles/index.css';

// Start MSW in development
async function enableMocking() {
  if (import.meta.env.DEV) {
    console.log('🔧 Starting MSW setup...');
    try {
      const { worker } = await import('./mocks/browser');
      console.log('📦 MSW worker imported successfully');
      
      await worker.start({
        onUnhandledRequest: 'warn',
      });
      
      console.log('🔶 Mock Service Worker started successfully');
      console.log('🎯 MSW will intercept requests to http://localhost:8000/*');
    } catch (error) {
      console.error('❌ MSW setup failed:', error);
    }
  }
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});