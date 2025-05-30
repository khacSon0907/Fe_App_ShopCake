import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import Swal from "sweetalert2";
import { changePassword } from "../../services/userService"
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {

  const navigate = useNavigate();
  

  const [form, setForm] = useState({
    password: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await changePassword(form);
      if (res.success) {
        Swal.fire("Thành công", "Đổi mật khẩu thành công", "success");
        navigate("/")
      } else {
        throw new Error(res.message || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      Swal.fire("Lỗi", err?.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

   return (
    <Box
      sx={{
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Paper sx={{ p: 3, maxWidth: 400, width: "100%" }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" mb={2} align="center">
            Đổi mật khẩu
          </Typography>
          <TextField
            label="Mật khẩu cũ"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Mật khẩu mới"
            name="newPassword"
            type="password"
            fullWidth
            margin="normal"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Xác nhận đổi mật khẩu"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}