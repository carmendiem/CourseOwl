import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../components/Login";
import Signup from "../components/Signup";
import ProfessorDetails from '../components/ProfessorDetails';
import CourseDetails from '../components/CourseDetails';
import Alerts from '../pages/Alerts'; 
import Forums from '../pages/Forums'; 
import Courses from '../pages/Courses'; 
import NotFound from "../pages/NotFound"; 
import { ProtectedRoute } from "./ProtectedRoute";
import ForumDetails from "../components/Forum/ForumDetails";

export function Rout({ setIsLoggedIn, isLoggedIn }) {
    return (
        <Routes>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
            <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />

            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/professor/:alias" element={<ProfessorDetails />} />
            <Route path="/course/:course_code" element={<CourseDetails />} />
            {/* change to use forum code later */}
            <Route
                path="/forum/:forumId"
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <ForumDetails />
                    </ProtectedRoute>
                }
            /> 

            <Route 
                path="/alerts" 
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <Alerts />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/forums" 
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <Forums />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/courses" 
                element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                        <Courses />
                    </ProtectedRoute>
                } 
            />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
