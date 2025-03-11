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
import ModuloConteudo from './Pages/ModuloConteudo/ModuloConteudo.jsx';
import ComponentLimitado from './Components/ComponentLimitado/ComponentLimitado.jsx';
import FirstAccess from './Pages/FirstAccess/FirstAccess.jsx';
import FirstAccessEmail from './Pages/FirstAccessEmail/FirstAccessEmail.jsx'
import EmailProtectedRoute from './Components/EmailProtectedRoute/EmailProtectedRoute.jsx';
import ProfessionalDataProtectedRoute from './Components/ProfessionalDataProtectedRoute/ProfessionalDataProtectedRoute.jsx'
import FirstAccessProfessionalData from './Pages/FirstAccessProfessionalData/FirstAccessProfessionalData.jsx';
import PasswordDataProtectedRoute from './Components/PasswordDataProtectedRoute/PasswordDataProtectedRoute.jsx';
import FirstAccessPassword from './Pages/FirstAccessPassword/FirstAccessPassword.jsx';
//import StoryTelling from './Components/ModuloAluno/Storytelling/Storytelling.jsx';

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
    path: `/login/aluno/primeiro-acesso`,
    element: <FirstAccess />,
  },
  {
    path: `/login/aluno/primeiro-acesso/email`,
    element: (
      <EmailProtectedRoute 
        element={<FirstAccessEmail />} 
      />
    ),
  },
  {
    path: '/login/aluno/primeiro-acesso/professional-data',
    element: (
      <ProfessionalDataProtectedRoute 
        element={<FirstAccessProfessionalData />}
      />
    )
  },
  {
    path: '/login/aluno/primeiro-acesso/password',
    element: (
      <PasswordDataProtectedRoute 
        element={<FirstAccessPassword />}
      />
    )
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
    path: `/aluno/modulo/:moduloId/:type`,
    element: (
      <ProtectedRoute
        element={<Modulo />}
        typeUser={3} 
        allowedTypes={[3]} 
      />
    ),
  },
  {
    path: `/aluno/modulo/:moduloId/:conteudoId/:type/:materialId`,
    element: (
      <ProtectedRoute
        element={<ModuloConteudo />}
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
    path: `/professor/storytelling/:conteudoId`,
    element: (
      <ProtectedRoute
        element={<HomeCrm />}
        typeUser={2} 
        allowedTypes={[1, 2]} 
      />
    ),
  },
  {
    path: `/professor/modulos/:moduloId`,
    element: (
      <ProtectedRoute
        element={<HomeCrm />}
        typeUser={2} 
        allowedTypes={[1, 2]} 
      />
    ),
  },
  {
    path: `/professor/modulos/:moduloId/:pagetype`,
    element: (
      <ProtectedRoute
        element={<HomeCrm />}
        typeUser={2} 
        allowedTypes={[1, 2]} 
      />
    ),
  },
  {
    path: `/professor/modulos/:moduloId/:type/:materialId`,
    element: (
      <ProtectedRoute
        element={<HomeCrm />}
        typeUser={2} 
        allowedTypes={[1, 2]} 
      />
    ),
  },
  {
    path: `/professor/route-secret`,
    element: (
      <ProtectedRoute
        element={<ComponentLimitado />}
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
      <ProtectedRoute
        element={<Navigate to="/professor/alunos" replace />}
        typeUser={2} 
        allowedTypes={[1, 2]} 
      />
    ),
  },
  {
    path: `/aluno`,
    element: (
      <ProtectedRoute
        element={<Navigate to="/aluno/home" replace />}
        typeUser={3} 
        allowedTypes={[3]} 
      />
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