import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Container,
  Skeleton,
  Fade,
  Button,
  IconButton,
  Stack,
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCart,
  ShoppingBag,
  CheckCircle,
  Close,
} from '@mui/icons-material';

import { getProductUser, addTocart } from '../../services/userService';
import { useSelector } from "react-redux";

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

// Custom Success Alert Component
const SuccessAlert = ({ open, onClose, productName, productImage }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'left' }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        variant="filled"
        sx={{
          width: '350px',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          '& .MuiAlert-icon': {
            fontSize: '28px',
          },
          '& .MuiAlert-message': {
            width: '100%',
            padding: 0,
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src={productImage}
            alt={productName}
            sx={{
              width: 50,
              height: 50,
              borderRadius: 2,
              objectFit: 'cover',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          />
          <Box sx={{ flex: 1 }}>
            <AlertTitle sx={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              mb: 0.5,
              color: 'white' 
            }}>
              Thêm vào giỏ hàng thành công! 🎉
            </AlertTitle>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              {productName}
            </Typography>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};

// Custom Error Alert Component
const ErrorAlert = ({ open, onClose, message }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
    >
      <Alert
        onClose={onClose}
        severity="error"
        variant="filled"
        sx={{
          minWidth: '300px',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(244, 67, 54, 0.3)',
          '& .MuiAlert-icon': {
            fontSize: '24px',
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      >
        <AlertTitle sx={{ fontWeight: 'bold', mb: 0.5 }}>
          ❌ Có lỗi xảy ra
        </AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

const ProductCard = ({ product, onShowAlert, onShowError }) => {
  const userId = useSelector((state) => state.user.data?.id);
  const navigate = useNavigate();
  
  // State để quản lý loading cho từng button
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    // Kiểm tra nếu đang xử lý thì không cho click tiếp
    if (isAddingToCart) return;

    if (!userId) {
      onShowError('Bạn cần đăng nhập để thêm vào giỏ hàng!');
      return;
    }

    try {
      setIsAddingToCart(true); // Bắt đầu loading

      const cartItem = {
        productId: product.id,
        name: product.name,
        image: product.images,
        price: product.price,
        quantity: 1,
        selected: true,
        discount: product.discount || 0,
      };

      const response = await addTocart(cartItem, userId);
      
      if (response.success) {
        console.log('✅ Đã thêm vào giỏ hàng:', product.name);
        // Hiển thị custom alert thay vì alert mặc định
        onShowAlert(product.name, product.images);
      } else {
        onShowError(`Thêm thất bại: ${response.data?.message || 'Có lỗi xảy ra'}`);
      }
    } catch (error) {
      console.error('🔥 Lỗi khi gọi API addTocart:', error);
      onShowError('Lỗi kết nối server. Vui lòng thử lại sau!');
    } finally {
      setIsAddingToCart(false); // Kết thúc loading
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    
    // Kiểm tra nếu đang xử lý thì không cho click tiếp
    if (isBuying) return;

    try {
      setIsBuying(true); // Bắt đầu loading
      
      // Giả lập thời gian xử lý
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Mua ngay:', product.name);
      // Có thể thêm logic mua ngay ở đây
      
    } catch (error) {
      console.error('Lỗi khi mua ngay:', error);
      onShowError('Có lỗi xảy ra khi mua ngay!');
    } finally {
      setIsBuying(false); // Kết thúc loading
    }
  };

  const handleCardClick = () => {
    // Chỉ cho phép click vào card khi không có button nào đang loading
    if (!isAddingToCart && !isBuying) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        cursor: (isAddingToCart || isBuying) ? 'default' : 'pointer',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        opacity: (isAddingToCart || isBuying) ? 0.8 : 1,
        '&:hover': {
          transform: (isAddingToCart || isBuying) ? 'none' : 'translateY(-6px)',
          boxShadow: (isAddingToCart || isBuying) ? 'none' : 4,
        },
      }}
    >
      <CardMedia
        component="img"
        image={product.images}
        alt={product.name}
        sx={{ height: 220, objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {product.description}
        </Typography>
        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mt: 1, mb: 2 }}>
          {formatPrice(product.price)}
        </Typography>
        
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="contained"
            onClick={handleBuyNow}
            startIcon={isBuying ? <CircularProgress size={16} color="inherit" /> : <ShoppingBag />}
            disabled={isBuying || isAddingToCart}
            sx={{
              backgroundColor: '#e53e3e',
              color: 'white',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              flexGrow: 1,
              py: 1,
              position: 'relative',
              '&:hover': {
                backgroundColor: '#c53030',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(229, 62, 62, 0.4)',
              },
              '&:disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e',
                transform: 'none',
                boxShadow: 'none',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {isBuying ? 'Đang xử lý...' : 'Mua ngay'}
          </Button>
          
          <IconButton
            onClick={handleAddToCart}
            disabled={isAddingToCart || isBuying}
            sx={{
              backgroundColor: isAddingToCart ? '#e0e0e0' : '#38a169',
              color: isAddingToCart ? '#9e9e9e' : 'white',
              width: 45,
              height: 45,
              position: 'relative',
              '&:hover': {
                backgroundColor: isAddingToCart ? '#e0e0e0' : '#2f855a',
                transform: isAddingToCart ? 'none' : 'translateY(-1px)',
                boxShadow: isAddingToCart ? 'none' : '0 4px 12px rgba(56, 161, 105, 0.4)',
              },
              '&:disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e',
                transform: 'none',
                boxShadow: 'none',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {isAddingToCart ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <ShoppingCart sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState({ productName: '', productImage: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();

  const handleShowAlert = (productName, productImage) => {
    setAlertData({ productName, productImage });
    setAlertOpen(true);
  };

  const handleShowError = (message) => {
    setErrorMessage(message);
    setErrorAlertOpen(true);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleCloseErrorAlert = () => {
    setErrorAlertOpen(false);
  };
  
  useEffect(() => {
    if (location.pathname === '/products' || location.pathname === '/') {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await getProductUser();
          
          if (response.success) {
            setProducts(response.data || []);
          } else {
            console.error('Lỗi khi lấy dữ liệu sản phẩm:', response.message);
          }
        } catch (error) {
          console.error('Lỗi API:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [location.pathname]);

  if (location.pathname.includes('/product/')) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 4, borderBottom: '3px solid', borderColor: 'primary.main', display: 'inline-block' }}
      >
        Sản phẩm mới
      </Typography>

      <Grid container spacing={4}>
        {loading
          ? [...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Skeleton variant="rectangular" height={300} />
                <Skeleton height={30} sx={{ mt: 2 }} />
                <Skeleton height={20} width="80%" />
              </Grid>
            ))
          : products.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <Fade in timeout={500}>
                  <Box height="100%">
                    <ProductCard 
                      product={product} 
                      onShowAlert={handleShowAlert}
                      onShowError={handleShowError}
                    />
                  </Box>
                </Fade>
              </Grid>
            ))}
      </Grid>

      {/* Custom Success Alert */}
      <SuccessAlert
        open={alertOpen}
        onClose={handleCloseAlert}
        productName={alertData.productName}
        productImage={alertData.productImage}
      />

      {/* Custom Error Alert */}
      <ErrorAlert
        open={errorAlertOpen}
        onClose={handleCloseErrorAlert}
        message={errorMessage}
      />
    </Container>
  );
}