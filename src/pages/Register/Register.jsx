import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { registerUser } from "../../services/userService";
import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassWord = () => setShowPassword((prev) => !prev);
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
    if (form.phoneNumber.length < 9) {
      setLoading(false); // 👈 Thêm dòng này
      return Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại",
        text: "Số điện thoại không hợp lệ",
      });
    }

    try {
      const res = await registerUser(form);
      const token = res?.data?.token;

      if (res.success && token) {
        localStorage.setItem("registerToken", token); // ✅ lưu token tạm
        localStorage.setItem("registerEmail", form.email); // (optional) nếu cần dùng

        Swal.fire({
          icon: "success",
          title: "Đăng ký thành công!",
          text: "Chúng tôi đã gửi mã OTP đến email của bạn.",
          confirmButtonText: "Nhập mã OTP",
        }).then(() => {
          navigate("/verify-otp"); // ✅ chuyển trang
        });
      } else {
        throw new Error(res.message || "Đăng ký thất bại");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      Swal.fire({
        icon: "error",
        title: "Đăng ký thất bại",
        text: msg,
      });
    } finally {
      setLoading(false); // tắt loading
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
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassWord} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
