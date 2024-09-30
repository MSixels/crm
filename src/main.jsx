import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import App from './App.jsx'
import Login from './Pages/Login/Login.jsx';
import RecuperarSenha from './Pages/RecuperarSenha/RecuperarSenha.jsx';
import Home from './Pages/Home/Home.jsx';
import Modulo from './Pages/Modulo/Modulo.jsx';
import HomeCrm from './Pages/HomeCrm/HomeCrm.jsx';
import PerfilAluno from './Pages/PerfilAluno/PerfilAluno.jsx'
import NewRastreio from './Components/HomeAluno/NewRastreio/NewRastreio.jsx';

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
    path: `/recuperar-senha`,
    element: <RecuperarSenha />,
  },
  {
    path: `/aluno/:page`,
    element: <Home />,
  },
  {
    path: `/aluno/rastreio/:page`,
    element: <NewRastreio />,
  },
  {
    path: `/aluno/perfil/:userId`,
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
    path: `/professor/perfil/:userId`,
    element: <PerfilAluno />,
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

