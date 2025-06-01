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
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../../services/userService";
import Swal from "sweetalert2";

export default function CategoryManage() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false); // Thay đổi từ editingId sang isEditing
  const [originalCode, setOriginalCode] = useState(""); // Lưu code gốc để update

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
      setOriginalCode(category.code); // Lưu code gốc
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
        // Update category - sử dụng originalCode để identify
        const updateData = {
          code: form.code,
          name: form.name,
          description: form.description
        };

        console.log("update data:", updateData);
        console.log("original code:", originalCode);
        
        const resUpdate = await updateCategory(updateData);
        console.log("resUpdate", resUpdate);
        
        Swal.fire("Thành công", "Cập nhật danh mục thành công!", "success");
      } else {
        // Create new category
        const createData = {
          code: form.code,
          name: form.name,
          description: form.description
        };
        
        console.log("create data:", createData);
        
        await createCategory(createData);
        Swal.fire("Thành công", "Thêm danh mục thành công!", "success");
      }
      
      fetchData();
      handleCloseDialog();
    } catch (err) {
      console.error("Error:", err);
      Swal.fire("Lỗi", err?.response?.data?.message || "Đã có lỗi xảy ra", "error");
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
    });

    if (confirm.isConfirmed) {
      try {
        const resss = await deleteCategory(code);
        console.log("delete result:", resss);
        
        fetchData();
        Swal.fire("Đã xóa!", "Danh mục đã được xóa.", "success");
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Lỗi", err?.response?.data?.message || "Không thể xóa danh mục", "error");
      }
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={700}>
          Quản lý danh mục
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Thêm danh mục
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã</TableCell>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat._id || cat.code}>
                <TableCell>{cat.code}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenDialog(cat)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(cat.code)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không có danh mục nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? "Cập nhật danh mục" : "Thêm danh mục mới"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Mã code danh mục"
            fullWidth
            name="code"
            value={form.code}
            onChange={handleChange}
            disabled={isEditing} // Disable code khi edit để tránh conflict
          />
          <TextField
            margin="normal"
            label="Tên danh mục"
            fullWidth
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Mô tả"
            fullWidth
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}