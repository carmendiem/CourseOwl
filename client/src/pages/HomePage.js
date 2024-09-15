import { useNavigate } from "react-router-dom";

export const HomePage = () => {
    const navigate = useNavigate()
    return(
        <button onClick={() => navigate("/example")}>go to schedule page</button>
    );
}