import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {Toaster} from 'react-hot-toast';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './reducer';

const store = configureStore({
  reducer:rootReducer
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <App/>
          <Toaster/>
        </NextThemesProvider>
      </NextUIProvider>
    </BrowserRouter>
  </Provider>
);