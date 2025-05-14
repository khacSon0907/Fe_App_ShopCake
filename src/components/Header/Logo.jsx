import { Typography ,Chip} from "@mui/material";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
export default function Logo() {
  const navigate = useNavigate();

  return (
   <Typography
      variant="h5"
      sx={{ fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: 1 }}
      onClick={() => navigate("/")}
    >
      <img src={logo} alt="FE-Cake Logo" style={{ height: "80px" }} />
      
      <Typography fontSize={"large"}
        sx={{
                fontWeight: "bold", cursor: "pointer",color:"White",paddingLeft:5,paddingRight:10

        }}
      >
        CÁI LÒ NƯỚNG
      </Typography>
    </Typography>
  );
}
