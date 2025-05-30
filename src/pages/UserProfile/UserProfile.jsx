import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputLabel,
  Paper,
  TextField,
  Typography,
  Avatar,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getCurrentUser, updateUser } from "../../services/userService";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice"; // 👈

export default function UserProfile() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullname: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    avatarUrl: "",
    address: "",
  });

  const [initialData, setInitialData] = useState(null); // ⭐ dữ liệu gốc ban đầu

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCurrentUser();
        setInitialData(res.data); // ⭐ lưu lại bản gốc
        setForm(res.data);
        dispatch(setUser(res.data)); // 👈 cập nhật vào Redux luôn khi load
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi khi tải thông tin user",
          text: error?.message || "Không thể tải dữ liệu người dùng",
        });
      }
    };
    fetchData();
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, avatarUrl: reader.result }); // Preview
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarFile = null;

      if (form.avatarUrl.startsWith("data:")) {
        const blob = await fetch(form.avatarUrl).then((r) => r.blob());
        avatarFile = new File([blob], "avatar.jpg", { type: blob.type });
      }

      const res = await updateUser({ ...form, avatarFile });

      if (res && res.data) {
        dispatch(setUser(res.data)); // ⭐ Cập nhật vào Redux khi cập nhật thành công
      }

      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: err?.response?.data?.message || "Không thể cập nhật",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (initialData) {
      setForm(initialData);
    }
  };

  return (
    <Container maxWidth="md" sx={{ paddingTop: "30px" }}>
      <Paper
        elevation={3}
        sx={{ mt: 8, display: "flex", justifyContent: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            p: 4,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 300,
              backgroundColor: "#f5f5f5",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
              borderRadius: 2,
              mr: { sm: 4 },
              mb: { xs: 4, sm: 0 },
            }}
          >
            <Avatar
              src={form.avatarUrl}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <label htmlFor="avatar-upload">
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              Thông Tin Cá Nhân
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Họ và tên"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Số điện thoại"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputLabel>Giới tính</InputLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Nam"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Nữ"
                  />
                </RadioGroup>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ngày sinh"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Địa chỉ"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={handleCancel}
                  >
                    Hủy
                  </Button>
                  <Button variant="text" color="secondary">
                    Hủy
                  </Button>
                  <Button type="submit" variant="contained" disabled={loading}>
                    Lưu
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
