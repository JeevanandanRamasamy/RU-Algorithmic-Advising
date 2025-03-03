import { useNavigate } from "react-router-dom";

function HomeButton() {
  const navigate = useNavigate();

  return <button onClick={() => navigate("/home")}>Go Home</button>;
}

export default HomeButton;
