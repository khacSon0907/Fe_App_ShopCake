import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  Container,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import { 
  Diamond, 
  Star, 
  LocalShipping, 
  CardGiftcard, 
  TrendingUp,
  Info
} from '@mui/icons-material';

const tiers = [
  {
    title: 'MEMBER',
    sales: '≥ 800,000 VNĐ',
    discount: '—',
    freeship: '30K',
    birthday: '15%',
    color: '#64B5F6',
    icon: <Star />,
    gradient: 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)'
  },
  {
    title: 'VIP SILVER',
    sales: '1.5 – < 2.5 triệu',
    discount: '10%',
    freeship: '30K',
    birthday: '15%',
    color: '#90A4AE',
    icon: <Star />,
    gradient: 'linear-gradient(135deg, #90A4AE 0%, #78909C 100%)'
  },
  {
    title: 'VIP GOLD',
    sales: '2.5 – < 5 triệu',
    discount: '10%',
    freeship: '40K',
    birthday: '20%',
    color: '#FFB74D',
    icon: <Diamond />,
    gradient: 'linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)'
  },
  {
    title: 'VIP DIAMOND',
    sales: '≥ 5 triệu',
    discount: '15%',
    freeship: 'Miễn phí nội thành',
    birthday: '20%',
    color: '#E1BEE7',
    icon: <Diamond />,
    gradient: 'linear-gradient(135deg, #E1BEE7 0%, #CE93D8 100%)'
  },
];

const BenefitItem = ({ icon, label, value, highlight = false }) => (
  <Box display="flex" alignItems="center" gap={1} py={1}>
    <Box sx={{ color: highlight ? '#1976d2' : '#666', fontSize: '1.1rem' }}>
      {icon}
    </Box>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: '80px' }}>
      {label}:
    </Typography>
    <Typography 
      variant="body2" 
      fontWeight="bold" 
      color={highlight ? 'primary' : 'text.primary'}
    >
      {value}
    </Typography>
  </Box>
);

export default function MemberContact() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          sx={{ 
            background: '#000000',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,

          }}
        >
          Chương trình Khách hàng Thân thiết
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          Tích điểm mua sắm và nhận những ưu đãi hấp dẫn dành riêng cho bạn
        </Typography>
      </Box>

      {/* Membership Hero Card */}
      <Paper 
        elevation={8}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 4,
          mb: 6,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box position="relative" zIndex={2}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            🎉 Trở thành thành viên VIP ngay hôm nay!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Tận hưởng các đặc quyền độc quyền và ưu đãi không giới hạn
          </Typography>
        </Box>
        <Box 
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}
        />
      </Paper>

      {/* Membership Tiers */}
      <Grid container spacing={3} mb={6}>
        {tiers.map((tier, index) => (
          <Grid item xs={12} sm={6} md={3} key={tier.title}>
            <Card 
              elevation={6}
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                },
                border: index === 3 ? '2px solid #E1BEE7' : 'none'
              }}
            >
              {/* Tier Header */}
              <Box 
                sx={{ 
                  background: tier.gradient,
                  color: 'white',
                  p: 2.5,
                  textAlign: 'center',
                  position: 'relative'
                }}
              >
                <Box sx={{ fontSize: '2rem', mb: 1 }}>
                  {tier.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {tier.title}
                </Typography>
                {index === 3 && (
                  <Chip 
                    label="PREMIUM" 
                    size="small" 
                    sx={{ 
                      mt: 1,
                      background: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 'bold'
                    }} 
                  />
                )}
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={1}>
                  <BenefitItem 
                    icon={<TrendingUp />}
                    label="Doanh số"
                    value={tier.sales}
                    highlight={true}
                  />
                  <BenefitItem 
                    icon="🔖"
                    label="Giảm giá"
                    value={tier.discount}
                  />
                  <BenefitItem 
                    icon={<LocalShipping />}
                    label="Freeship"
                    value={tier.freeship}
                  />
                  <BenefitItem 
                    icon={<CardGiftcard />}
                    label="Sinh nhật"
                    value={tier.birthday}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Important Notes Section */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Info color="primary" sx={{ fontSize: '2rem' }} />
          <Typography variant="h5" fontWeight="bold" color="primary">
            📌 Điều khoản & Lưu ý quan trọng
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
                💰 Điều kiện áp dụng
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Áp dụng với hóa đơn từ <strong>250,000 VNĐ</strong> trở lên
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="warning.main" mb={2}>
                ⚠️ Hạn chế ưu đãi
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Không áp dụng đồng thời với voucher Zalo hoặc ưu đãi Grab
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="info.main" mb={2}>
                📅 Chính sách
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chính sách có thể được <strong>điều chỉnh hàng năm</strong>
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}