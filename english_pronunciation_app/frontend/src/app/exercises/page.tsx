"use client";

import React, { useState } from "react";

// Mock data: Trạng thái hoàn thành của từng bài học (sẽ lấy từ database sau)
type LessonProgress = {
  lesson1Completed: boolean;
  lesson2Completed: boolean;
  lesson2Score: number; // Điểm % của bài 2
  lesson3Completed: boolean;
  lesson4Completed: boolean;
};

export default function LessonsPage() {
  // Mock progress - trong thực tế sẽ fetch từ API
  const [progress] = useState<LessonProgress>({
    lesson1Completed: false,
    lesson2Completed: false,
    lesson2Score: 0,
    lesson3Completed: false,
    lesson4Completed: false,
  });

  // Logic mở khóa bài học
  const isLesson2Unlocked = progress.lesson1Completed;
  const isLesson3Unlocked = progress.lesson1Completed && progress.lesson2Completed && progress.lesson2Score >= 80;
  const isLesson4Unlocked = progress.lesson3Completed;

  const lessons = [
    {
      id: 1,
      title: "Bài 1: Luyện Tai",
      description: "Nghe và phân biệt cặp âm tối thiểu (Minimal Pairs)",
      icon: "🎧",
      color: "primary",
      isLocked: false,
      progress: progress.lesson1Completed ? 100 : 0,
      href: "/lessons/1",
    },
    {
      id: 2,
      title: "Bài 2: Luyện Miệng",
      description: "Nhìn từ vựng và phát âm chuẩn (cần 80% để mở bài 3)",
      icon: "🗣️",
      color: "success",
      isLocked: !isLesson2Unlocked,
      progress: progress.lesson2Score,
      href: "/lessons/2",
    },
    {
      id: 3,
      title: "Bài 3: Thử Thách Kép",
      description: "Đọc liên tiếp cặp từ Minimal Pairs (Ship & Sheep)",
      icon: "⚡",
      color: "warning",
      isLocked: !isLesson3Unlocked,
      progress: progress.lesson3Completed ? 100 : 0,
      href: "/lessons/3",
    },
    {
      id: 4,
      title: "Bài 4: Thực Chiến",
      description: "Đọc câu hoàn chỉnh trong ngữ cảnh thực tế",
      icon: "🎯",
      color: "accent",
      isLocked: !isLesson4Unlocked,
      progress: progress.lesson4Completed ? 100 : 0,
      href: "/lessons/4",
    },
  ];

  // Hàm xác định màu sắc theo color prop
  const getColorClasses = (color: string, isLocked: boolean) => {
    if (isLocked) {
      return {
        bg: "bg-neutral-100",
        icon: "bg-neutral-200 text-neutral-400",
        badge: "bg-neutral-200 text-neutral-500",
        hover: "",
      };
    }

    const colors: Record<string, any> = {
      primary: {
        bg: "bg-white",
        icon: "bg-primary-100 text-primary-600",
        badge: "bg-yellow-100 text-yellow-700",
        hover: "hover:shadow-lg hover:-translate-y-1",
      },
      success: {
        bg: "bg-white",
        icon: "bg-success-100 text-success-600",
        badge: "bg-yellow-100 text-yellow-700",
        hover: "hover:shadow-lg hover:-translate-y-1",
      },
      warning: {
        bg: "bg-white",
        icon: "bg-warning-100 text-warning-600",
        badge: "bg-yellow-100 text-yellow-700",
        hover: "hover:shadow-lg hover:-translate-y-1",
      },
      accent: {
        bg: "bg-white",
        icon: "bg-accent-100 text-accent-600",
        badge: "bg-yellow-100 text-yellow-700",
        hover: "hover:shadow-lg hover:-translate-y-1",
      },
    };

    return colors[color] || colors.primary;
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            Bài Học Luyện Phát Âm
          </h1>
          <p className="text-lg text-neutral-600">
            Phương pháp "Ship or Sheep" - Học từ dễ đến khó
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-lg px-4 py-2">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-primary-700 font-medium">
              Hoàn thành bài trước để mở khóa bài tiếp theo
            </span>
          </div>
        </div>

        {/* Grid bài học */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {lessons.map((lesson) => {
            const colorClasses = getColorClasses(lesson.color, lesson.isLocked);
            
            return (
              <div
                key={lesson.id}
                className={`
                  relative rounded-xl border-2 p-6 transition-all duration-200
                  ${lesson.isLocked ? "border-neutral-200 opacity-60 cursor-not-allowed" : "border-neutral-200 cursor-pointer"}
                  ${colorClasses.bg}
                  ${colorClasses.hover}
                `}
                onClick={() => {
                  if (!lesson.isLocked) {
                    // TODO: Navigate to lesson page
                    console.log(`Navigate to ${lesson.href}`);
                  }
                }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${colorClasses.icon} rounded-xl flex items-center justify-center mb-4 text-2xl`}>
                  {lesson.isLocked ? "🔒" : lesson.icon}
                </div>

                {/* Tiêu đề */}
                <h3 className={`text-xl font-bold mb-2 ${lesson.isLocked ? "text-neutral-500" : "text-neutral-900"}`}>
                  {lesson.title}
                </h3>

                {/* Mô tả */}
                <p className={`text-sm mb-4 ${lesson.isLocked ? "text-neutral-400" : "text-neutral-600"}`}>
                  {lesson.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-500 font-medium">Tiến độ</span>
                    <span className="text-xs text-neutral-500 font-medium">{lesson.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        lesson.isLocked ? "bg-neutral-300" : "bg-primary-500"
                      }`}
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                {!lesson.isLocked && (
                  <div className="flex items-center text-primary-600 text-sm font-semibold">
                    {lesson.progress === 100 ? "Ôn tập lại" : "Bắt đầu"}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}

                {lesson.isLocked && (
                  <div className="flex items-center text-neutral-400 text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Đã khóa
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hướng dẫn */}
        <div className="mt-12 max-w-2xl mx-auto bg-white border border-neutral-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <span>📚</span>
            Cách Học Hiệu Quả
          </h3>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">1.</span>
              <span><strong>Luyện Tai trước:</strong> Nghe và phân biệt được sự khác nhau giữa 2 âm</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success-600 font-bold">2.</span>
              <span><strong>Luyện Miệng sau:</strong> Phát âm chính xác từng từ riêng lẻ (cần đạt 80%)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warning-600 font-bold">3.</span>
              <span><strong>Thử Thách Kép:</strong> Đọc liên tiếp 2 từ để tạo sự tương phản rõ ràng</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-600 font-bold">4.</span>
              <span><strong>Thực Chiến:</strong> Áp dụng vào câu hoàn chỉnh trong giao tiếp thực tế</span>
            </li>
          </ul>
        </div>

      </main>
    </div>
  );
}
