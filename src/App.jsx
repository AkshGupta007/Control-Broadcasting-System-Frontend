import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { Route,Routes } from 'react-router-dom'
import LoginForm from './Pages/LoginPage'
import MainLayout from './Pages/MainLayout'
import ProtectedRoute from './Components/Common/ProtectedRoutes'
import TeacherDashboard from './Components/Teacher/TeacherDashboard'
import MyContentPage from './Components/Teacher/MyContentPage'
import UploadContentPage from './Components/Teacher/UploadContentPage'
import { setUserFromToken } from "./Slices/authSlice";
import PrincipalDashboard from './Components/Principal/PrincipalDashboard'
import ApprovalPage from './Components/Principal/ApprovalPage'
import AllContentPage from './Components/Principal/AllcontentPage'
import UnauthorizedPage from './Pages/UnauthorizedPage'
import LivePage from './Pages/Livepage'
function App() {
  const dispatch=useDispatch();
  // ── Persist login on page refresh ─────────────────────
useEffect(() => {
  const token = localStorage.getItem("token");

  const storedUser = localStorage.getItem("user");

  if (token && storedUser) {
    try {
      const user = JSON.parse(storedUser);

      dispatch(setUserFromToken(user));
    } catch (error) {
      localStorage.removeItem("token");

      localStorage.removeItem("user");
    }
  }
}, [dispatch]);

  

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />

        {/* <Route path="/teacher" element={<TeacherComponent />}></Route> */}

        /* ── Public ─────────────────────────────────────*/
        <Route path="/live/:teacherId" element={<LivePage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage/>} />

      

        /* ── Teacher (protected) ──────────────────────── */
        <Route
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/upload" element={<UploadContentPage />} />
          <Route path="/teacher/my-content" element={<MyContentPage />} />
        </Route>

        {/* ── Principal (protected) ────────────────────── */}
         { <Route
          element={
            <ProtectedRoute allowedRoles={["principal"]}>
              <MainLayout  />
            </ProtectedRoute>
          }
        > 
          <Route path="/principal/dashboard" element={<PrincipalDashboard />} />
          <Route
            path="/principal/approvals"
            element={<ApprovalPage />}
          />
          <Route path="/principal/content" element={<AllContentPage />} />
        </Route> }

        {/* ── Fallbacks ─────────────────────────────────── */}
        {/* <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </>
  );
}

export default App 
