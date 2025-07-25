import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
  Chip,
  IconButton,
  Fade,
  CircularProgress,
  Button,
} from "@mui/material";
import { Favorite, ShoppingCart, Visibility } from "@mui/icons-material";
import {
  getFavoritesByUserId,
  removeFromFavorite,
} from "../../services/userService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify"; // Nhớ cài react-toastify
export default function FavoriteUser() {
  const user = useSelector((state) => state.user.data);

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleRemoveFromFavorite = async (userId, productId) => {
    try {
      const res = await removeFromFavorite(userId, productId);
      console.log();
      
      if (res?.success) {
        toast.success("🗑️ Đã xóa khỏi danh sách yêu thích");
        // Cập nhật lại danh sách
        setFavorites((prev) =>
          prev
            .map((item) => ({
              ...item,
              favoriteItem: item.favoriteItem.filter(
                (p) => p.productId !== productId
              ),
            }))
            .filter((item) => item.favoriteItem.length > 0)
        );
      } else {
        toast.error(res?.message || "❌ Xóa không thành công");
      }
    } catch (err) {
      console.error("Lỗi khi xóa khỏi yêu thích:", err);
      toast.error("❌ Có lỗi xảy ra khi xóa khỏi yêu thích");
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.id) return;
      try {
        const res = await getFavoritesByUserId(user.id);
        console.log(" res ", res);

        if (res?.data) {
          setFavorites(res.data);
        } else {
          setFavorites([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách yêu thích:", err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box textAlign="center" mb={5}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #e91e63, #ff4081)",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          🎂 Sản phẩm yêu thích của bạn
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Những món bánh ngọt ngào được bạn lưu giữ trong danh sách yêu thích
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : favorites.length === 0 ? (
        <Box
          textAlign="center"
          py={8}
          sx={{
            background: "linear-gradient(135deg, #f5f5f5, #eeeeee)",
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" color="text.secondary" mb={2}>
            💔 Bạn chưa có sản phẩm yêu thích nào
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hãy thêm những món bánh ngon vào danh sách yêu thích của bạn!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((item) =>
            item.favoriteItem.map((product, pIndex) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={`${item.idFavorite}-${pIndex}`}
              >
                <Fade in={true} timeout={500 + pIndex * 150}>
                  <Card
                    onMouseEnter={() =>
                      setHoveredCard(`${item.idFavorite}-${pIndex}`)
                    }
                    onMouseLeave={() => setHoveredCard(null)}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "0.3s",
                      transform:
                        hoveredCard === `${item.idFavorite}-${pIndex}`
                          ? "translateY(-8px)"
                          : "translateY(0)",
                      boxShadow:
                        hoveredCard === `${item.idFavorite}-${pIndex}`
                          ? "0 20px 40px rgba(233, 30, 99, 0.15)"
                          : "0 4px 20px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <Chip
                      label={`-${product.discount || 0}%`}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 2,
                        backgroundColor: "#e91e63",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                      }}
                    />

                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          backgroundColor: "rgba(233, 30, 99, 0.1)",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                      size="small"
                    >
                      <Favorite sx={{ color: "#e91e63", fontSize: "1.2rem" }} />
                    </IconButton>

                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={
                          product.image?.startsWith("http")
                            ? product.image
                            : "/images/no-image.jpg"
                        }
                        alt={product.name}
                        sx={{ objectFit: "cover" }}
                      />
                    </Box>

                    <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          lineHeight: 1.3,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {product.name}
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{ color: "#4caf50", fontWeight: "bold" }}
                      >
                        {Number(product.price)?.toLocaleString("vi-VN")} đ
                      </Typography>

                      <Button>Mua ngay</Button>
                      <Button>Giỏ hàng</Button>
                      <Button
                        color="error"
                        onClick={() =>
                          handleRemoveFromFavorite(user?.id, product.productId)
                        }
                      >
                        Xoá
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Container>
  );
}
