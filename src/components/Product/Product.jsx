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
} from '@mui/material';
import {
  ShoppingCart,
  ShoppingBag,
} from '@mui/icons-material';

import { getProductUser,addTocart } from '../../services/userService';
import { useSelector } from "react-redux";

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};




const ProductCard = ({ product }) => {
  const userId = useSelector((state) => state.user.data?.id);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!userId) {
      alert('Bạn cần đăng nhập để thêm vào giỏ hàng!');
      return;
    }

    try {
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
        alert('Đã thêm vào giỏ hàng!');
      } else {
        console.error('❌ Không thể thêm vào giỏ hàng:', response.data?.message);
        alert('Thêm thất bại: ' + response.data?.message);
      }
    } catch (error) {
      console.error('🔥 Lỗi khi gọi API addTocart:', error);
      alert('Lỗi kết nối server.');
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    // Logique pour achat immédiat
    console.log('Achat immédiat:', product.name);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 4,
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
        
        {/* Boutons d'action */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="contained"
            onClick={handleBuyNow}
            startIcon={<ShoppingBag />}
            sx={{
              backgroundColor: '#e53e3e',
              color: 'white',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              flexGrow: 1,
              py: 1,
              '&:hover': {
                backgroundColor: '#c53030',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(229, 62, 62, 0.4)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Mua ngay
          </Button>
          <IconButton
            onClick={handleAddToCart}
            sx={{
              backgroundColor: '#38a169',
              color: 'white',
              width: 45,
              height: 45,
              '&:hover': {
                backgroundColor: '#2f855a',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(56, 161, 105, 0.4)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ShoppingCart sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  
  useEffect(() => {
    // Chỉ fetch dữ liệu khi đang ở trang product list
    // Không fetch khi đang ở trang product detail
    if (location.pathname === '/products' || location.pathname === '/') {
      const fetchProducts = async () => {
        try {
          setLoading(true); // Đảm bảo set loading true trước khi fetch
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
  }, [location.pathname]); // Thêm location.pathname vào dependency array

  // Nếu không phải trang product list thì không render gì
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
                    <ProductCard product={product} />
                  </Box>
                </Fade>
              </Grid>
            ))}
      </Grid>
    </Container>
  );
}