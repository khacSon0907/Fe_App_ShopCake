import { Typography ,Chip} from "@mui/material";
// import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import BakeryDiningIcon from '@mui/icons-material/BakeryDining'; 
export default function Logo() {
  const navigate = useNavigate();

  return (
   <Typography
      variant="h5"
      sx={{ 
        color:"text.secondary",
        fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: 1 }}
      onClick={() => navigate("/")}
    >
         <BakeryDiningIcon sx={{ fontSize: 48 }} /> 
      <Typography fontWeight="bold" fontSize="large">
        CÁI LÒ NƯỚNG
      </Typography>
    </Typography>
  );
}
