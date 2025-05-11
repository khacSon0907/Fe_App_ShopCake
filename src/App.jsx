
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
export default function App() {
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ height: "100vh" }}
    >
      <Box
        sx={{
          width: "100%",
          height: "88px",
          backgroundColor: "primary.light",
          display: "flex",
          alignItems: "center",
        }}
      >
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "88px",
          backgroundColor: "primary.dark",
          display: "flex",
          alignItems: "center",
        }}
      >

        Panner Image
      </Box>
      <Box>
        Content

      </Box>
    </Container>
  );
}
