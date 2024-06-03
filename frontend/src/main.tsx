import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, Route, RouterProvider} from "react-router-dom";
import App from './App.tsx'
import './index.css'
import Root from './shared/components/root.tsx';
import InstitutionRegistration from './pages/insitution/registration.tsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    children: [
      {
        path: 'register-institution',
        element: <App/>,
      },
      {
        path: 'register-student',
        element: <App/>,
      },
      {
        path: 'add-record',
        element: <App/>,
      }
    ]
  }, 
  {
    path: '/institution/registration',
    element: <InstitutionRegistration />,
  }
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
    
  </React.StrictMode>,
)
