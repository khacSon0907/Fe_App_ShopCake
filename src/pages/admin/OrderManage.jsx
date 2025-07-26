import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material';

import {
  Receipt as ReceiptIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  DateRange as DateRangeIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Payment as PaymentIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

import {getAllOrders,updateOrderStatus} from '../../services/userService';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
    case 'UNCONFIRMED':
      return 'warning';
    case 'CONFIRMED':
      return 'info';
    case 'PROCESSING':
      return 'primary';
    case 'SHIPPING':
      return 'secondary';
    case 'DELIVERED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'PENDING':
    case 'UNCONFIRMED':
      return 'Chờ xử lý';
    case 'CONFIRMED':
      return 'Đã xác nhận';
    case 'PROCESSING':
      return 'Đang chuẩn bị';
    case 'SHIPPING':
      return 'Đang giao';
    case 'DELIVERED':
      return 'Đã giao';
    case 'CANCELLED':
      return 'Đã hủy';
    default:
      return status;
  }
};

export default function OrderManage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllOrders();
        
        console.log('API Response:', response); // Debug log
        
        // Check if response has data and it's an array
        let ordersData = [];
        if (response && response.data && Array.isArray(response.data)) {
          ordersData = response.data;
        } else if (response && Array.isArray(response)) {
          ordersData = response;
        } else {
          console.warn('Unexpected API response structure:', response);
          ordersData = [];
        }
        
        // Sort orders by creation date (newest first)
        const sortedOrders = ordersData.sort((a, b) => 
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = orders;
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phoneNumber?.includes(searchTerm) ||
        order.shippingAddress?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    if (paymentFilter) {
      filtered = filtered.filter(order => order.paymentMethod === paymentFilter);
    }
    
    // Sort filtered results by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setEditDialogOpen(true);
  };

 const handleUpdateStatus = async (newStatus) => {
  if (!selectedOrder) return;

  try {
    setLoading(true);
    await updateOrderStatus(selectedOrder.id, newStatus);

    // Update local list of orders
    const updatedOrders = orders.map(order =>
      order.id === selectedOrder.id
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    );

    setOrders(updatedOrders);
    setEditDialogOpen(false);
    setSelectedOrder(null);
  } catch (err) {
    console.error('Lỗi cập nhật trạng thái:', err);
    alert('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
  } finally {
    setLoading(false);
  }
};


  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPaymentFilter('');
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Thử lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header */}
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <ReceiptIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold">
              Quản lý đơn hàng
            </Typography>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" color="white" fontWeight="bold">
                        {orders.filter(o => o.status === 'PENDING' || o.status === 'UNCONFIRMED').length}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Chờ xử lý
                      </Typography>
                    </Box>
                    <ScheduleIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(45deg, #4ECDC4 30%, #6EE7E0 90%)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" color="white" fontWeight="bold">
                        {orders.filter(o => o.status === 'PROCESSING' || o.status === 'CONFIRMED').length}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Đang xử lý
                      </Typography>
                    </Box>
                    <ShoppingCartIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(45deg, #45B7D1 30%, #67C5E0 90%)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" color="white" fontWeight="bold">
                        {orders.filter(o => o.status === 'SHIPPING').length}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Đang giao
                      </Typography>
                    </Box>
                    <LocationOnIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(45deg, #96CEB4 30%, #B3DBC7 90%)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" color="white" fontWeight="bold">
                        {orders.filter(o => o.status === 'DELIVERED').length}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Hoàn thành
                      </Typography>
                    </Box>
                    <ReceiptIcon sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Bộ lọc
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Tìm kiếm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Mã đơn, tên khách hàng, SĐT..."
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Trạng thái"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="UNCONFIRMED">Chờ xác nhận</MenuItem>
                      <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
                      <MenuItem value="SHIPPING">Đang giao</MenuItem>
                      <MenuItem value="COMPLETED">Đã Giao</MenuItem>
                      <MenuItem value="CANCELLED">Đã hủy</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Thanh toán</InputLabel>
                    <Select
                      value={paymentFilter}
                      label="Thanh toán"
                      onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                      <MenuItem value="">Tất cả</MenuItem>
                      <MenuItem value="COD">COD</MenuItem>
                      <MenuItem value="BANK">Chuyển khoản</MenuItem>
                      <MenuItem value="CARD">Thẻ</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={2}>
                  <Button 
                    variant="outlined" 
                    onClick={clearFilters}
                    fullWidth
                  >
                    Xóa bộ lọc
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Danh sách đơn hàng ({filteredOrders.length})
              </Typography>
              
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Mã đơn hàng</strong></TableCell>
                      <TableCell><strong>Khách hàng</strong></TableCell>
                      <TableCell><strong>Số điện thoại</strong></TableCell>
                      <TableCell><strong>Tổng tiền</strong></TableCell>
                      <TableCell><strong>Trạng thái</strong></TableCell>
                      <TableCell><strong>Thanh toán</strong></TableCell>
                      <TableCell><strong>Ngày tạo</strong></TableCell>
                      <TableCell><strong>Thao tác</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders && filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              #{order.id?.slice(-8) || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {order.userName || 'Khách hàng'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {order.userId?.slice(-6) || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{order.userPhone || 'N/A'}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {formatPrice(order.totalPrice || 0)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={getStatusText(order.status)} 
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={order.paymentMethod || 'N/A'} 
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={1}>
                              <Tooltip title="Xem chi tiết">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleViewDetail(order)}
                                  color="primary"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cập nhật trạng thái">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditStatus(order)}
                                  color="warning"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                            Không có đơn hàng nào
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Fade>

      {/* Order Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <ReceiptIcon color="primary" />
            <Typography variant="h6">
              Chi tiết đơn hàng #{selectedOrder?.id?.slice(-8)}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              {/* Customer Info */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Thông tin khách hàng
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.primary">Tên: </Typography>
                      <Typography variant="body1">{selectedOrder.userName || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.primary">SĐT:</Typography>
                      <Typography variant="body1">{selectedOrder.userPhone || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.primary">Địa chỉ giao hàng:</Typography>
                      <Typography variant="body1">{selectedOrder.shippingAddress}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Sản phẩm đặt hàng
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên sản phẩm</TableCell>
                          <TableCell align="center">Đơn giá</TableCell>
                          <TableCell align="center">Số lượng</TableCell>
                          <TableCell align="center">Giảm giá</TableCell>
                          <TableCell align="right">Thành tiền</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="center">{formatPrice(item.price)}</TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="center">
                              {item.discount > 0 ? `${item.discount}%` : '-'}
                            </TableCell>
                            <TableCell align="right">
                              {formatPrice(item.price * item.quantity * (1 - item.discount / 100))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box mt={2} pt={2} borderTop="1px solid #eee">
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography>Tổng tiền hàng:</Typography>
                      <Typography fontWeight="bold">
                        {formatPrice(selectedOrder.totalPrice + selectedOrder.discount)}
                      </Typography>
                    </Box>
                    {selectedOrder.discount > 0 && (
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Giảm giá:</Typography>
                        <Typography color="error" fontWeight="bold">
                          -{formatPrice(selectedOrder.discount)}
                        </Typography>
                      </Box>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6">Tổng thanh toán:</Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {formatPrice(selectedOrder.totalPrice)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Order Status & Payment */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Thanh toán
                      </Typography>
                      <Chip 
                        label={selectedOrder.paymentMethod} 
                        color="primary"
                        variant="outlined"
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Trạng thái
                      </Typography>
                      <Chip 
                        label={getStatusText(selectedOrder.status)} 
                        color={getStatusColor(selectedOrder.status)}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Ngày tạo: {formatDate(selectedOrder.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cập nhật: {formatDate(selectedOrder.updatedAt)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái mới</InputLabel>
              <Select
                value={selectedOrder?.status || ''}
                label="Trạng thái mới"
                onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
              >
                <MenuItem value="UNCONFIRMED">Chưa xác nhận</MenuItem>
                <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
                <MenuItem value="SHIPPING">Đang giao</MenuItem>
                <MenuItem value="COMPLETED">Đã giao</MenuItem>
                <MenuItem value="CANCELLED">Đã hủy</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
          <Button 
            variant="contained" 
            onClick={() => handleUpdateStatus(selectedOrder?.status)}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}