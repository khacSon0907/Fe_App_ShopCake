import { Typography, Box, Container } from "@mui/material";
import Banner from "../../components/Banner/Banner";
import Product from "../../components/Product/Product";

export default function Home() {
  return (
    <Box>
        <Banner />

      <Container maxWidth="lg">

 


        <Product/>
      </Container>

    </Box>
  );
}
