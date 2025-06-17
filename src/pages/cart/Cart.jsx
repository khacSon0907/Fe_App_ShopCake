import React, { useState } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Bánh Kem Bắp',
      price: 515000,
      quantity: 1,
      selected: true,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      discount: 10,
    },
    {
      id: '2',
      name: 'Mangosteen Rose',
      price: 750000,
      quantity: 2,
      selected: true,
      image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400',
      discount: 0,
    },
  ]);

  const [selectAll, setSelectAll] = useState(true);

  const handleQuantityChange = (id, value) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, parseInt(value) || 1) } : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSelectItem = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
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

  const getSelectedItems = () => {
    return cartItems.filter(item => item.selected);
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

          {cartItems.length === 0 ? (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
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
                  <Slide 
                    key={item.id} 
                    direction="right" 
                    in 
                    timeout={500 + index * 200}
                  >
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
                          onChange={() => handleSelectItem(item.id)}
                          sx={{color:'black'}}
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
                            onClick={() => handleRemove(item.id)}
                            sx={{
                              '&:hover': {
                                transform: 'scale(1.1)',
                              }
                            }}
                          >
                            <DeleteIcon />
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
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            sx={{ 
                              width: 100,
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: 'primary.main',
                                },
                              },
                            }}
                            inputProps={{ min: 1 }}
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
                      }
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
                      disabled={selectedCount === 0}
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
                      Tiến hành thanh toán ({selectedCount})
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
    </Container>
  );
}