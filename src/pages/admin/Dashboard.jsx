// src/pages/Admin/Dashboard.jsx
import { Box, Typography, Grid, Paper } from "@mui/material";

export default function Dashboard() {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Tổng quan hệ thống 🎯
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle2">Đơn hàng hôm nay</Typography>
            <Typography variant="h6">12</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle2">Doanh thu hôm nay</Typography>
            <Typography variant="h6">3,250,000đ</Typography>
          </Paper>
        </Grid>

        {/* Thêm các ô Sản phẩm bán chạy, Người dùng mới... */}
      </Grid>

      {/* Sau có thể thêm biểu đồ, bảng lịch sử... */}
    </Box>
  );
}
