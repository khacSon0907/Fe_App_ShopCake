import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  TextField,
  Divider,
  Checkbox,
  FormControlLabel,
  Chip,
  Fade,
  Slide,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getCartUser, deleteCartItem } from '../../services/userService';
import { useSelector } from 'react-redux';
import Orders from '../Order/Orders';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export default function Cart() {
  const user = useSelector((state) => state.user.data);
  console.log("id user cart 11111", user);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectAll, setSelectAll] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null
  });
  const [deletingItems, setDeletingItems] = useState(new Set()); // Track items being deleted
  
  // State mới để quản lý việc hiển thị Cart/Orders
  const [showOrders, setShowOrders] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  const fetchCartData = async () => {
    try {
      console.log("id user cart 22222", user?.id);
      if (!user?.id) {
        throw new Error("User ID is missing");
      }
      setLoading(true);

      const response = await getCartUser(user.id);
      console.log("cart data", response.data.items);
      const transformedItems =
        response.data.items?.map((item, index) => ({
          // Sử dụng unique key để tránh xung đột
          uniqueId: `${item.productId}_${index}`, // Sử dụng productId thay vì id
          productId: item.productId, // Đảm bảo có productId
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selected: item.selected || true,
          image:
            item.image ||
            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
          discount: item.discount || 0,
        })) || [];

      setCartItems(transformedItems);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [user]);

  // Sửa lại function handleSelectItem để sử dụng uniqueId
  const handleSelectItem = (uniqueId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.uniqueId === uniqueId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, selected: newSelectAll }))
    );
  };

  // Cập nhật useEffect để sync selectAll state
  useEffect(() => {
    if (cartItems.length > 0) {
      const allSelected = cartItems.every(item => item.selected);
      const noneSelected = cartItems.every(item => !item.selected);
      
      if (allSelected && !selectAll) {
        setSelectAll(true);
      } else if (noneSelected && selectAll) {
        setSelectAll(false);
      } else if (!allSelected && !noneSelected && selectAll) {
        setSelectAll(false);
      }
    }
  }, [cartItems]);

  const getSelectedItems = () => {
    return cartItems.filter((item) => item.selected);
  };

  const getSubtotal = () => {
    return getSelectedItems().reduce((sum, item) => {
      const discountedPrice = item.price * (1 - item.discount / 100);
      return sum + discountedPrice * item.quantity;
    }, 0);
  };

  const getTotalDiscount = () => {
    return getSelectedItems().reduce((sum, item) => {
      const discountAmount = item.price * (item.discount / 100) * item.quantity;
      return sum + discountAmount;
    }, 0);
  };

  const getTotal = () => {
    return getSubtotal();
  };

  const selectedCount = getSelectedItems().length;

  // Cập nhật function handleCheckout
  const handleCheckout = async () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) return;

    try {
      setUpdating(true);
      
      console.log("Chuẩn bị chuyển sang trang thanh toán");
      
      const orderData = {
        items: selectedItems.map((item) => ({
          productId: item.productId || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          discount: item.discount,
          finalPrice: item.price * (1 - item.discount / 100),
          image: item.image,
        })),
        total: getTotal(),
        discount: getTotalDiscount(),
        subtotal: getSubtotal() + getTotalDiscount(),
        selectedCount: selectedCount,
        userId: user.id,
      };

      console.log('Dữ liệu đơn hàng:', orderData);
      
      // Lưu dữ liệu checkout và chuyển sang Orders
      setCheckoutData(orderData);
      setShowOrders(true);
      
    } catch (err) {
      console.error('Error during checkout:', err);
      setError('Không thể tiến hành thanh toán. Vui lòng thử lại.');
    } finally {
      setUpdating(false);
    }
  };

  // Function để quay lại Cart từ Orders
  const handleBackToCart = () => {
    setShowOrders(false);
    setCheckoutData(null);
    // Có thể refresh lại dữ liệu cart nếu cần
    fetchCartData();
  };

  // Hàm mở dialog xác nhận xóa
  const handleDeleteClick = (item) => {
    setDeleteDialog({
      open: true,
      item: item
    });
    console.log("test", deleteDialog.item);
  };

  // Hàm đóng dialog
  const handleDeleteClose = () => {
    setDeleteDialog({
      open: false,
      item: null
    });
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const handleDeleteConfirm = async () => {
    const itemToDelete = deleteDialog.item;
    if (!itemToDelete) return;
    
    try {
      // Thêm item vào danh sách đang xóa
      setDeletingItems(prev => new Set([...prev, itemToDelete.uniqueId]));
      
      console.log('Deleting item with:', {
        userId: user.id,
        productId: itemToDelete.productId,
        itemData: itemToDelete
      });
      
      // Gọi API với productId chính xác
      const response = await deleteCartItem(user.id, itemToDelete.productId);
      
      console.log('Delete response:', response);
      
      // Nếu API thành công, cập nhật state local
      setCartItems(prev => prev.filter(item => item.uniqueId !== itemToDelete.uniqueId));
      
      // Hiển thị thông báo thành công
      setError(null);
      console.log(`Đã xóa sản phẩm "${itemToDelete.name}" khỏi giỏ hàng`);
      
    } catch (err) {
      console.error('Error deleting item:', err);
      
      // Log chi tiết lỗi để debug
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setError(`Không thể xóa sản phẩm "${itemToDelete.name}". ${err.message || 'Vui lòng thử lại.'}`);
    } finally {
      // Xóa item khỏi danh sách đang xóa
      setDeletingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemToDelete.uniqueId);
        return newSet;
      });
      
      // Đóng dialog
      handleDeleteClose();
    }
  };

  const handleQuantityChange = async (uniqueId, newQuantity) => {
    // Validate input
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 1) {
      return;
    }

    try {
      setUpdating(true);

      // Tìm item cần update
      const itemToUpdate = cartItems.find(item => item.uniqueId === uniqueId);
      if (!itemToUpdate) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      // Update local state trước để UX mượt mà
      setCartItems(prev =>
        prev.map(item =>
          item.uniqueId === uniqueId
            ? { ...item, quantity: quantity }
            : item
        )
      );

      console.log(`Updated quantity for item ${uniqueId} to ${quantity}`);
      
    } catch (err) {
      console.error('Error updating quantity:', err);
      
      // Rollback state nếu có lỗi
      await fetchCartData(); // Reload data from server
      
      setError('Không thể cập nhật số lượng. Vui lòng thử lại.');
    } finally {
      setUpdating(false);
    }
  };

  if (showOrders) {
    return (
      <Orders 
        checkoutData={checkoutData} 
        onBackToCart={handleBackToCart}
        user={user}
      />
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Đang tải giỏ hàng...
        </Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" fontWeight="bold">
              Giỏ hàng của bạn
            </Typography>
            <Chip
              label={`${cartItems.length} sản phẩm`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {updating && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <CircularProgress size={20} />
                Đang cập nhật...
              </Box>
            </Alert>
          )}

          {cartItems.length === 0 ? (
            <Paper
              elevation={2}
              sx={{
                p: 6,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Giỏ hàng đang trống
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        color="primary"
                      />
                    }
                    label={
                      <Typography fontWeight="bold">
                        Chọn tất cả ({cartItems.length} sản phẩm)
                      </Typography>
                    }
                  />
                </Paper>

                {cartItems.map((item, index) => (
                  <Slide key={item.uniqueId} direction="right" in timeout={500 + index * 200}>
                    <Card
                      sx={{
                        display: 'flex',
                        mb: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 6,
                        },
                        border: item.selected ? '2px solid' : '1px solid',
                        borderColor: item.selected ? 'primary.main' : 'divider',
                        opacity: item.selected ? 1 : 0.7,
                      }}
                    >
                      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          checked={item.selected}
                          onChange={() => handleSelectItem(item.uniqueId)}
                          sx={{ color: 'black' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Box>

                      <CardMedia
                        component="img"
                        image={item.image}
                        alt={item.name}
                        sx={{
                          width: 140,
                          height: 140,
                          objectFit: 'cover',
                          borderRadius: 2,
                          m: 2,
                        }}
                      />

                      <CardContent sx={{ flex: 1, p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                              {item.name}
                            </Typography>

                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                              <Typography
                                variant="h6"
                                color="primary.main"
                                fontWeight="bold"
                              >
                                {formatPrice(item.price * (1 - item.discount / 100))}
                              </Typography>
                              {item.discount > 0 && (
                                <>
                                  <Typography
                                    variant="body2"
                                    sx={{ textDecoration: 'line-through' }}
                                    color="text.secondary"
                                  >
                                    {formatPrice(item.price)}
                                  </Typography>
                                  <Chip
                                    label={`-${item.discount}%`}
                                    color="error"
                                    size="small"
                                    icon={<LocalOfferIcon />}
                                  />
                                </>
                              )}
                            </Box>

                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Đơn giá: {formatPrice(item.price)}
                            </Typography>

                            <Typography variant="body1" fontWeight="bold" color="secondary.main">
                              Thành tiền: {formatPrice(item.price * (1 - item.discount / 100) * item.quantity)}
                            </Typography>
                          </Box>

                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(item)}
                            disabled={deletingItems.has(item.uniqueId)}
                            sx={{
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            {deletingItems.has(item.uniqueId) ? (
                              <CircularProgress size={24} color="error" />
                            ) : (
                              <DeleteIcon />
                            )}
                          </IconButton>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2} mt={2}>
                          <Typography variant="body2" fontWeight="bold">
                            Số lượng:
                          </Typography>
                          <TextField
                            type="number"
                            size="small"
                            value={item.quantity}
                            disabled={updating || deletingItems.has(item.uniqueId)}
                            sx={{
                              width: 100,
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: 'primary.main',
                                },
                              },
                            }}
                            inputProps={{ min: 1 }}
                            onChange={(e) => handleQuantityChange(item.uniqueId, e.target.value)}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Slide>
                ))}
              </Grid>

              <Grid item xs={12} md={4}>
                <Slide direction="left" in timeout={800}>
                  <Card
                    sx={{
                      p: 4,
                      position: 'sticky',
                      top: 20,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      '& .MuiTypography-root': {
                        color: 'white',
                      },
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Tóm tắt đơn hàng
                    </Typography>
                    <Divider sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.3)' }} />

                    <Box mb={2}>
                      <Typography variant="body1" gutterBottom>
                        Đã chọn: {selectedCount}/{cartItems.length} sản phẩm
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography>Tạm tính:</Typography>
                      <Typography fontWeight="bold">
                        {formatPrice(getSubtotal() + getTotalDiscount())}
                      </Typography>
                    </Box>

                    {getTotalDiscount() > 0 && (
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography>Giảm giá:</Typography>
                        <Typography fontWeight="bold" color="error.light">
                          -{formatPrice(getTotalDiscount())}
                        </Typography>
                      </Box>
                    )}

                    <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />

                    <Box display="flex" justifyContent="space-between" mb={3}>
                      <Typography variant="h6" fontWeight="bold">
                        Tổng cộng:
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {formatPrice(getTotal())}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={selectedCount === 0 || updating}
                      onClick={handleCheckout}
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        bgcolor: 'white',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                          transform: 'translateY(-2px)',
                        },
                        '&:disabled': {
                          bgcolor: 'rgba(255,255,255,0.3)',
                          color: 'rgba(255,255,255,0.7)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {updating ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        `Tiến hành thanh toán (${selectedCount})`
                      )}
                    </Button>

                    {selectedCount === 0 && (
                      <Typography
                        variant="body2"
                        textAlign="center"
                        mt={2}
                        sx={{ opacity: 0.8 }}
                      >
                        Vui lòng chọn ít nhất 1 sản phẩm
                      </Typography>
                    )}
                  </Card>
                </Slide>
              </Grid>
            </Grid>
          )}
        </Box>
      </Fade>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          <Box display="flex" alignItems="center" gap={1}>
            <DeleteIcon color="error" />
            Xác nhận xóa sản phẩm
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa sản phẩm <strong>"{deleteDialog.item?.name}"</strong> khỏi giỏ hàng không?
            <br />
            Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Hủy
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}