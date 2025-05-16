

import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import { otpRegister } from "../../services/userService";
import { useNavigate } from "react-router-dom";

export default function OtpRegister() {
  const [otp, setOtp] = useState("");
  const token = localStorage.getItem("registerToken");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();
    console.log("token",token);
    
    try {
      const res = await otpRegister({ otp, token });
      if (res.success) {
        Swal.fire("Xác thực thành công!", "", res.message).then(()=>{
            navigate("/login")
            localStorage.removeItem("registerToken");
        });
        // redirect tới trang chính
      } else {
        throw new Error(res.message || "Sai mã OTP");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      Swal.fire("Lỗi", msg, "error");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom align="center">
          Nhập mã OTP
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            required
          />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
            Xác nhận
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
