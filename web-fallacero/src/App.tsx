import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/denuncias" element={React.createElement(React.lazy(() => import('./pages/Denuncias')))} />
                            <Route path="/denuncia/new" element={React.createElement(React.lazy(() => import('./pages/DenunciaForm')))} />
                            <Route path="/evidencias" element={React.createElement(React.lazy(() => import('./pages/EvidenciasList')))} />
                            <Route path="/evidencias/new" element={React.createElement(React.lazy(() => import('./pages/EvidenciaForm')))} />
                            <Route path="/det-evidencias" element={React.createElement(React.lazy(() => import('./pages/DetEvidenciasList')))} />
                            <Route path="/det-evidencias/new" element={React.createElement(React.lazy(() => import('./pages/DetEvidenciaForm')))} />
                            <Route path="/historiales" element={React.createElement(React.lazy(() => import('./pages/Historiales')))} />
                            <Route path="/historiales/new" element={React.createElement(React.lazy(() => import('./pages/HistorialForm')))} />
                            <Route path="/usuarios" element={React.createElement(React.lazy(() => import('./pages/UsuariosList')))} />
                            <Route path="/usuarios/new" element={React.createElement(React.lazy(() => import('./pages/UsuarioForm')))} />
                            <Route path="/servidores" element={React.createElement(React.lazy(() => import('./pages/ServidoresList')))} />
                            <Route path="/servidores/new" element={React.createElement(React.lazy(() => import('./pages/ServidorForm')))} />
                            <Route path="/ciudadanos" element={React.createElement(React.lazy(() => import('./pages/CiudadanosList')))} />
                            <Route path="/ciudadanos/new" element={React.createElement(React.lazy(() => import('./pages/CiudadanoForm')))} />
                            <Route path="/roles" element={React.createElement(React.lazy(() => import('./pages/RolesList')))} />
                            <Route path="/roles/new" element={React.createElement(React.lazy(() => import('./pages/RolForm')))} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
};

export default App;
