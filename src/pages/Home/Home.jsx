import { Typography, Box, Container } from "@mui/material";
import Banner from "../../components/Banner/Banner";
import Product from "../../components/Product/Product";
import Chatbox from "../../components/chat/chatbox";
export default function Home() {
  return (
    <Box>
        <Banner />

         <Container maxWidth="lg">


        <Product/>
        <Chatbox/>
      </Container>

    </Box>
  );
}
