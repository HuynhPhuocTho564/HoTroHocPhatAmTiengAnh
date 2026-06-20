"use client";

import { useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export type AdminUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

function statusVariant(status: string) {
  if (status === "ACTIVE") return "success" as const;
  if (status === "BANNED") return "error" as const;
  return "default" as const;
}

function statusLabel(status: string) {
  if (status === "ACTIVE") return "Đang hoạt động";
  if (status === "INACTIVE") return "Tạm ngưng";
  if (status === "BANNED") return "Bị khóa";
  return status;
}

export default function UserManagement({ users: initialUsers }: { users: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.toLowerCase();
    return users.filter((user) => user.username.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword));
  }, [searchTerm, users]);

  const handleEdit = (user: AdminUser) => {
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditingId(user.id);
    setError(null);
  };

  const handleSave = async () => {
    if (!editingId) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRole, status: editStatus }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error?.message || "Lỗi"); return; }
      const updated = data.data.user;
      setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, role: updated.role.name, status: updated.status } : u)));
      setEditingId(null);
    } catch { setError("Không thể kết nối server"); }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Quản lý người dùng</h2>
            <p className="mt-1 text-sm text-neutral-600">Tổng số: {users.length} người dùng</p>
          </div>
        </div>

        {error && <div className="mb-4 border-l-4 border-error-500 bg-error-50 p-4"><p className="text-sm font-medium text-error-800">{error}</p></div>}

        <div className="mb-6">
          <label htmlFor="admin-user-search" className="sr-only">Tìm kiếm người dùng</label>
          <input
            id="admin-user-search"
            type="search"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-4 focus:ring-primary-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <caption className="sr-only">Danh sách người dùng trong hệ thống</caption>
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Tên người dùng</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Vai trò</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Ngày tạo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3 text-sm font-semibold text-neutral-900">{user.username}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">
                    {editingId === user.id ? (
                      <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="rounded border border-neutral-300 px-2 py-1 text-sm">
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : user.role}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === user.id ? (
                      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="rounded border border-neutral-300 px-2 py-1 text-sm">
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="BANNED">BANNED</option>
                      </select>
                    ) : (
                      <Badge variant={statusVariant(user.status)} size="sm">{statusLabel(user.status)}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                  <td className="px-4 py-3">
                    {editingId === user.id ? (
                      <div className="flex gap-2">
                        <button type="button" onClick={handleSave} className="text-sm font-semibold text-primary-600 hover:underline">Lưu</button>
                        <button type="button" onClick={() => setEditingId(null)} className="text-sm text-neutral-500 hover:underline">Hủy</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => handleEdit(user)} className="text-sm font-semibold text-primary-600 hover:underline">Sửa</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center text-neutral-500">
            <p>Không tìm thấy người dùng nào</p>
          </div>
        )}
      </div>
    </Card>
  );
}
