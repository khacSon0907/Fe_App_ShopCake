import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Fade,
  Slide,
} from "@mui/material";
import { Add, Delete, Edit, Category, Cake } from "@mui/icons-material";
import { useEffect, useState, forwardRef } from "react";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../services/userService";
import Swal from "sweetalert2";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CategoryManage() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [originalCode, setOriginalCode] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getAllCategories();
    setCategories(res.data || []);
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setForm({
        code: category.code,
        name: category.name,
        description: category.description
      });
      setOriginalCode(category.code);
      setIsEditing(true);
    } else {
      setForm({ code: "", name: "", description: "" });
      setOriginalCode("");
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setForm({ code: "", name: "", description: "" });
    setIsEditing(false);
    setOriginalCode("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        const updateData = {
          code: form.code,
          name: form.name,
          description: form.description
        };

        console.log("update data:", updateData);
        console.log("original code:", originalCode);
        
        const resUpdate = await updateCategory(updateData);
        console.log("resUpdate", resUpdate);
        
        Swal.fire({
          title: "Thành công!",
          text: "Cập nhật danh mục thành công!",
          icon: "success",
          confirmButtonColor: "#ff6b35"
        });
      } else {
        const createData = {
          code: form.code,
          name: form.name,
          description: form.description
        };
        
        console.log("create data:", createData);
        
        await createCategory(createData);
        Swal.fire({
          title: "Thành công!",
          text: "Thêm danh mục thành công!",
          icon: "success",
          confirmButtonColor: "#ff6b35"
        });
      }
      
      fetchData();
      handleCloseDialog();
    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        title: "Lỗi!",
        text: err?.response?.data?.message || "Đã có lỗi xảy ra",
        icon: "error",
        confirmButtonColor: "#ff6b35"
      });
    }
  };

  const handleDelete = async (code) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn sẽ không thể khôi phục lại danh mục này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ff4757",
      cancelButtonColor: "#57606f",
    });

    if (confirm.isConfirmed) {
      try {
        const resss = await deleteCategory(code);
        console.log("delete result:", resss);
        
        fetchData();
        Swal.fire({
          title: "Đã xóa!",
          text: "Danh mục đã được xóa.",
          icon: "success",
          confirmButtonColor: "#ff6b35"
        });
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire({
          title: "Lỗi!",
          text: err?.response?.data?.message || "Không thể xóa danh mục",
          icon: "error",
          confirmButtonColor: "#ff6b35"
        });
      }
    }
  };

  return (
    <Box 
      sx={{ 
        p: 4,
        background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8e0 100%)',
        minHeight: '100vh'
      }}
    >
      {/* Header Section */}
      <Card 
        elevation={0}
        sx={{ 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
          color: 'white'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  width: 56, 
                  height: 56 
                }}
              >
                <Cake fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                  Quản lý danh mục bánh
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Quản lý các loại bánh trong cửa hàng của bạn
                </Typography>
              </Box>
            </Stack>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Thêm danh mục mới
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Card 
          elevation={0}
          sx={{ 
            flex: 1, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h3" fontWeight={700}>
                  {categories.length}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Tổng danh mục
                </Typography>
              </Box>
              <Category fontSize="large" sx={{ opacity: 0.8 }} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Main Table */}
      <Card elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow 
                sx={{ 
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                }}
              >
                <TableCell sx={{ fontWeight: 700, fontSize: '1rem', py: 2 }}>
                  Mã danh mục
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '1rem', py: 2 }}>
                  Tên danh mục
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '1rem', py: 2 }}>
                  Mô tả
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '1rem', py: 2 }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat, index) => (
                <Fade in={true} timeout={300 + index * 100} key={cat._id || cat.code}>
                  <TableRow 
                    sx={{ 
                      '&:hover': { 
                        bgcolor: '#fff8f5',
                        transform: 'scale(1.005)',
                        boxShadow: '0 4px 20px rgba(255,107,53,0.1)'
                      },
                      transition: 'all 0.3s ease',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <TableCell sx={{ py: 2.5 }}>
                      <Chip 
                        label={cat.code} 
                        size="small"
                        sx={{ 
                          bgcolor: '#ffe8e0', 
                          color: '#ff6b35',
                          fontWeight: 600,
                          borderRadius: 2
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2.5, fontSize: '1rem', fontWeight: 500 }}>
                      {cat.name}
                    </TableCell>
                    <TableCell sx={{ py: 2.5, color: '#6c757d' }}>
                      {cat.description}
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2.5 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton 
                          onClick={() => handleOpenDialog(cat)}
                          sx={{
                            bgcolor: '#e3f2fd',
                            color: '#1976d2',
                            borderRadius: 2,
                            '&:hover': {
                              bgcolor: '#bbdefb',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(cat.code)}
                          sx={{
                            bgcolor: '#ffebee',
                            color: '#f44336',
                            borderRadius: 2,
                            '&:hover': {
                              bgcolor: '#ffcdd2',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(244,67,54,0.3)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </Fade>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                    <Stack alignItems="center" spacing={2}>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          bgcolor: '#f5f5f5',
                          color: '#9e9e9e'
                        }}
                      >
                        <Category fontSize="large" />
                      </Avatar>
                      <Typography variant="h6" color="text.secondary">
                        Chưa có danh mục nào
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hãy thêm danh mục đầu tiên cho cửa hàng bánh của bạn
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dialog */}
      <Dialog 
        open={open} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm"
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            color: 'white',
            textAlign: 'center',
            py: 3
          }}
        >
          <Stack alignItems="center" spacing={1}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              {isEditing ? <Edit /> : <Add />}
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {isEditing ? "Cập nhật danh mục" : "Thêm danh mục mới"}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <TextField
            margin="normal"
            label="Mã code danh mục"
            fullWidth
            name="code"
            value={form.code}
            onChange={handleChange}
            disabled={isEditing}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#ff6b35',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b35',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#ff6b35',
              },
            }}
          />
          <TextField
            margin="normal"
            label="Tên danh mục"
            fullWidth
            name="name"
            value={form.name}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#ff6b35',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b35',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#ff6b35',
              },
            }}
          />
          <TextField
            margin="normal"
            label="Mô tả"
            fullWidth
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#ff6b35',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b35',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#ff6b35',
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              borderRadius: 2,
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(255,107,53,0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e55a2b 0%, #e0841a 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(255,107,53,0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}