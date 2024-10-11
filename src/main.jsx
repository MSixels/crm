import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Login from './Pages/Login/Login.jsx';
import RecuperarSenha from './Pages/RecuperarSenha/RecuperarSenha.jsx';
import Home from './Pages/Home/Home.jsx';
import HomeCrm from './Pages/HomeCrm/HomeCrm.jsx';
import PerfilAluno from './Pages/PerfilAluno/PerfilAluno.jsx';
import NewRastreio from './Components/HomeAluno/NewRastreio/NewRastreio.jsx';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.jsx';
import Modulo from './Pages/Modulo/Modulo.jsx';
import VideoAula from './Components/ModuloAluno/VideoAula/VideoAula.jsx';

const router = createBrowserRouter([
  {
    path: `/`,
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
    element: (
      <ProtectedRoute
        element={<Home />}
        typeUser={3} 
        allowedTypes={[3]} 
      />
    ),
  },
  {
    path: `/aluno/modulo/:moduloId`,
    element: (
      <ProtectedRoute
        element={<Modulo />}
        typeUser={3} 
        allowedTypes={[3]} 
      />
    ),
  },
  {
    path: `/aluno/modulo/:moduloId/aula/:contentId`,
    element: (
      <ProtectedRoute
        element={<VideoAula />}
        typeUser={3}
        allowedTypes={[3]}
      />
    ),
  },
  {
    path: `/aluno/rastreio/:page`,
    element: (
      <ProtectedRoute
        element={<NewRastreio />}
        typeUser={3}
        allowedTypes={[3]} 
      />
    ),
  },
  {
    path: `/aluno/perfil/:userId`,
    element: (
      <ProtectedRoute
        element={<PerfilAluno />}
        typeUser={3} 
        allowedTypes={[3]} 
      />
    ),
  },
  {
    path: `/professor/:page`,
    element: (
      <ProtectedRoute
        element={<HomeCrm />}
        typeUser={2} 
        allowedTypes={[1, 2]} 
      />
    ),
  },
  {
    path: `/professor/perfil/:userId`,
    element: (
      <ProtectedRoute
        element={<PerfilAluno />}
        typeUser={2} 
        allowedTypes={[1, 2]} 
      />
    ),
  },
  {
    path: `/professor`,
    element: (
      <Navigate to="/professor/alunos" replace />
    ),
  },
  {
    path: `/aluno`,
    element: (
      <Navigate to="/aluno/home" replace />
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);