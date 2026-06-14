"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type Exercise = {
  id: string;
  name: string;
  topic: string;
  level: string;
  questionCount: number;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
};

export default function ExerciseManagement() {
  const [exercises] = useState<Exercise[]>([
    {
      id: "1",
      name: "Phân biệt /iː/ và /ɪ/ - Ship or Sheep",
      topic: "Nguyên âm đơn",
      level: "Dễ",
      questionCount: 10,
      status: "ACTIVE",
    },
    {
      id: "2",
      name: "Luyện âm /θ/ và /ð/ - Think vs This",
      topic: "Phụ âm khó",
      level: "Khó",
      questionCount: 15,
      status: "ACTIVE",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filteredExercises =
    filterStatus === "ALL"
      ? exercises
      : exercises.filter((ex) => ex.status === filterStatus);

  const getStatusBadge = (status: Exercise["status"]) => {
    const styles = {
      ACTIVE: "bg-success-100 text-success-700",
      DRAFT: "bg-warning-100 text-warning-700",
      ARCHIVED: "bg-neutral-100 text-neutral-700",
    };

    const labels = {
      ACTIVE: "Đang hoạt động",
      DRAFT: "Bản nháp",
      ARCHIVED: "Đã lưu trữ",
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
              <h3 className="text-lg font-bold text-neutral-900">Quản lý bài tập</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Tổng số: {exercises.length} bài tập
              </p>
            </div>
            <Button>+ Tạo bài tập mới</Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filterStatus === "ALL"
                  ? "bg-primary-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterStatus("ACTIVE")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filterStatus === "ACTIVE"
                  ? "bg-primary-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Đang hoạt động
            </button>
            <button
              onClick={() => setFilterStatus("DRAFT")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filterStatus === "DRAFT"
                  ? "bg-primary-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Bản nháp
            </button>
            <button
              onClick={() => setFilterStatus("ARCHIVED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filterStatus === "ARCHIVED"
                  ? "bg-primary-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Đã lưu trữ
            </button>
          </div>

          {/* Exercise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.map((exercise) => (
              <Card key={exercise.id} hover>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-neutral-900 flex-1">{exercise.name}</h4>
                    {getStatusBadge(exercise.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-neutral-600">
                      <span className="mr-2">📚</span>
                      <span>Chủ đề: {exercise.topic}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <span className="mr-2">📊</span>
                      <span>Cấp độ: {exercise.level}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <span className="mr-2">❓</span>
                      <span>{exercise.questionCount} câu hỏi</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 text-sm font-medium">
                      Chỉnh sửa
                    </button>
                    <button className="flex-1 px-3 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 text-sm font-medium">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              <div className="text-4xl mb-4">📝</div>
              <p>Không có bài tập nào</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
