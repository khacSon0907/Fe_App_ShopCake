import { Typography, Box, Container } from "@mui/material";
import Banner from "../../components/Banner/Banner";
import Chatbox from "../../components/chatbox/chatbox";

export default function Home() {
  return (
    <Box>
        <Banner />

      <Container maxWidth="lg">

        <Typography color="text.primary" variant="h4" mt={4}>
          Đây là trang chủ Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Ipsa distinctio provident rerum tempora neque nesciunt! Expedita
          saepe consequuntur eaque, quo fugiat nesciunt, labore praesentium eum
          dolores rem ducimus maiores quis.
        </Typography>
      </Container>

      <Chatbox></Chatbox>
    </Box>
  );
}
