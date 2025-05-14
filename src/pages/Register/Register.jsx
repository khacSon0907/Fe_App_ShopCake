import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { registerUser } from "../../services/userService";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // để chuyển trang

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // bật loading

    try {
      const data = await registerUser(form);
      console.log("data",data);
      
      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        text: "Chúng tôi đã gửi mã OTP đến email của bạn.",
        confirmButtonText: "Nhập mã OTP",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/verify-otp");
        }
      });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      console.log("msg",msg);
      alert("Lỗi: " + msg);
      Swal.fire({
        icon: "error",
        title: "Lỗi đăng ký",
        text: msg,
      });
    } finally {
      setLoading(false); // tắt loading sau khi xong
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom align="center">
          Tạo tài khoản mới
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Họ Tên "
            name="fullname"
            fullWidth
            margin="normal"
            value={form.fullname}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Số điện thoại"
            name="phoneNumber"
            type="number"
            fullWidth
            margin="normal"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Đăng ký"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
