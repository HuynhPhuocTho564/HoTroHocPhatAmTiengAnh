"use client";

import { useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
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

export default function UserManagement({ users }: { users: AdminUser[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.toLowerCase();
    return users.filter((user) => user.username.toLowerCase().includes(keyword) || user.email.toLowerCase().includes(keyword));
  }, [searchTerm, users]);

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Quản lý người dùng</h2>
            <p className="mt-1 text-sm text-neutral-600">Tổng số: {users.length} người dùng</p>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="admin-user-search" className="sr-only">
            Tìm kiếm người dùng
          </label>
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
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3 text-sm font-semibold text-neutral-900">{user.username}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{user.role}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant(user.status)} size="sm">
                      {statusLabel(user.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
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
