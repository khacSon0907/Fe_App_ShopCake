import { useState, useEffect } from 'react';
  import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Chip,
    Avatar,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    InputAdornment,
    Tabs,
    Tab,
    Alert,
    Snackbar,
    CircularProgress,
    Tooltip
  } from '@mui/material';
  import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    CloudUpload as UploadIcon,
    Visibility as ViewIcon,
    ShoppingCart as CartIcon,
    Inventory as InventoryIcon,
    Category as CategoryIcon,
    AttachMoney as MoneyIcon,
    FilterList as FilterIcon
  } from '@mui/icons-material';

  // Import your API service
  import {createProduct, getAllProducts,deleteProductById, getAllCategories,updateProduct} from '../../services/userService'; 

  const ProductManage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // Changed to state
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    // Form state
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      price: '',
      categoryCode: '',
      stock: '',
      ingredients: '',
      size: 'Medium',
      weight: '',
      isAvailable: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const sizes = ['Small', 'Medium', 'Large', 'Extra Large'];

    // Fetch products and categories from API
    useEffect(() => {
      fetchProducts();
      fetchCategories();
    }, []);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAllProducts();
        
        console.log("products response", response);
        
        if (response.success) {
          console.log("products loaded successfully");
          setProducts(response.data || []);
        } else {
          showNotification(response.data?.message || 'Lỗi khi tải danh sách sản phẩm', 'error');
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        showNotification('Lỗi khi tải danh sách sản phẩm', 'error');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        
        console.log("categories response", response);
        
        if (response.success) {
          console.log("categories loaded successfully");
          // Assuming the API returns categories in format: [{id, code, name}, ...]
          // Adjust the mapping based on your actual API response structure
          setCategories(response.data || []);
        } else {
          showNotification(response.data?.message || 'Lỗi khi tải danh sách danh mục', 'error');
          // Fallback to default categories if API fails
          setCategories([
            { code: 'CAKE', name: 'Bánh ngọt' },
            { code: 'DRINK', name: 'Đồ uống' },
            { code: 'BREAD', name: 'Bánh mì' },
            { code: 'DESSERT', name: 'Tráng miệng' }
          ]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        showNotification('Lỗi khi tải danh sách danh mục', 'error');
        // Fallback to default categories if API fails
        setCategories([
          { code: 'CAKE', name: 'Bánh ngọt' },
          { code: 'DRINK', name: 'Đồ uống' },
          { code: 'BREAD', name: 'Bánh mì' },
          { code: 'DESSERT', name: 'Tráng miệng' }
        ]);
      }
    };

    const handleSubmit = async () => {
  try {
    setLoading(true);

    const formDataToSend = new FormData();

    const requestData = {
      id: editingProduct?.id, // cần có ID khi update
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      categoryCode: formData.categoryCode,
      stock: parseInt(formData.stock),
      ingredients: formData.ingredients,
      size: formData.size,
      weight: parseFloat(formData.weight),
      isAvailable: formData.isAvailable
    };

    formDataToSend.append('request', JSON.stringify(requestData));
    if (imageFile) {
      formDataToSend.append('imageFile', imageFile);
    }

    let response;
    if (editingProduct) {
      response = await updateProduct(formDataToSend); // UPDATE
    } else {
      response = await createProduct(formDataToSend); // CREATE
    }

    if (response.success) {
      showNotification(editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Tạo sản phẩm mới thành công!', 'success');
      fetchProducts(); // reload danh sách
      handleCloseDialog();
    } else {
      showNotification(response.data?.message || 'Có lỗi xảy ra', 'error');
    }

  } catch (error) {
    console.error("Error:", error);
    showNotification('Lỗi kết nối đến server', 'error');
  } finally {
    setLoading(false);
  }
};

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          showNotification('Vui lòng chọn file hình ảnh', 'error');
          return;
        }
        
        // Validate file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showNotification('Kích thước file không được vượt quá 5MB', 'error');
          return;
        }
        
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      }
    };

    const handleEdit = (product) => {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        categoryCode: product.categoryCode || '',
        stock: product.stock?.toString() || '',
        ingredients: product.ingredients || '',
        size: product.size || 'Medium',
        weight: product.weight?.toString() || '',
        isAvailable: product.isAvailable !== undefined ? product.isAvailable : true
      });
      setImagePreview(product.images || '');
      setImageFile(null); // Reset file input
      setOpenDialog(true);
    };

    const handleDelete = async (productId) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        try {
          setLoading(true);
          const response = await deleteProductById(productId);
          
          console.log("delete response", response);
          
          if (response.success) {
            console.log("delete successful");
            setProducts(prev => prev.filter(p => p.id !== productId));
            showNotification('Xóa sản phẩm thành công!', 'success');
          } else {
            showNotification(response.data?.message || 'Lỗi khi xóa sản phẩm', 'error');
          }
        } catch (error) {
          console.error("Error deleting product:", error);
          showNotification('Lỗi khi xóa sản phẩm', 'error');
        } finally {
          setLoading(false);
        }
      }
    };

    const handleCloseDialog = () => {
      setOpenDialog(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryCode: '',
        stock: '',
        ingredients: '',
        size: 'Medium',
        weight: '',
        isAvailable: true
      });
      setImageFile(null);
      setImagePreview('');
    };

    const showNotification = (message, severity) => {
      setNotification({ open: true, message, severity });
    };

    const filteredProducts = products.filter(product => {
      const matchSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === '' || product.categoryCode === selectedCategory;
      return matchSearch && matchCategory;
    });

    const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    };

    const getCategoryName = (code) => {
      const category = categories.find(cat => cat.code === code);
      return category ? category.name : code;
    };

    const TabPanel = ({ children, value, index }) => (
      <div hidden={value !== index}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );

    return (
      <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
        {/* Header */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                <InventoryIcon sx={{ fontSize: 30 }} />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" fontWeight="bold">
                Quản lý sản phẩm
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Quản lý danh sách sản phẩm của cửa hàng
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                Thêm sản phẩm
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Filters */}
        <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Danh mục"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {categories.map(cat => (
                    <MenuItem key={cat.code} value={cat.code}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary">
                Tổng: {filteredProducts.length} sản phẩm
              </Typography>
            </Grid>
            <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
              <Button
                variant="outlined"
                startIcon={<SearchIcon />}
                onClick={() => {
                  fetchProducts();
                  fetchCategories();
                }}
                disabled={loading}
              >
                Làm mới
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Paper elevation={0} sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab 
              icon={<ViewIcon />} 
              label="Danh sách" 
              iconPosition="start"
            />
            <Tab 
              icon={<CategoryIcon />} 
              label="Thống kê" 
              iconPosition="start"
            />
          </Tabs>
          
          <TabPanel value={tabValue} index={0}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : filteredProducts.length === 0 ? (
              <Box textAlign="center" p={4}>
                <Typography variant="h6" color="text.secondary">
                  Không có sản phẩm nào
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {searchTerm || selectedCategory ? 'Thử thay đổi bộ lọc tìm kiếm' : 'Hãy thêm sản phẩm đầu tiên'}
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell>Hình ảnh</TableCell>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell>Danh mục</TableCell>
                      <TableCell>Giá</TableCell>
                      <TableCell>Tồn kho</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id} hover>
                        <TableCell>
                          <Avatar
                            src={product.images}
                            variant="rounded"
                            sx={{ width: 60, height: 60 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                            {product.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getCategoryName(product.categoryCode)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="medium" color="primary">
                            {formatPrice(product.price)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={product.stock}
                            size="small"
                            color={product.stock > 10 ? "success" : product.stock > 0 ? "warning" : "error"}
                            icon={<InventoryIcon />}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={product.isAvailable ? "Còn hàng" : "Hết hàng"}
                            size="small"
                            color={product.isAvailable ? "success" : "default"}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(product)}
                              sx={{ color: 'primary.main' }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(product.id)}
                              sx={{ color: 'error.main' }}
                              disabled={loading}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <MoneyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {filteredProducts.length}
                  </Typography>
                  <Typography color="text.secondary">Tổng sản phẩm</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <CartIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {filteredProducts.filter(p => p.isAvailable).length}
                  </Typography>
                  <Typography color="text.secondary">Còn hàng</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <InventoryIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {filteredProducts.reduce((total, p) => total + (p.stock || 0), 0)}
                  </Typography>
                  <Typography color="text.secondary">Tổng tồn kho</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <MoneyIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold">
                    {formatPrice(filteredProducts.reduce((total, p) => total + (p.price || 0), 0))}
                  </Typography>
                  <Typography color="text.secondary">Tổng giá trị</Typography>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>

        {/* Create/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tên sản phẩm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  margin="normal"
                  required
                  error={!formData.name && formData.name !== ''}
                  helperText={!formData.name && formData.name !== '' ? "Tên sản phẩm là bắt buộc" : ""}
                />
                <TextField
                  fullWidth
                  label="Mô tả"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  margin="normal"
                  multiline
                  rows={3}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Giá (VND)"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      margin="normal"
                      required
                      error={!formData.price}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₫</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Tồn kho"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      margin="normal"
                      required
                      error={!formData.stock}
                    />
                  </Grid>
                </Grid>
                <FormControl fullWidth margin="normal" required error={!formData.categoryCode}>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    value={formData.categoryCode}
                    onChange={(e) => setFormData({ ...formData, categoryCode: e.target.value })}
                    label="Danh mục"
                  >
                    {categories.map(cat => (
                      <MenuItem key={cat.code} value={cat.code}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Card
                      sx={{
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: '2px dashed #ccc',
                        '&:hover': { borderColor: 'primary.main' }
                      }}
                    >
                      {imagePreview ? (
                        <CardMedia
                          component="img"
                          image={imagePreview}
                          alt="Preview"
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Box textAlign="center">
                          <UploadIcon sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
                          <Typography color="text.secondary">
                            Nhấn để tải ảnh lên
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            (JPG, PNG, max 5MB)
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  </label>
                </Box>
                
                <TextField
                  fullWidth
                  label="Thành phần"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  margin="normal"
                  multiline
                  rows={2}
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Kích thước</InputLabel>
                      <Select
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        label="Kích thước"
                      >
                        {sizes.map(size => (
                          <MenuItem key={size} value={size}>{size}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Trọng lượng (g)"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    />
                  }
                  label="Còn bán"
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} disabled={loading}>
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !formData.name || !formData.price || !formData.categoryCode}
              startIcon={loading ? <CircularProgress size={16} /> : null}
            >
              {editingProduct ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  };

  export default ProductManage;