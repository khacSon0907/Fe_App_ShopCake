import { Typography } from "@mui/material";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
export default function Logo() {
  const navigate = useNavigate();

  return (
   <Typography
      variant="h6"
      sx={{ fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: 1 }}
      onClick={() => navigate("/")}
    >
      <img src={logo} alt="FE-Cake Logo" style={{ height: "80px" }} />
      FE-Cake
    </Typography>
  );
}
