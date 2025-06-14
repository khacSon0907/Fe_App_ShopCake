import React, { useState, useEffect } from 'react';
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
} from '@mui/material';

import { getProductUser } from '../../services/userService';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

const ProductCard = ({ product }) => {
  return (
    <Card
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
      <CardContent sx={{ flexGrow: 1 }}>
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
        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mt: 1 }}>
          {formatPrice(product.price)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductUser();

        console.log("api product user ", response);
        
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
  }, []);

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
