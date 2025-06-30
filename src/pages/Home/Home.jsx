import { Typography, Box, Container } from "@mui/material";
import Banner from "../../components/Banner/Banner";
import Product from "../../components/Product/Product";
import Chatbox from "../../components/BoxDify/Chatbox";
export default function Home() {
  return (
    <Box>
        <Banner />

         <Container maxWidth="lg">

        <Chatbox/>
        <Product/>
      </Container>

    </Box>
  );
}
