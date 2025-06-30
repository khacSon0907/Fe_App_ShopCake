// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Card,
  CardMedia,
  Chip,
  Stack,
  Divider,
  TextField,
  Paper,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
  Snackbar,
  AlertTitle,
  Slide,
} from "@mui/material";
import {
  ShoppingCart,
  ShoppingBag,
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Share,
  Add,
  Remove,
  CheckCircle,
  Error,
  Scale,
  Close,
} from "@mui/icons-material";

import { getProductById ,addTocart} from "../../services/userService";
import { useSelector } from "react-redux";

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

// Component để hiển thị transition cho Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // State cho notification system
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, warning, info
  });

  const userId = useSelector((state)=> state.user.data?.id)

  // Function để hiển thị thông báo
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Function để đóng thông báo
  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Thêm effect để kiểm soát scroll behavior
  useEffect(() => {
    // Đảm bảo trang không có scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Cuộn về đầu trang ngay lập tức
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    return () => {
      // Cleanup
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  useEffect(() => {
    // Cuộn về đầu trang khi component mount
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProductById(id);
        if (response.success && response.data) {
          const productData = response.data;
          setProduct(productData);
          if (productData.size) setSelectedSize(productData.size);
        } else {
          setError(response.message || "Không thể tải thông tin sản phẩm");
        }
      } catch (error) {
        console.log("arr",error);
        
        setError("Có lỗi xảy ra khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Thêm useEffect để đảm bảo scroll to top khi product thay đổi
  useEffect(() => {
    if (product) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [product]);

  const handleQuantityChange = (change) => {
    const maxQuantity = product?.stock || 999;
    const newQuantity = quantity + change;
    setQuantity(Math.max(1, Math.min(newQuantity, maxQuantity)));
  };

  const handleAddToCart = async () => {
    if (!product) return;
    // Ngăn scroll khi click button
  try {
      const cartItem = {
        productId: product.id,
        name: product.name,
        image: product.images,
        price: product.price,
        quantity:quantity,
        selected: true,
        discount: product.discount || 0,
      };

      const response = await addTocart(cartItem, userId);
      if (response.success) {
        console.log('✅ Đã thêm vào giỏ hàng:', product.name);
        showNotification(`Đã thêm "${product.name}" vào giỏ hàng thành công! 🛒`, "success");
      } else {
        showNotification(`Thêm thất bại: ${response.data?.message || "Có lỗi xảy ra"}`, "error");
      }
    } catch (error) {
      console.error('🔥 Lỗi khi gọi API addTocart:', error);
      showNotification("Lỗi kết nối server. Vui lòng thử lại sau! 🚫", "error");
    }
  
  };

  const handleBuyNow = () => {
    if (!product) return;
    // Ngăn scroll khi click button
    const orderItem = {
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      quantity,
      price: product.price,
      image: product.images,
      total: product.price * quantity,
    };
    console.log("Mua ngay:", orderItem);
    showNotification(`Đang chuyển đến trang thanh toán cho "${product.name}" 💳`, "info");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={200} height={30} sx={{ mb: 3 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={isMobile ? 300 : 500} sx={{ mb: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="50%" height={30} sx={{ mb: 3 }} />
            <Skeleton variant="text" height={100} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Không tìm thấy sản phẩm
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: "#fafafa", 
      minHeight: "100vh",
      width: "100%",
      overflowX: "hidden", // Ngăn cuộn ngang
      position: "relative",
      scrollBehavior: "smooth"
    }}>
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: 4, 
          px: { xs: 2, sm: 3 },
          width: "100%",
          maxWidth: "100%"
        }}
      >
        {/* Header với responsive design */}
        <Box sx={{ 
          mb: 3, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          width: "100%"
        }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            variant="outlined"
            sx={{ 
              borderRadius: 2, 
              textTransform: "none", 
              fontWeight: 500,
              alignSelf: { xs: "flex-start", sm: "center" }
            }}
          >
            Quay lại
          </Button>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            fontWeight="bold" 
            color="text.primary"
            sx={{ 
              textAlign: { xs: "left", sm: "center" },
              wordBreak: "break-word",
              maxWidth: "100%"
            }}
          >
            {product.name}
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ width: "100%" }}>
          {/* Hình ảnh sản phẩm */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                position: "relative",
                borderRadius: 3,
                boxShadow: 4,
                overflow: "hidden",
                width: "100%",
                maxWidth: "100%"
              }}
            >
              <CardMedia
                component="img"
                image={product.images}
                alt={product.name}
                sx={{
                  height: { xs: 300, sm: 400, md: 500 },
                  width: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              />
              <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                <Stack spacing={1}>
                  {product.isAvailable ? (
                    <Chip
                      icon={<CheckCircle />}
                      label="Còn hàng"
                      sx={{ backgroundColor: "#c8e6c9", color: "#2e7d32" }}
                      size="small"
                    />
                  ) : (
                    <Chip
                      icon={<Error />}
                      label="Hết hàng"
                      sx={{ backgroundColor: "#ffcdd2", color: "#c62828" }}
                      size="small"
                    />
                  )}
                  {product.stock && product.stock <= 5 && (
                    <Chip
                      label={`Chỉ còn ${product.stock}`}
                      color="warning"
                      size="small"
                    />
                  )}
                </Stack>
              </Box>
            </Card>
          </Grid>

          {/* Thông tin sản phẩm */}
          <Grid item xs={12} md={6}>
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              {product.categoryCode && (
                <Chip
                  label={product.categoryCode.toUpperCase()}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2, fontWeight: 500 }}
                />
              )}

              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight="bold" 
                gutterBottom
                sx={{ wordBreak: "break-word" }}
              >
                {product.name}
              </Typography>

              <Typography
                variant={isMobile ? "h6" : "h5"}
                color="primary"
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                {formatPrice(product.price)}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ 
                  mb: 3, 
                  lineHeight: 1.7,
                  wordBreak: "break-word"
                }}
              >
                {product.description}
              </Typography>

              {/* Thông tin chi tiết */}
              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: "#f0f4f8",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  width: "100%"
                }}
              >
                <Grid container spacing={2}>
                  {product.weight && (
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Scale fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Trọng lượng:</strong> {product.weight}g
                        </Typography>
                      </Stack>
                    </Grid>
                  )}
                  {product.size && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Kích thước:</strong> {product.size}
                      </Typography>
                    </Grid>
                  )}
                  {product.stock !== undefined && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Tồn kho:</strong> {product.stock} sản phẩm
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Thành phần */}
              {product.ingredients && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Thành phần:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #fde68a",
                      fontStyle: "normal",
                      fontWeight: 500,
                      wordBreak: "break-word"
                    }}
                  >
                    {product.ingredients}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Kích cỡ */}
              {product.size && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Kích cỡ có sẵn:
                  </Typography>
                  <Chip label={product.size} color="primary" variant="filled" />
                </Box>
              )}

              {/* Chọn số lượng */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Số lượng:
                </Typography>
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  spacing={2}
                  sx={{ width: "fit-content" }}
                >
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    size="small"
                  >
                    <Remove />
                  </IconButton>
                  <TextField
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      const maxQuantity = product.stock || 999;
                      setQuantity(Math.max(1, Math.min(value, maxQuantity)));
                    }}
                    sx={{ width: 80 }}
                    inputProps={{
                      style: { textAlign: "center" },
                      min: 1,
                      max: product.stock || 999,
                    }}
                    type="number"
                    size="small"
                  />
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stock || 999)}
                    size="small"
                  >
                    <Add />
                  </IconButton>
                </Stack>
              </Box>

              {/* Tổng tiền */}
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="bold"
                color="secondary"
                sx={{ mb: 3 }}
              >
                Tổng tiền: {formatPrice(product.price * quantity)}
              </Typography>

              {/* Buttons */}
              <Stack 
                direction={{ xs: "column", sm: "row" }} 
                spacing={2} 
                sx={{ mb: 3, width: "100%" }}
              >
                <Button
                  variant="contained"
                  onClick={handleBuyNow}
                  startIcon={<ShoppingBag />}
                  size="large"
                  disabled={!product.isAvailable}
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    flexGrow: 1,
                    py: 1.5,
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                    "&:disabled": {
                      backgroundColor: "#e0e0e0",
                      color: "#9e9e9e",
                    },
                    "&:focus": {
                      outline: "none"
                    }
                  }}
                >
                  {product.isAvailable ? "Mua ngay" : "Hết hàng"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleAddToCart}
                  startIcon={<ShoppingCart />}
                  size="large"
                  disabled={!product.isAvailable}
                  sx={{
                    borderColor: "#388e3c",
                    color: "#388e3c",
                    flexGrow: 1,
                    py: 1.5,
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#e8f5e9",
                    },
                    "&:disabled": {
                      borderColor: "#e0e0e0",
                      color: "#9e9e9e",
                    },
                    "&:focus": {
                      outline: "none"
                    }
                  }}
                >
                  Thêm vào giỏ
                </Button>
              </Stack>

              {/* Action icons */}
              <Stack direction="row" spacing={2} justifyContent="center">
                <IconButton
                  onClick={() => setIsFavorite(!isFavorite)}
                  color={isFavorite ? "error" : "default"}
                  sx={{
                    "&:hover": { transform: "scale(1.1)" },
                    transition: "all 0.2s ease",
                  }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <IconButton
                  sx={{
                    "&:hover": { transform: "scale(1.1)" },
                    transition: "all 0.2s ease",
                  }}
                >
                  <Share />
                </IconButton>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Notification System - Beautiful Snackbar positioned at bottom */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            minWidth: '300px',
            maxWidth: '600px',
          }
        }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{
            width: '100%',
            fontSize: '1rem',
            fontWeight: 500,
            borderRadius: 2,
            boxShadow: 3,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
            },
            '& .MuiAlert-action': {
              paddingTop: 0,
            }
          }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseNotification}
            >
              <Close fontSize="small" />
            </IconButton>
          }
        >
          <AlertTitle sx={{ fontWeight: 'bold', mb: 0.5 }}>
            {notification.severity === 'success' && '✅ Thành công'}
            {notification.severity === 'error' && '❌ Có lỗi xảy ra'}
            {notification.severity === 'warning' && '⚠️ Cảnh báo'}
            {notification.severity === 'info' && 'ℹ️ Thông tin'}
          </AlertTitle>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}