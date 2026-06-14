"use client";

import React from 'react';
import DailyCheckIn from '@/components/gamification/DailyCheckIn';

export default function DashboardPage() {
  const mockUser = {
    name: "Alex",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    level: "Trung cấp",
    levelNum: 12,
    totalXP: "1.250",
    streakDays: 5,
    completedLessons: 24,
    currentLesson: {
      name: "Âm Schwa /ə/",
      desc: "Làm chủ nguyên âm phổ biến nhất trong tiếng Anh.",
      progress: 65
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        
        {/* ========================================================
            CỘT TRÁI (MAIN CONTENT) - Chiếm 2/3
            ======================================================== */}
        <div className="flex-1 px-4 sm:px-6 lg:px-12 py-10 border-r border-neutral-200">
          
          {/* Lời chào (Greeting) */}
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight tracking-tight mb-6">
            Xin chào, {mockUser.name}! Hãy cùng luyện tập những âm mới hôm nay.
          </h1>

          {/* Inline Badges - Removed XP */}
          <div className="flex flex-wrap gap-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg text-sm font-bold text-orange-700 border-2 border-orange-300 shadow-sm">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
              🔥 {mockUser.streakDays} ngày liên tiếp
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg text-sm font-bold text-purple-700 border-2 border-purple-300 shadow-sm">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ✅ {mockUser.completedLessons} bài đã hoàn thành
            </div>
          </div>

          {/* Continue Learning Card */}
          <div className="border border-neutral-200 rounded-xl p-8 hover:shadow-md transition-shadow bg-white">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">
              Tiếp tục học
            </span>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              {mockUser.currentLesson.name}
            </h2>
            <p className="text-neutral-600 mb-8">
              {mockUser.currentLesson.desc}
            </p>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm font-bold text-neutral-600 mb-2">
                <span>Tiến độ</span>
                <span>{mockUser.currentLesson.progress}%</span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-1.5">
                <div 
                  className="bg-neutral-900 h-1.5 rounded-full" 
                  style={{ width: `${mockUser.currentLesson.progress}%` }}
                ></div>
              </div>
            </div>

            <button className="bg-neutral-900 text-white font-bold py-3 px-8 rounded-lg hover:bg-neutral-800 transition-colors shadow-sm w-full sm:w-auto">
              Tiếp tục học
            </button>
          </div>

        </div>

        {/* ========================================================
            CỘT PHẢI (SIDEBAR) - Chiếm 1/3
            ======================================================== */}
        <aside className="w-full lg:w-[380px] bg-neutral-50 p-6 sm:p-10 border-l border-neutral-200">
          
          {/* User Profile Snippet */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center p-2 shadow-md">
              <img src={mockUser.avatar} alt="Avatar" className="rounded-xl w-full h-full object-cover bg-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 leading-tight">Chào mừng<br/>quay trở lại</h3>
              <p className="text-sm text-neutral-500 font-medium">Học viên cấp độ {mockUser.levelNum}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 mb-10">
            <a href="/checkin" className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-neutral-200/50 text-neutral-700 font-medium transition-colors">
              <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Điểm danh hàng ngày
            </a>
            <a href="/leaderboard" className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-neutral-200/50 text-neutral-700 font-medium transition-colors">
              <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Bảng xếp hạng
            </a>
            <a href="/badges" className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-neutral-200/50 text-neutral-700 font-medium transition-colors">
              <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Huy hiệu
            </a>
          </div>

          {/* Daily Check-in Widget */}
          <div className="mb-6">
            <DailyCheckIn
              currentStreak={mockUser.streakDays}
              longestStreak={15}
              lastCheckIn="2026-05-31T10:30:00"
            />
          </div>

          {/* Stats Cards - Only Completed Lessons */}
          <div className="space-y-4">
            {/* BÀI HỌC ĐÃ HOÀN THÀNH */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border-2 border-teal-300 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2 block">Bài học đã hoàn thành</span>
                  <span className="text-4xl font-bold text-teal-700">{mockUser.completedLessons}</span>
                </div>
                <div className="text-5xl">✅</div>
              </div>
            </div>
          </div>

          <button className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg text-sm font-bold hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-md hover:shadow-lg">
            Xem tất cả thống kê
          </button>

        </aside>

      </main>
    </div>
  );
}
