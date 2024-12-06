import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
  ,
)
