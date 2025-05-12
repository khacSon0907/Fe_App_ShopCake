import React from 'react'
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        color: "white",
        py: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="body2">
        © 2025 Tiệm Bánh FE-Cake. All rights reserved.
      </Typography>
    </Box>
  );
}

