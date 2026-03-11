import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetailsPage from "./features/projects/pages/ProjectDetailsPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import TaskDetailsPage from "./features/tasks/components/TaskDetailsPage";
import BoardPage from "./features/tasks/pages/BoardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected Routes - wrapped in MainLayout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          {/* Redirect root to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
          <Route path="projects/:projectId/tasks" element={<BoardPage title="Tasks" taskTypes={['STORY', 'BUG', 'TASK', 'DEFECT', 'SUBTASK']} createButtonLabel="+ New Task" />} />
          <Route path="projects/:projectId/tasks/:taskId" element={<TaskDetailsPage />} />
          <Route path="projects/:projectId/epics" element={<BoardPage title="Epics" taskTypes={['EPIC']} createButtonLabel="+ New Epic" />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
