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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  LocationOn as LocationOnIcon,
  ErrorOutline as ErrorIcon,
  Celebration as CelebrationIcon,
} from '@mui/icons-material';

import { createOrder } from '../../services/userService';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export default function Orders({ checkoutData, onBackToCart, user }) {
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [shippingAddress, setShippingAddress] = useState('');
  const [createOrderLoading, setCreateOrderLoading] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  console.log("user ", user);
  console.log(" order", orderSuccess);
  

  useEffect(() => {
    // Set default shipping address if available
    if (user?.address) {
      setShippingAddress(user.address);
    }
  }, [user]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCreateOrder = async () => {
    try {
      setCreateOrderLoading(true);
      setError(null);
      
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
        shippingAddress: shippingAddress || "123 Thảo Điền, Quận 2, TP.HCM",
        paymentMethod: paymentMethod
      };
      
      console.log('Creating order with data:', orderData);
      
      // Gọi API tạo đơn hàng
      const response = await createOrder(orderData);
      
      console.log('Order created successfully:', response);
      
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

          {/* Địa chỉ giao hàng */}
          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Địa chỉ giao hàng
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <TextField
                fullWidth
                label="Địa chỉ giao hàng"
                multiline
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Nhập địa chỉ giao hàng chi tiết..."
                disabled={createOrderLoading}
                variant="outlined"
              />
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
              disabled={createOrderLoading || !shippingAddress.trim()}
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