import React from 'react';
import { Routes, Route, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import TaskDetail from './components/TaskDetail';
import SoftwareManager from './components/SoftwareManager';

function App() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Se l'utente non è autenticato, mostra il form di login
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Determina la pagina corrente in base al percorso
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.startsWith('/task')) return 'task';
    if (path.startsWith('/software')) return 'software';
    return 'dashboard';
  };

  const currentPage = getCurrentPage();

  const handlePageChange = (page: string) => {
    const newSearchParams = new URLSearchParams();
    setSearchParams(newSearchParams);
    navigate(page === 'dashboard' ? '/' : `/${page}`);
  };

  return (
    <Layout currentPage={currentPage} onPageChange={handlePageChange}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/task" element={<TaskManager />} />
        <Route path="/task/:taskId" element={<TaskDetail />} />
        <Route path="/software" element={<SoftwareManager />} />
      </Routes>
    </Layout>
  );
}

export default App;