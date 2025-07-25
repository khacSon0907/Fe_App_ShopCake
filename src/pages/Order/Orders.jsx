import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  AlertTitle,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  LocationOn as LocationOnIcon,
  ErrorOutline as ErrorIcon,
  Celebration as CelebrationIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

import { createOrder,updateUser } from '../../services/userService';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export default function Orders({ checkoutData, onBackToCart, user }) {

  // ⏫ Thêm phía trên cùng file (sau các import)
const sendDiscordNotification = async (orderData) => {
  const { userId, phoneNumber, shippingAddress, items, total, paymentMethod } = orderData;

  const content = `🎉 **ĐƠN HÀNG MỚI** 🎉
👤 **User ID**: \`${userId}\`
📞 **Số điện thoại**: ${phoneNumber}
📍 **Địa chỉ giao hàng**: ${shippingAddress}
💳 **Thanh toán**: ${paymentMethod}
💰 **Tổng tiền**: ${formatPrice(total)}

🧁 **Danh sách sản phẩm:**
${items.map((item, index) => 
  `  ${index + 1}. ${item.name} – SL: ${item.quantity} – Giá: ${formatPrice(item.price)}`
).join('\n')}
`;

  try {
    await fetch(
      'https://discord.com/api/webhooks/1398180327779733606/sWMzMD95sVuGX4a-8ATTENzbe2YC5IHRgulWL3SqfNkEqdzifbWJ08So9ZsYZldIFtk5',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      }
    );
    console.log('✅ Gửi Discord webhook thành công.');
  } catch (err) {
    console.warn('❌ Gửi Discord webhook thất bại:', err);
  }
};

  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    ward: '',
    district: '',
    city: ''
  });
  const [createOrderLoading, setCreateOrderLoading] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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

  console.log("user ", user);
  console.log(" order", orderSuccess);
  
  useEffect(() => {
    // Set default shipping address and phone if available
    if (user?.address) {
      setShippingAddress({
        street: user.address.street || '',
        ward: user.address.ward || '',
        district: user.address.district || '',
        city: user.address.city || ''
      });
    }
    if (user?.phoneNumber) {
      setPhoneNumber(user.phoneNumber);
    }
  }, [user]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    
    // Reset district and ward when city changes  
    if (name === 'city') {
      setShippingAddress({
        ...shippingAddress,
        city: value,
        district: "",
        ward: ""
      });
    }
    // Reset ward when district changes
    else if (name === 'district') {
      setShippingAddress({
        ...shippingAddress,
        district: value,
        ward: ""
      });
    }
    else {
      setShippingAddress({
        ...shippingAddress,
        [name]: value,
      });
    }
  };

  const formatAddressForAPI = () => {
    const { street, ward, district, city } = shippingAddress;
    const parts = [street, ward, district, city].filter(part => part.trim());
    return parts.join(', ') || "123 Thảo Điền, Quận 2, TP.HCM";
  };

  const isAddressComplete = () => {
    return shippingAddress.street.trim() && 
           shippingAddress.ward.trim() && 
           shippingAddress.district.trim() && 
           shippingAddress.city.trim();
  };

  const handleCreateOrder = async () => {
    try {
      setCreateOrderLoading(true);
      setError(null);
      
      // Check if user info has changed and update if needed
      const hasAddressChanged = 
        user?.address?.street !== shippingAddress.street ||
        user?.address?.ward !== shippingAddress.ward ||
        user?.address?.district !== shippingAddress.district ||
        user?.address?.city !== shippingAddress.city;
      
      const hasPhoneChanged = user?.phoneNumber !== phoneNumber;
      
      // Update user profile if info has changed
      if (hasAddressChanged || hasPhoneChanged) {
        try {
          const updatedUserData = {
            ...user,
            phoneNumber: phoneNumber,
            address: {
              street: shippingAddress.street,
              ward: shippingAddress.ward,
              district: shippingAddress.district,
              city: shippingAddress.city
            }
          };
          
          console.log('Updating user profile with:', updatedUserData);
          const res = await updateUser(updatedUserData);
          console.log(" update user ", res);
          
          console.log('User profile updated successfully');
        } catch (updateErr) {
          console.warn('Failed to update user profile:', updateErr);
          // Continue with order creation even if profile update fails
        }
      }
      
      // Prepare order data theo format API
      const orderData = {
        userId: user?.id,
        items: checkoutData.items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount || 0
        })),
        discount: checkoutData.discount || 0,
        shippingAddress: formatAddressForAPI(),
        paymentMethod: paymentMethod,
        phoneNumber: phoneNumber
      };
      
      console.log('Creating order with data:', orderData);
      
      // Gọi API tạo đơn hàng
      const response = await createOrder(orderData);
      
      console.log('Order created successfully:', response);
      
      const discord = await sendDiscordNotification({ ...orderData, total: checkoutData.total });
      console.log(" discord ", discord);
      
      // Hiển thị dialog thành công
      setOrderSuccess(true);
      setSuccessDialog(true);
      showSnackbar('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.', 'success');
      
    } catch (err) {
      console.error('Error creating order:', err);
      const errorMessage = err.response?.data?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.';
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setCreateOrderLoading(false);
    }
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialog(false);
    // Có thể redirect về trang chủ hoặc trang khác
    onBackToCart();
  };

  if (!checkoutData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Không có dữ liệu đặt hàng. Vui lòng quay lại giỏ hàng.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header */}
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBackToCart}
              variant="outlined"
              sx={{ mr: 2 }}
              disabled={createOrderLoading}
            >
              Quay lại giỏ hàng
            </Button>
            <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold">
              Xác nhận đơn hàng
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }} 
              onClose={() => setError(null)}
              icon={<ErrorIcon />}
            >
              <AlertTitle>Lỗi đặt hàng</AlertTitle>
              {error}
            </Alert>
          )}

          {/* Bảng tóm tắt sản phẩm */}
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Chi tiết đơn hàng ({checkoutData.selectedCount} sản phẩm)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Sản phẩm</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Đơn giá</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Số lượng</th>
                      <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Giảm giá</th>
                      <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkoutData.items.map((item) => (
                      <tr key={item.productId} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.name}
                          </Typography>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <Typography variant="body2">
                            {formatPrice(item.price)}
                          </Typography>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <Typography variant="body2" fontWeight="bold">
                            {item.quantity}
                          </Typography>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {item.discount > 0 ? (
                            <Chip
                              label={`-${item.discount}%`}
                              color="error"
                              size="small"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">-</Typography>
                          )}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <Typography variant="body1" fontWeight="bold" color="primary.main">
                            {formatPrice(item.finalPrice * item.quantity)}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>

              {/* Tổng kết */}
              <Box sx={{ mt: 3, pt: 2, borderTop: '2px solid #ddd' }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body1">Tạm tính:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatPrice(checkoutData.subtotal)}
                  </Typography>
                </Box>
                
                {checkoutData.discount > 0 && (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">Giảm giá:</Typography>
                    <Typography variant="body1" fontWeight="bold" color="error.main">
                      -{formatPrice(checkoutData.discount)}
                    </Typography>
                  </Box>
                )}
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body1">Phí vận chuyển:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    Miễn phí
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">
                    Tổng cộng:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {formatPrice(checkoutData.total)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Thông tin liên hệ */}
          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <PhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Thông tin liên hệ
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại liên hệ..."
                disabled={createOrderLoading}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </CardContent>
          </Card>

          {/* Địa chỉ giao hàng */}
          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Địa chỉ giao hàng
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Số nhà, tên đường"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleAddressChange}
                    placeholder="Ví dụ: 123 Nguyễn Huệ"
                    disabled={createOrderLoading}
                    variant="outlined"
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Thành phố</InputLabel>
                    <Select
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      label="Thành phố"
                      disabled={createOrderLoading}
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
                  <FormControl fullWidth variant="outlined" disabled={!shippingAddress.city || createOrderLoading} required>
                    <InputLabel>Quận/Huyện</InputLabel>
                    <Select
                      name="district"
                      value={shippingAddress.district}
                      onChange={handleAddressChange}
                      label="Quận/Huyện"
                    >
                      <MenuItem value="">-- Chọn quận/huyện --</MenuItem>
                      {getDistrictsForCity(shippingAddress.city).map((district) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" disabled={!shippingAddress.district || createOrderLoading} required>
                    <InputLabel>Phường/Xã</InputLabel>
                    <Select
                      name="ward"
                      value={shippingAddress.ward}
                      onChange={handleAddressChange}
                      label="Phường/Xã"
                    >
                      <MenuItem value="">-- Chọn phường/xã --</MenuItem>
                      {getWardsForDistrict(shippingAddress.city, shippingAddress.district).map((ward) => (
                        <MenuItem key={ward} value={ward}>
                          {ward}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Phương thức thanh toán */}
          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Phương thức thanh toán
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <FormControl fullWidth>
                <InputLabel>Chọn phương thức thanh toán</InputLabel>
                <Select 
                  value={paymentMethod} 
                  label="Chọn phương thức thanh toán"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={createOrderLoading}
                >
                  <MenuItem value="COD">Thanh toán khi nhận hàng (COD)</MenuItem>
                  <MenuItem value="BANK">Chuyển khoản ngân hàng</MenuItem>
                  <MenuItem value="CARD">Thanh toán bằng thẻ</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* Nút xác nhận */}
          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="outlined"
              size="large"
              onClick={onBackToCart}
              sx={{ px: 4, py: 2 }}
              disabled={createOrderLoading}
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleCreateOrder}
              disabled={createOrderLoading || !isAddressComplete() || !phoneNumber.trim()}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                minWidth: 200,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                }
              }}
            >
              {createOrderLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Đang xử lý...
                </>
              ) : (
                'Đồng ý đặt hàng'
              )}
            </Button>
          </Box>
        </Box>
      </Fade>

      {/* Dialog thành công */}
      <Dialog
        open={successDialog}
        onClose={handleCloseSuccessDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            textAlign: 'center',
            minWidth: 400,
          }
        }}
      >
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                animation: 'pulse 2s infinite'
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            
            <Typography variant="h5" fontWeight="bold" color="success.main" gutterBottom>
              Đặt hàng thành công!
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CelebrationIcon sx={{ color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                Đơn hàng của bạn đang được xử lý
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button 
            onClick={handleCloseSuccessDialog}
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
            }}
          >
            Hoàn tất
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={snackbarSeverity}
          sx={{ 
            width: '100%',
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </Container>
  );
}