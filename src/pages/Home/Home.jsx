import { Typography,Box } from "@mui/material";
import Banner from "../../components/Banner/Banner";
export default function Home() {
  return (
    <Box>
      <Banner/>
      <Typography variant="h4" mt={4}>
        Đây là trang chủ 
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa distinctio provident rerum tempora neque nesciunt! Expedita saepe consequuntur eaque, quo fugiat nesciunt, labore praesentium eum dolores rem ducimus maiores quis.
      </Typography>
    </Box>
  );
}
