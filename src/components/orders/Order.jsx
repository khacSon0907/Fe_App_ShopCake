import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  IconButton,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  Fab,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Rating
} from '@mui/material';
import {
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  Cancel,
  Schedule,
  Refresh,
  Receipt,
  LocationOn,
  Payment,
  CalendarToday,
  ExpandMore,
  ExpandLess,
  Star,
  Inventory,
  LocalOffer
} from '@mui/icons-material';
import { getOrderbyUserId } from '../../services/userService';
import { useSelector } from 'react-redux';

const statusConfig = {
  PENDING: { 
    color: 'warning', 
    icon: <Schedule fontSize="small" />, 
    label: 'Chờ xử lý',
    bgColor: 'linear-gradient(135deg, #FFF8E1 0%, #FFF3C4 100%)',
    borderColor: '#FFB300',
    chipBg: '#FF8F00'
  },
  PROCESSING: { 
    color: 'info', 
    icon: <CircularProgress size={14} />, 
    label: 'Đang xử lý',
    bgColor: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    borderColor: '#2196F3',
    chipBg: '#1976D2'
  },
  SHIPPING: { 
    color: 'primary', 
    icon: <LocalShipping fontSize="small" />, 
    label: 'Đang giao hàng',
    bgColor: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
    borderColor: '#4CAF50',
    chipBg: '#388E3C'
  },
  DELIVERED: { 
    color: 'success', 
    icon: <CheckCircle fontSize="small" />, 
    label: 'Đã giao hàng',
    bgColor: 'linear-gradient(135deg, #E8F5E8 0%, #A5D6A7 100%)',
    borderColor: '#4CAF50',
    chipBg: '#2E7D32'
  },
  CANCELLED: { 
    color: 'error', 
    icon: <Cancel fontSize="small" />, 
    label: 'Đã hủy',
    bgColor: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
    borderColor: '#F44336',
    chipBg: '#D32F2F'
  }
};

const paymentMethodConfig = {
  COD: { 
    label: 'Thanh toán khi nhận hàng', 
    color: 'default',
    bgColor: '#E0E0E0',
    textColor: '#424242'
  },
  CREDIT_CARD: { 
    label: 'Thẻ tín dụng', 
    color: 'primary',
    bgColor: '#E3F2FD',
    textColor: '#1976D2'
  },
  MOMO: { 
    label: 'Ví MoMo', 
    color: 'secondary',
    bgColor: '#FCE4EC',
    textColor: '#C2185B'
  },
  BANKING: { 
    label: 'Chuyển khoản', 
    color: 'info',
    bgColor: '#E0F2F1',
    textColor: '#00796B'
  }
};

function OrderDetailsTable({ items }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2, mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Sản phẩm</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Đơn giá</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Số lượng</TableCell>
            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Thành tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow 
              key={index} 
              hover
              sx={{ 
                '&:hover': { backgroundColor: '#f9f9f9' },
                transition: 'background-color 0.2s ease'
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={item.image}
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: 2,
                      border: '2px solid #e0e0e0'
                    }}
                  />
                  <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                      {item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label={item.category || 'Danh mục'}
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                      {item.brand && (
                        <Chip
                          size="small"
                          label={item.brand}
                          variant="outlined"
                          sx={{
                            fontSize: '0.7rem',
                            height: 20
                          }}
                        />
                      )}
                    </Box>
                    {item.attributes && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {Object.entries(item.attributes).map(([key, value]) => 
                          `${key}: ${value}`
                        ).join(' • ')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" fontWeight={600} color="primary">
                  {formatPrice(item.price)}
                </Typography>
                {item.originalPrice && item.originalPrice > item.price && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ textDecoration: 'line-through', display: 'block' }}
                  >
                    {formatPrice(item.originalPrice)}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="center">
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 1
                }}>
                  <Inventory sx={{ fontSize: 16, color: '#666' }} />
                  <Typography variant="body2" fontWeight={600}>
                    {item.quantity}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body1" fontWeight={700} color="error">
                  {formatPrice(item.price * item.quantity)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[order.status] || {};
  const paymentMethod = paymentMethodConfig[order.paymentMethod] || {};

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateSubtotal = () => {
    return (order.items || []).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Card
      elevation={3}
      sx={{
        padding: 2,
        mb: 2,
        borderRadius: 2,
        border: `2px solid ${status.borderColor}`,
        background: status.bgColor,
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.12)'
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Đơn hàng #{order.id?.slice(-8)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <CalendarToday sx={{ fontSize: 14, color: '#666' }} />
              <Typography variant="caption" color="#666" fontWeight={500}>
                {formatDate(order.createdAt)}
              </Typography>
            </Box>
          </Box>
          <Chip
            icon={status.icon}
            label={status.label}
            size="small"
            sx={{
              fontSize: '0.75rem',
              backgroundColor: status.chipBg,
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}
          />
        </Box>

        {/* Items Summary */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="#555" fontWeight={600} gutterBottom>
            Sản phẩm ({order.items?.length || 0})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {(order.items || []).slice(0, 3).map((item, index) => (
              <Box key={index} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                backgroundColor: 'rgba(255,255,255,0.7)',
                borderRadius: 2,
                p: 1,
                border: '1px solid rgba(0,0,0,0.1)'
              }}>
                <Avatar
                  src={item.image}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography variant="caption" color="text.primary" fontWeight={500}>
                  {item.name} x{item.quantity}
                </Typography>
              </Box>
            ))}
            {order.items?.length > 3 && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.7)',
                borderRadius: 2,
                p: 1,
                border: '1px solid rgba(0,0,0,0.1)'
              }}>
                <Typography variant="caption" color="#666" fontWeight={500}>
                  +{order.items.length - 3} sản phẩm khác
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Quick Info */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: 2,
              p: 1.5,
              border: '1px solid rgba(0,0,0,0.1)'
            }}>
              <LocationOn sx={{ fontSize: 16, color: '#FF5722' }} />
              <Typography variant="caption" color="text.primary" fontWeight={500}>
                {order.shippingAddress}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: 2,
              p: 1.5,
              border: '1px solid rgba(0,0,0,0.1)'
            }}>
              <Payment sx={{ fontSize: 16, color: '#673AB7' }} />
              <Chip
                label={paymentMethod.label}
                size="small"
                sx={{
                  backgroundColor: paymentMethod.bgColor,
                  color: paymentMethod.textColor,
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Price Summary */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderRadius: 2,
          p: 1.5,
          border: '1px solid rgba(0,0,0,0.1)'
        }}>
          <Typography variant="body2" fontWeight={600}>
            Tổng tiền:
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            {order.discount > 0 && (
              <Typography variant="caption" color="#999" sx={{ textDecoration: 'line-through' }}>
                {formatPrice(order.totalPrice + order.discount)}
              </Typography>
            )}
            <Typography variant="body1" fontWeight={700} color="#E91E63">
              {formatPrice(order.totalPrice)}
            </Typography>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Receipt fontSize="small" />}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setExpanded(!expanded)}
            sx={{
              borderColor: status.borderColor,
              color: status.chipBg,
              '&:hover': {
                borderColor: status.chipBg,
                backgroundColor: `${status.chipBg}10`
              }
            }}
          >
            Chi tiết
          </Button>
          {order.status === 'DELIVERED' && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Star fontSize="small" />}
              sx={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)'
              }}
            >
              Đánh giá
            </Button>
          )}
          {order.status === 'PENDING' && (
            <Button
              variant="contained"
              size="small"
              startIcon={<Cancel fontSize="small" />}
              sx={{
                background: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)'
              }}
            >
              Hủy đơn
            </Button>
          )}
        </Box>

        {/* Expanded Details */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: status.chipBg }}>
              Chi tiết đơn hàng
            </Typography>
            
            {/* Product Details Table */}
            <OrderDetailsTable items={order.items || []} />
            
            {/* Order Summary */}
            <Paper elevation={1} sx={{ p: 2, mt: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: '#333' }}>
                Tóm tắt đơn hàng
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Tạm tính:</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatPrice(calculateSubtotal())}
                  </Typography>
                </Box>
                {order.shippingFee && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Phí vận chuyển:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatPrice(order.shippingFee)}
                    </Typography>
                  </Box>
                )}
                {order.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'green' }}>
                    <Typography variant="body2">
                      <LocalOffer sx={{ fontSize: 14, mr: 0.5 }} />
                      Giảm giá:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      -{formatPrice(order.discount)}
                    </Typography>
                  </Box>
                )}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" fontWeight={700}>Tổng cộng:</Typography>
                  <Typography variant="body1" fontWeight={700} color="error">
                    {formatPrice(order.totalPrice)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Additional Order Info */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Thông tin giao hàng
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Địa chỉ:</strong> {order.shippingAddress}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Người nhận:</strong> {order.recipientName || 'Chưa cập nhật'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Số điện thoại:</strong> {order.recipientPhone || 'Chưa cập nhật'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    Thông tin thanh toán
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phương thức:</strong> {paymentMethod.label}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Trạng thái:</strong> 
                    <Chip 
                      size="small" 
                      label={order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      color={order.paymentStatus === 'PAID' ? 'success' : 'warning'}
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  {order.notes && (
                    <Typography variant="body2">
                      <strong>Ghi chú:</strong> {order.notes}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default function Order() {
  const userId = useSelector((state) => state.user.data?.id);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrderbyUserId(userId);
      console.log(" respone" , response);
      
      setOrders(response.data || []);
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const filteredOrders = orders.filter(
    (order) => filter === 'ALL' || order.status === filter
  );

  const handleRefresh = () => {
    fetchOrders();
  };

  const filterOptions = [
    { value: 'ALL', label: 'Tất cả', count: orders.length, color: '#9C27B0' },
    { value: 'PENDING', label: 'Chờ xử lý', count: orders.filter(o => o.status === 'PENDING').length, color: '#FF9800' },
    { value: 'SHIPPING', label: 'Đang giao', count: orders.filter(o => o.status === 'SHIPPING').length, color: '#2196F3' },
    { value: 'DELIVERED', label: 'Đã giao', count: orders.filter(o => o.status === 'DELIVERED').length, color: '#4CAF50' },
    { value: 'CANCELLED', label: 'Đã hủy', count: orders.filter(o => o.status === 'CANCELLED').length, color: '#F44336' }
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pb: 6
    }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} color="white" gutterBottom>
            Đơn hàng của tôi
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.9)">
            Theo dõi và quản lý tất cả đơn hàng của bạn
          </Typography>
        </Box>

        <Paper elevation={6} sx={{ mb: 4, borderRadius: 3, background: 'rgba(255,255,255,0.95)' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {filterOptions.map(option => (
              <Button
                key={option.value}
                variant={filter === option.value ? 'contained' : 'text'}
                size="small"
                onClick={() => setFilter(option.value)}
                sx={{
                  borderRadius: 0,
                  py: 1.5,
                  px: 2,
                  flexGrow: 1,
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  background: filter === option.value
                    ? `linear-gradient(135deg, ${option.color} 0%, ${option.color}CC 100%)`
                    : 'transparent',
                  color: filter === option.value ? 'white' : '#666',
                  '&:hover': {
                    background: filter === option.value
                      ? `linear-gradient(135deg, ${option.color} 0%, ${option.color}CC 100%)`
                      : 'rgba(0,0,0,0.05)'
                  }
                }}
              >
                {option.label}
                <Chip
                  label={option.count}
                  size="small"
                  sx={{
                    ml: 1,
                    backgroundColor: filter === option.value ? 'rgba(255,255,255,0.3)' : option.color,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.65rem'
                  }}
                />
              </Button>
            ))}
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <CircularProgress size={40} sx={{ color: 'white' }} />
          </Box>
        ) : (
          <>
            {filteredOrders.length > 0 ? (
              <Box>
                {filteredOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </Box>
            ) : (
              <Paper elevation={6} sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 3,
                background: 'rgba(255,255,255,0.95)'
              }}>
                <ShoppingBag sx={{ fontSize: 60, color: '#ddd', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom fontWeight={600}>
                  Không có đơn hàng nào
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filter === 'ALL'
                    ? 'Bạn chưa có đơn hàng nào'
                    : `Không có đơn hàng ${filterOptions.find(o => o.value === filter)?.label.toLowerCase()}`}
                </Typography>
              </Paper>
            )}
          </>
        )}

        <Fab
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #FF5722 0%, #F44336 100%)',
            color: 'white',
            width: 48,
            height: 48,
            '&:hover': {
              background: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
              transform: 'scale(1.1)'
            }
          }}
          onClick={handleRefresh}
        >
          <Refresh sx={{ fontSize: 20 }} />
        </Fab>
      </Container>
    </Box>
  );
}