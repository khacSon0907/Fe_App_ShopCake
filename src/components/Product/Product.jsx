import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../store/favoriteSlice";
import { useNavigate, useLocation } from "react-router-dom";
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
  TextField,
  InputAdornment,
  Paper,
  Chip,
} from "@mui/material";
import {
  ShoppingCart,
  ShoppingBag,
  Close,
  FavoriteBorder,
  Favorite,
  Search,
  Clear,
} from "@mui/icons-material";
import {
  getProductUser,
  addTocart,
  addToFavorite,
} from "../../services/userService";
import { toast } from "react-toastify";

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const SuccessAlert = ({ open, onClose, productName, productImage }) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    TransitionComponent={Slide}
    TransitionProps={{ direction: "left" }}
  >
    <Alert
      onClose={onClose}
      severity="success"
      variant="filled"
      sx={{
        width: "350px",
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(76, 175, 80, 0.3)",
        background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
      }}
      action={
        <IconButton
          size="small"
          color="inherit"
          onClick={onClose}
        >
          <Close fontSize="small" />
        </IconButton>
      }
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Box
          component="img"
          src={productImage}
          alt={productName}
          sx={{ width: 50, height: 50, borderRadius: 2, objectFit: "cover" }}
        />
        <Box flex={1}>
          <AlertTitle sx={{ fontSize: 16, fontWeight: "bold", mb: 0.5, color: "white" }}>
            Thêm vào giỏ hàng thành công! 🎉
          </AlertTitle>
          <Typography variant="body2" sx={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>
            {productName}
          </Typography>
        </Box>
      </Box>
    </Alert>
  </Snackbar>
);

const ErrorAlert = ({ open, onClose, message }) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    TransitionComponent={Slide}
    TransitionProps={{ direction: "up" }}
  >
    <Alert
      onClose={onClose}
      severity="error"
      variant="filled"
      sx={{ minWidth: 300, borderRadius: 3 }}
      action={
        <IconButton
          size="small"
          color="inherit"
          onClick={onClose}
        >
          <Close fontSize="small" />
        </IconButton>
      }
    >
      <AlertTitle sx={{ fontWeight: "bold", mb: 0.5 }}>
        ❌ Có lỗi xảy ra
      </AlertTitle>
      {message}
    </Alert>
  </Snackbar>
);

const ProductCard = ({ product, onShowAlert, onShowError }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorite.favorites);
  const userId = useSelector((state) => state.user.data?.id);
  const navigate = useNavigate();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const isFavorite = favorites.some((item) => item.productId === product.id);

const handleAddToFavorite = async (e) => {
  e.stopPropagation();
  if (!userId) return onShowError("Bạn cần đăng nhập để thêm vào mục yêu thích!");

  const favoriteItem = {
    productId: product.id,
    name: product.name,
    image: product.images,
    price: product.price,
    quantity: 1,
    discount: product.discount || 0,
  };

  try {
    if (isFavorite) {
      dispatch(removeFavorite(product.id));
      toast.info(`💔 Đã xóa khỏi yêu thích: ${product.name}`);
    } else {
      const response = await addToFavorite(userId, favoriteItem);
      if (response.success) {
        dispatch(addFavorite(favoriteItem));
        toast.success(`💖 Đã thêm vào yêu thích: ${product.name}`);
      } else {
        const msg = response.message || "Thêm vào yêu thích thất bại";
        onShowError(msg);
      }
    }
  } catch (err) {
    console.error("Lỗi khi xử lý favorite:", err);
    const errorMsg = err?.response?.data?.message || "Lỗi server khi thêm yêu thích";
    onShowError(errorMsg);
  }
};
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isAddingToCart) return;
    if (!userId) return onShowError("Bạn cần đăng nhập để thêm vào giỏ hàng!");

    try {
      setIsAddingToCart(true);
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
        onShowAlert(product.name, product.images);
      } else {
        onShowError(response.data?.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.log(" err",err);
      
      onShowError("Lỗi server khi thêm giỏ hàng");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    if (isBuying) return;

    try {
      setIsBuying(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Mua ngay:", product.name);
    } catch (err) {
      console.log(" err",err);

      onShowError("Lỗi khi mua ngay");
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <Card
      onClick={() => !isAddingToCart && !isBuying && navigate(`/product/${product.id}`)}
      sx={{ borderRadius: 2, transition: "0.3s", cursor: "pointer" }}
    >
      <CardMedia component="img" image={product.images} alt={product.name} sx={{ height: 220 }} />
      <CardContent>
        <Typography fontWeight="bold" gutterBottom>{product.name}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>{product.description}</Typography>
        <Typography variant="h6" color="primary" mt={1} mb={2}>{formatPrice(product.price)}</Typography>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton onClick={handleAddToFavorite} sx={{ backgroundColor: isFavorite ? "#d32f2f" : "#f44336", color: "white" }}>
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>

          <Button
            variant="contained"
            onClick={handleBuyNow}
            startIcon={isBuying ? <CircularProgress size={16} /> : <ShoppingBag />}
            disabled={isBuying || isAddingToCart}
            sx={{ backgroundColor: "#e53e3e", color: "white", borderRadius: 2, flexGrow: 1 }}
          >
            {isBuying ? "Đang xử lý..." : "Mua ngay"}
          </Button>

          <IconButton
            onClick={handleAddToCart}
            disabled={isAddingToCart || isBuying}
            sx={{ backgroundColor: "#38a169", color: "white" }}
          >
            {isAddingToCart ? <CircularProgress size={20} /> : <ShoppingCart />}
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
  const [alertData, setAlertData] = useState({ productName: "", productImage: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const handleShowAlert = (productName, productImage) => {
    setAlertData({ productName, productImage });
    setAlertOpen(true);
  };

  const handleShowError = (message) => {
    setErrorMessage(message);
    setErrorAlertOpen(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProductUser();
        if (response.success) {
          setProducts(response.data || []);
        } else {
          console.error("Lỗi khi lấy sản phẩm:", response.message);
        }
      } catch (err) {
        console.error("Lỗi fetch:", err);
      } finally {
        setLoading(false);
      }
    };

    if (["/", "/products"].includes(location.pathname)) {
      fetchProducts();
    }
  }, [location.pathname]);

  if (location.pathname.includes("/product/")) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, borderBottom: "3px solid", borderColor: "primary.main" }}>
        Sản phẩm mới
      </Typography>

      {/* Search Bar */}
      <Paper
        elevation={3}
        sx={{
          mb: 4,
          p: 1,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <TextField
          fullWidth
          placeholder="Tìm kiếm sản phẩm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "white",
              "& fieldset": {
                border: "2px solid transparent",
              },
              "&:hover fieldset": {
                border: "2px solid #1976d2",
              },
              "&.Mui-focused fieldset": {
                border: "2px solid #1976d2",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#666" }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClearSearch}
                  size="small"
                  sx={{
                    backgroundColor: "#f44336",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#d32f2f",
                    },
                  }}
                >
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Search Results Info */}
      {searchTerm && (
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Kết quả tìm kiếm cho:
          </Typography>
          <Chip
            label={`"${searchTerm}"`}
            color="primary"
            variant="outlined"
            onDelete={handleClearSearch}
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="body2" color="text.secondary">
            ({filteredProducts.length} sản phẩm)
          </Typography>
        </Box>
      )}

      {/* No Results Message */}
      {searchTerm && filteredProducts.length === 0 && !loading && (
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            backgroundColor: "#f9f9f9",
            mb: 4,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Không tìm thấy sản phẩm nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Không có sản phẩm nào phù hợp với từ khóa "{searchTerm}"
          </Typography>
          <Button
            variant="outlined"
            onClick={handleClearSearch}
            startIcon={<Clear />}
            sx={{ borderRadius: 2 }}
          >
            Xóa bộ lọc
          </Button>
        </Paper>
      )}

      <Grid container spacing={4}>
        {loading
          ? [...Array(4)].map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rectangular" height={300} />
                <Skeleton height={30} sx={{ mt: 2 }} />
                <Skeleton height={20} width="80%" />
              </Grid>
            ))
          : filteredProducts.map((product) => (
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

      <SuccessAlert
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        productName={alertData.productName}
        productImage={alertData.productImage}
      />

      <ErrorAlert
        open={errorAlertOpen}
        onClose={() => setErrorAlertOpen(false)}
        message={errorMessage}
      />
    </Container>
  );
}