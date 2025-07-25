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
import { useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle,getCurrentUser } from "../../services/userService";
import { CircularProgress } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Swal from "sweetalert2";
import { auth, provider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../../store/userSlice";

export default function Login() {
  const dispatch = useDispatch();

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      
      const idToken = await result.user.getIdToken();


      const res = await loginWithGoogle(idToken);

      console.log("res", res);
      
      const accessToken = res?.data?.accessToken || res?.accessToken;

      if (res.success && accessToken) {
        dispatch(setToken(accessToken));
        const userRes = await getCurrentUser();
        dispatch(setUser(userRes.data));
        if (
          userRes.data.role === "ADMIN") {  
          navigate("/admin");
        } else {
          navigate("/"); // user bình thường
        }
      } else {
        throw new Error(res.message || "Đăng nhập Google thất bại");
      }
    } catch (err) {

      console.log("err", err);
      
      const msg = err?.response?.data?.message || err.message;
      Swal.fire({
        icon: "error",
        title: "Đăng nhập Google thất bại",
        text: msg,
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const toggleShowPassWord = () => setShowPassword((prev) => !prev);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(form);
      const accessToken = res?.data?.accessToken;

      if (res.success && accessToken) {
        dispatch(setToken(accessToken));
        const userRes = await getCurrentUser();
        dispatch(setUser(userRes.data));
         if (
          userRes.data.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/"); // user bình thường
        }
      } else {
        throw new Error(res.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      Swal.fire({
        icon: "error",
        title: "Đăng Nhập thất bại",
        text:msg
      });
    } finally {
      setLoading(false); // Dù thành công hay thất bại đều tắt loading
    }
  };
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom align="center">
          Đăng Nhập
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
          
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 2, color: "text.primary" }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Đăng Nhập"
            )}
          </Button>

          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 2, color: "text.primary" }}
            onClick={handleRegister}
            disabled={loading}
          >
            Tạo tài khoản
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2, textTransform: "none" }}
            startIcon={<GoogleIcon />}
            onClick={handleLoginWithGoogle}
          >
            Đăng nhập với Google
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
