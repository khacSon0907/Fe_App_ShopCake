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
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { PhotoCamera, Person, LocationOn, Phone, Cake } from "@mui/icons-material";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getCurrentUser, updateUser } from "../../services/userService";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

export default function UserProfile() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullname: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    avatarUrl: "",
    address: {
      street: "",
      ward: "",
      district: "",
      city: "",
    },
  });

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  const cityDistricts = {
    "TP Hồ Chí Minh": {
      "Quận 1": [
        "Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Kho", "Phường Cầu Ông Lãnh",
        "Phường Cô Giang", "Phường Đa Kao", "Phường Nguyễn Cư Trinh", "Phường Nguyễn Thái Bình",
        "Phường Phạm Ngũ Lão", "Phường Tân Định"
      ],
      "Quận 3": [
        "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6",
        "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12",
        "Phường 13", "Phường 14"
      ],
      "Quận 5": [
        "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6",
        "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12",
        "Phường 13", "Phường 14", "Phường 15"
      ],
      "Quận 7": [
        "Phường Bình Thuận", "Phường Phú Mỹ", "Phường Phú Thuận", "Phường Tân Hưng",
        "Phường Tân Kiểng", "Phường Tân Phong", "Phường Tân Phú", "Phường Tân Quy"
      ],
      "Quận 10": [
        "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6",
        "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12",
        "Phường 13", "Phường 14", "Phường 15"
      ],
      "Quận Tân Bình": [
        "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6",
        "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12",
        "Phường 13", "Phường 14", "Phường 15"
      ],
      "Quận Bình Thạnh": [
        "Phường 1", "Phường 2", "Phường 3", "Phường 5", "Phường 6", "Phường 7",
        "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 17",
        "Phường 19", "Phường 21", "Phường 22", "Phường 24", "Phường 25", "Phường 26",
        "Phường 27", "Phường 28"
      ],
      "Thành phố Thủ Đức": [
        "Phường An Khánh", "Phường An Lợi Đông", "Phường An Phú", "Phường Bình Chiểu",
        "Phường Bình Thọ", "Phường Bình Trưng Đông", "Phường Bình Trưng Tây",
        "Phường Cát Lái", "Phường Hiệp Bình Chánh", "Phường Hiệp Bình Phước",
        "Phường Linh Chiểu", "Phường Linh Đông", "Phường Linh Tây", "Phường Linh Trung",
        "Phường Linh Xuân", "Phường Long Bình", "Phường Long Phước", "Phường Long Thạnh Mỹ",
        "Phường Long Trường", "Phường Phú Hữu", "Phường Phước Bình", "Phường Phước Long A",
        "Phường Phước Long B", "Phường Tam Bình", "Phường Tam Phú", "Phường Thạnh Mỹ Lợi",
        "Phường Thảo Điền", "Phường Thủ Thiêm", "Phường Trường Thạnh", "Phường Trường Thọ"
      ]
    },
    "Hà Nội": {
      "Quận Ba Đình": [
        "Phường Cống Vị", "Phường Điện Biên", "Phường Đội Cấn", "Phường Giảng Võ",
        "Phường Kim Mã", "Phường Liễu Giai", "Phường Ngọc Hà", "Phường Ngọc Khánh",
        "Phường Nguyễn Trung Trực", "Phường Phúc Xá", "Phường Quán Thánh", "Phường Thành Công",
        "Phường Trúc Bạch", "Phường Vĩnh Phúc"
      ],
      "Quận Hoàn Kiếm": [
        "Phường Chương Dương Độ", "Phường Cửa Đông", "Phường Cửa Nam", "Phường Đồng Xuân",
        "Phường Hàng Bạc", "Phường Hàng Bài", "Phường Hàng Bồ", "Phường Hàng Bông",
        "Phường Hàng Buồm", "Phường Hàng Đào", "Phường Hàng Gai", "Phường Hàng Mã",
        "Phường Hàng Trống", "Phường Lý Thái Tổ", "Phường Phan Chu Trinh", "Phường Phúc Tân",
        "Phường Tràng Tiền", "Phường Trần Hưng Đạo"
      ]
    }
  };

  const getDistrictsForCity = (city) => {
    return cityDistricts[city] ? Object.keys(cityDistricts[city]) : [];
  };

  const getWardsForDistrict = (city, district) => {
    return cityDistricts[city] && cityDistricts[city][district] 
      ? cityDistricts[city][district] 
      : [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCurrentUser();
        const user = res.data;
        setInitialData(user);
        setForm({
          ...user,
          address: {
            street: user.address?.street || "",
            ward: user.address?.ward || "",
            district: user.address?.district || "",
            city: user.address?.city || "",
          },
        });
        dispatch(setUser(user));
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    
    // Reset district and ward when city changes  
    if (name === 'city') {
      setForm({
        ...form,
        address: {
          ...form.address,
          city: value,
          district: "",
          ward: ""
        },
      });
    }
    // Reset ward when district changes
    else if (name === 'district') {
      setForm({
        ...form,
        address: {
          ...form.address,
          district: value,
          ward: ""
        },
      });
    }
    else {
      setForm({
        ...form,
        address: {
          ...form.address,
          [name]: value,
        },
      });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, avatarUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarFile = null;
      if (form.avatarUrl && form.avatarUrl.startsWith("data:")) {
        const blob = await fetch(form.avatarUrl).then((r) => r.blob());
        avatarFile = new File([blob], "avatar.jpg", { type: blob.type });
      }
      const res = await updateUser({ ...form, avatarFile });
      if (res && res.data) {
        dispatch(setUser(res.data));
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
      setForm({
        ...initialData,
        address: {
          street: initialData.address?.street || "",
          ward: initialData.address?.ward || "",
          district: initialData.address?.district || "",
          city: initialData.address?.city || "",
        },
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        Thông Tin Cá Nhân
      </Typography>
      
      <Grid container spacing={4}>
        {/* Avatar Section */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: 'fit-content' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar 
                src={form.avatarUrl} 
                sx={{ 
                  width: 160, 
                  height: 160, 
                  mx: 'auto', 
                  mb: 2,
                  border: '4px solid #f0f0f0'
                }} 
              />
              <label htmlFor="avatar-upload">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  sx={{ mt: 1 }}
                >
                  Thay đổi ảnh
                </Button>
              </label>
            </CardContent>
          </Card>
        </Grid>

        {/* Form Section */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                
                {/* Personal Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Person sx={{ mr: 1 }} />
                    Thông tin cá nhân
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Họ và tên"
                        name="fullname"
                        value={form.fullname}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Số điện thoại"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <RadioGroup
                          row
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          sx={{ mt: 1 }}
                        >
                          <FormControlLabel value="male" control={<Radio />} label="Nam" />
                          <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Ngày sinh"
                        name="dateOfBirth"
                        type="date"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: <Cake sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Address Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocationOn sx={{ mr: 1 }} />
                    Địa chỉ
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        label="Số nhà, tên đường"
                        name="street"
                        value={form.address.street}
                        onChange={handleAddressChange}
                        fullWidth
                        variant="outlined"
                        placeholder="Ví dụ: 123 Nguyễn Huệ"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Thành phố</InputLabel>
                        <Select
                          name="city"
                          value={form.address.city}
                          onChange={handleAddressChange}
                          label="Thành phố"
                        >
                          <MenuItem value="">-- Chọn thành phố --</MenuItem>
                          {Object.keys(cityDistricts).map((city) => (
                            <MenuItem key={city} value={city}>
                              {city}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant="outlined" disabled={!form.address.city}>
                        <InputLabel>Quận/Huyện</InputLabel>
                        <Select
                          name="district"
                          value={form.address.district}
                          onChange={handleAddressChange}
                          label="Quận/Huyện"
                        >
                          <MenuItem value="">-- Chọn quận/huyện --</MenuItem>
                          {getDistrictsForCity(form.address.city).map((district) => (
                            <MenuItem key={district} value={district}>
                              {district}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth variant="outlined" disabled={!form.address.district}>
                        <InputLabel>Phường/Xã</InputLabel>
                        <Select
                          name="ward"
                          value={form.address.ward}
                          onChange={handleAddressChange}
                          label="Phường/Xã"
                        >
                          <MenuItem value="">-- Chọn phường/xã --</MenuItem>
                          {getWardsForDistrict(form.address.city, form.address.district).map((ward) => (
                            <MenuItem key={ward} value={ward}>
                              {ward}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={handleCancel}
                    size="large"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading}
                    size="large"
                    sx={{ minWidth: 120 }}
                  >
                    {loading ? "Đang lưu..." : "Lưu"}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}