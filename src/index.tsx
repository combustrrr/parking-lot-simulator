/**
 * Parking Lot Manager - Entry Point
 * 
 * This file initializes the React application, rendering the main App component
 * for the Parking Lot Manager, a dashboard for allocating vehicles using memory
 * allocation strategies.
 * 
 * @version 0.2.0
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
