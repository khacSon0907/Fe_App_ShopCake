import { Typography,Box } from "@mui/material";
import logoPanner from "../../assets/logoPanner.png"
export default function Home() {
  return (
    <Box>
      <Box
        component="img"
        src={logoPanner}
        alt="Banner Trang Chủ"
        sx={{
          width: "100%",
          height: "auto",
          maxHeight: "500px", // tuỳ chỉnh chiều cao tối đa
          objectFit: "cover",
        }}
      />
      <Typography variant="h4" mt={4}>
        Đây là trang chủ
      </Typography>
    </Box>
  );
}
