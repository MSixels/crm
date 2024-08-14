import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import Login from './Pages/Login/Login.jsx';
import Home from './Pages/Home/Home.jsx';
import Modulo from './Pages/Modulo/Modulo.jsx';
import HomeCrm from './Pages/HomeCrm/HomeCrm.jsx';
import PerfilAluno from './Pages/PerfilAluno/PerfilAluno.jsx'

const router = createBrowserRouter([
  {
    path:`/`,
    element: <App />,
  },
  {
    path: `/login/:type`,
    element: <Login />,
  },
  {
    path: `/aluno/home`,
    element: <Home />,
  },
  {
    path: `/aluno/perfil`,
    element: <PerfilAluno />,
  },
  {
    path: `/aluno/:moduloid`,
    element: <Modulo />,
  },
  {
    path: `/professor/:page`,
    element: <HomeCrm />,
  },
  {
    path: `/professor`,
    element: <Navigate to="/professor/dashboard" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)

