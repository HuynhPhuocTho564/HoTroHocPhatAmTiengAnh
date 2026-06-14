"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import UserManagement from "@/components/admin/UserManagement";
import ExerciseManagement from "@/components/admin/ExerciseManagement";
import AudioManagement from "@/components/admin/AudioManagement";
import ReportsAnalytics from "@/components/admin/ReportsAnalytics";

type AdminTab = "overview" | "users" | "exercises" | "topics" | "audio" | "badges" | "reports";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Mock data - sẽ fetch từ API sau
  const stats = {
    totalUsers: 1234,
    activeUsers: 856,
    totalExercises: 45,
    totalAudioFiles: 120,
    completedAttempts: 5678,
  };

  const tabs = [
    { id: "overview" as AdminTab, name: "Tổng quan", icon: "📊" },
    { id: "users" as AdminTab, name: "Quản lý người dùng", icon: "👥" },
    { id: "exercises" as AdminTab, name: "Quản lý bài tập", icon: "📝" },
    { id: "topics" as AdminTab, name: "Quản lý chủ đề", icon: "📚" },
    { id: "audio" as AdminTab, name: "Quản lý âm thanh", icon: "🎵" },
    { id: "badges" as AdminTab, name: "Cấu hình Gamification", icon: "🏆" },
    { id: "reports" as AdminTab, name: "Thống kê & Báo cáo", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Skip to main content - WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg"
      >
        Bỏ qua đến nội dung chính
      </a>

      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-neutral-600 mt-1">
                Quản trị hệ thống PhatAmEN
              </p>
            </div>
            <button
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors text-sm font-medium min-h-[44px]"
              aria-label="Đăng xuất khỏi hệ thống"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content" tabIndex={-1}>
        {/* Tabs Navigation - WCAG 2.1.1 Keyboard Accessible */}
        <nav className="mb-8 overflow-x-auto" role="navigation" aria-label="Điều hướng quản trị">
          <div
            className="flex gap-2 min-w-max"
            role="tablist"
            aria-label="Các chức năng quản trị"
          >
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onKeyDown={(e) => {
                  // Keyboard navigation: Arrow keys
                  if (e.key === "ArrowRight") {
                    const nextIndex = (index + 1) % tabs.length;
                    setActiveTab(tabs[nextIndex].id);
                    document.getElementById(`tab-${tabs[nextIndex].id}`)?.focus();
                  } else if (e.key === "ArrowLeft") {
                    const prevIndex = (index - 1 + tabs.length) % tabs.length;
                    setActiveTab(tabs[prevIndex].id);
                    document.getElementById(`tab-${tabs[prevIndex].id}`)?.focus();
                  }
                }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap min-h-[44px]
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  ${
                    activeTab === tab.id
                      ? "bg-primary-600 text-white"
                      : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
                  }
                `}
              >
                <span className="mr-2" aria-hidden="true">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Content - WCAG 4.1.2 Name, Role, Value */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
        >
        {activeTab === "overview" && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Tổng người dùng</span>
                    <span className="text-2xl">👥</span>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">{stats.totalUsers}</p>
                  <p className="text-xs text-success-600 mt-2">↑ +12% so với tháng trước</p>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Người dùng hoạt động</span>
                    <span className="text-2xl">✅</span>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">{stats.activeUsers}</p>
                  <p className="text-xs text-success-600 mt-2">↑ +8% so với tháng trước</p>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Tổng bài tập</span>
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">{stats.totalExercises}</p>
                  <p className="text-xs text-neutral-500 mt-2">Trong 5 chủ đề</p>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">Lượt hoàn thành</span>
                    <span className="text-2xl">🎯</span>
                  </div>
                  <p className="text-3xl font-bold text-neutral-900">{stats.completedAttempts}</p>
                  <p className="text-xs text-success-600 mt-2">↑ +25% so với tháng trước</p>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("exercises")}
                    className="p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                  >
                    <div className="text-2xl mb-2">➕</div>
                    <div className="font-semibold text-neutral-900">Tạo bài tập mới</div>
                    <div className="text-sm text-neutral-600 mt-1">Thêm bài tập luyện phát âm</div>
                  </button>

                  <button
                    onClick={() => setActiveTab("users")}
                    className="p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                  >
                    <div className="text-2xl mb-2">👤</div>
                    <div className="font-semibold text-neutral-900">Quản lý người dùng</div>
                    <div className="text-sm text-neutral-600 mt-1">Xem danh sách và phân quyền</div>
                  </button>

                  <button
                    onClick={() => setActiveTab("reports")}
                    className="p-4 border-2 border-neutral-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                  >
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-semibold text-neutral-900">Xem báo cáo</div>
                    <div className="text-sm text-neutral-600 mt-1">Thống kê chi tiết</div>
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "users" && <UserManagement />}
        {activeTab === "exercises" && <ExerciseManagement />}
        {activeTab === "audio" && <AudioManagement />}
        {activeTab === "reports" && <ReportsAnalytics />}

        {activeTab === "topics" && (
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-neutral-900">Quản lý chủ đề</h3>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                  + Thêm chủ đề
                </button>
              </div>
              <div className="text-center py-12 text-neutral-500">
                <div className="text-4xl mb-4">📚</div>
                <p>Chức năng đang phát triển</p>
                <p className="text-sm mt-2">Sẽ hiển thị danh sách chủ đề và cấp độ</p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "badges" && (
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-neutral-900">Cấu hình Gamification</h3>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors text-sm font-medium min-h-[44px]">
                  + Tạo huy hiệu mới
                </button>
              </div>
              <div className="text-center py-12 text-neutral-500">
                <div className="text-4xl mb-4">🏆</div>
                <p>Chức năng đang phát triển</p>
                <p className="text-sm mt-2">Sẽ hiển thị danh sách huy hiệu và điều kiện đạt được</p>
              </div>
            </div>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
}
