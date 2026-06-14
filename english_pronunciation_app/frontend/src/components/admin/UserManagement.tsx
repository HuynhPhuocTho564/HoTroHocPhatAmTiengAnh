"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  createdAt: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "nguyenvana",
      email: "nguyenvana@example.com",
      role: "Học viên",
      status: "ACTIVE",
      createdAt: "2026-05-15",
    },
    {
      id: "2",
      username: "tranthib",
      email: "tranthib@example.com",
      role: "Học viên",
      status: "ACTIVE",
      createdAt: "2026-05-20",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const getStatusBadge = (status: User["status"]) => {
    const styles = {
      ACTIVE: "bg-success-100 text-success-700",
      INACTIVE: "bg-neutral-100 text-neutral-700",
      BANNED: "bg-error-100 text-error-700",
    };

    const labels = {
      ACTIVE: "Hoạt động",
      INACTIVE: "Không hoạt động",
      BANNED: "Bị cấm",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div>
      <Card>
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Quản lý người dùng</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Tổng số: {users.length} người dùng
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>+ Thêm người dùng</Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    Tên người dùng
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    Vai trò
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">
                    Ngày tạo
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4 text-sm text-neutral-900">{user.username}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">{user.email}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">{user.role}</td>
                    <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">{user.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-error-600 hover:text-error-700 text-sm font-medium"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              <p>Không tìm thấy người dùng nào</p>
            </div>
          )}
        </div>
      </Card>

      {/* Modal thêm/sửa người dùng */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tên người dùng
            </label>
            <input
              type="text"
              defaultValue={selectedUser?.username}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              defaultValue={selectedUser?.email}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Vai trò</label>
            <select
              defaultValue={selectedUser?.role}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Học viên">Học viên</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Trạng thái</label>
            <select
              defaultValue={selectedUser?.status}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Không hoạt động</option>
              <option value="BANNED">Bị cấm</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" className="flex-1">
              {selectedUser ? "Cập nhật" : "Tạo mới"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedUser(null);
              }}
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
