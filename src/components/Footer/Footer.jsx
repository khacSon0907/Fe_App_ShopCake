import React from 'react'
import { Box, Container, Grid, Typography, Divider, Link } from "@mui/material";
import logoFooter from "../../assets/logoFooter.png";

export default function Footer() {
  return (
  <Box sx={{ backgroundColor: "primary.secondary", color:"text.secondary", pt: 4, pb: 2, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Cột 1: Thông tin công ty */}
          <Grid item xs={12} md={8}>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              <strong>Công ty TNHH Cái Lò Nướng</strong><br />
              2A Ba Gia, Phường 7, quận Tân Bình, Thành phố Hồ Chí Minh<br />
              Số điện thoại: 028.8888.3388<br />
              Email: sale@cailonuong.vn<br />
              Giấy chứng nhận đăng ký kinh doanh: 0315630862<br />
              Mã số doanh nghiệp: 0315630862 do Sở KHĐT TP.HCM cấp lần đầu ngày 16/04/2019
            </Typography>
          </Grid>

          {/* Cột 2: Logo đã thông báo */}
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Box
              component="img"
              src={logoFooter}
              alt="Đã thông báo"
              sx={{ height: 60 }}
            />
          </Grid>
        </Grid>

        {/* Đường kẻ và link chân trang */}
        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

        <Typography variant="body2" align="center" sx={{ fontSize: 13 }}>
          © 2023 Cái Lò Nướng.
        </Typography>

        <Box sx={{ mt: 1, textAlign: "center", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 2 }}>
          {[
            "Chính sách giao hàng",
            "Chính sách trả hàng – hoàn tiền",
            "Phương thức thanh toán",
            "Điều khoản & điều kiện thanh toán",
            "Bảo vệ thông tin cá nhân người tiêu dùng",
            "Thông tin liên hệ"
          ].map((text, i) => (
            <Link key={i} href="#" underline="hover" color="inherit" sx={{ fontSize: 13 }}>
              {text}
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  
  );
}

