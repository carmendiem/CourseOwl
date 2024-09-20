import { useNavigate } from "react-router-dom";

export const HomePage = () => {
    const navigate = useNavigate()
    return(
        <button onClick={() => navigate("/calendar")}>go to schedule page</button>
    );
}