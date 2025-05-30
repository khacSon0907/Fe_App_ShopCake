import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllUsers, updateUserActive } from "../../services/userService";

export default function UserManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      Swal.fire("Lỗi", "Không thể tải danh sách người dùng", "error");
      console.log("err", err);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (userId, currentStatus) => {
    try {
       await updateUserActive(userId, !currentStatus);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, active: !currentStatus } : u
        )
      );
    } catch (err) {
      Swal.fire("Lỗi", "Không thể cập nhật trạng thái", "error");
      console.log("err", err);
      
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Quản lý người dùng
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Loại</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Avatar src={user.avatarUrl || ""} alt={user.fullname} />
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Switch
                    checked={user.active}
                    onChange={() => handleToggleActive(user.id, user.active)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  {user.role === "ADMIN" ? "Nội bộ" : "Khách hàng"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
