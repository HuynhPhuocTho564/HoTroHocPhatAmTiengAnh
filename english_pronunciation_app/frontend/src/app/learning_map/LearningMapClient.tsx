"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

// Types
export type ExerciseUI = {
  id: string;
  name: string;
  description: string | null;
  status: string; // "ACTIVE" | "LOCKED"
};

export type LearningMapUI = {
  id: string;
  name: string;
  requirement: string | null;
  exercises: ExerciseUI[];
};

export type TopicUI = {
  id: string;
  name: string;
  description: string | null;
  maps: LearningMapUI[];
};

export default function LearningMapClient({ topics }: { topics: TopicUI[] }) {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<TopicUI | null>(null);
  const [selectedMap, setSelectedMap] = useState<LearningMapUI | null>(null);

  const getLevelColor = (req: string | null) => {
    if (req === "Dễ" || req === "Cơ bản") return "success";
    if (req === "Trung bình") return "warning";
    return "error";
  };

  const getExerciseIcon = (name: string) => {
    if (name.includes("Luyện Tai")) return "🎧";
    if (name.includes("Luyện Miệng")) return "🗣️";
    if (name.includes("Thử Thách")) return "⚡";
    if (name.includes("Thực Chiến")) return "🎯";
    return "📚";
  };

  const getExerciseColor = (name: string) => {
    if (name.includes("Luyện Tai")) return "primary";
    if (name.includes("Luyện Miệng")) return "success";
    if (name.includes("Thử Thách")) return "warning";
    if (name.includes("Thực Chiến")) return "accent";
    return "primary";
  };

  const getColorClasses = (color: string, isLocked: boolean) => {
    if (isLocked) {
      return {
        bg: "bg-neutral-100",
        icon: "bg-neutral-200 text-neutral-400",
        hover: "",
      };
    }

    const colors: Record<string, any> = {
      primary: {
        bg: "bg-white",
        icon: "bg-primary-100 text-primary-600",
        hover: "hover:shadow-lg hover:-translate-y-1",
      },
      success: {
        bg: "bg-white",
        icon: "bg-success-100 text-success-600",
        hover: "hover:shadow-lg hover:-translate-y-1",
      },
      warning: {
        bg: "bg-white",
        icon: "bg-warning-100 text-warning-600",
        hover: "hover:shadow-lg hover:-translate-y-1",
      },
      accent: {
        bg: "bg-white",
        icon: "bg-accent-100 text-accent-600",
        hover: "hover:shadow-lg hover:-translate-y-1",
      },
    };

    return colors[color] || colors.primary;
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-5xl mx-auto">
        
        {/* LEVEL 1: HIỂN THỊ DANH SÁCH TOPICS */}
        {!selectedTopic && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-neutral-900 mb-3">Lộ Trình Học Tập</h1>
              <p className="text-lg text-neutral-600">Học từ dễ đến khó, chinh phục ngữ âm tiếng Anh</p>
            </div>

            <div className="space-y-6">
              {topics.map((topic, index) => (
                <Card key={topic.id} className="relative cursor-pointer hover:shadow-lg transition-all" hover>
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-2xl font-bold shadow-md flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-neutral-900">{topic.name}</h3>
                      </div>
                      <p className="text-neutral-600 mb-4">{topic.description}</p>
                      
                      {/* Thống kê bài học */}
                      <div className="mb-4">
                        <ProgressBar 
                          value={0} 
                          max={topic.maps.length} 
                          label={`0/${topic.maps.length} bài đã hoàn thành`}
                          color="primary"
                        />
                      </div>

                      <Button onClick={() => setSelectedTopic(topic)}>
                        Xem chủ đề
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* LEVEL 2: HIỂN THỊ DANH SÁCH LEARNING MAPS CỦA 1 TOPIC */}
        {selectedTopic && !selectedMap && (
          <>
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setSelectedTopic(null)} leftIcon={<span className="mr-2">←</span>}>
                Quay lại danh sách Chủ đề
              </Button>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-neutral-900 mb-3">{selectedTopic.name}</h1>
              <p className="text-lg text-neutral-600 mb-4">{selectedTopic.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {selectedTopic.maps.map((map) => (
                <div
                  key={map.id}
                  onClick={() => setSelectedMap(map)}
                  className="relative rounded-xl border-2 border-neutral-200 p-6 bg-white cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-neutral-900">{map.name}</h3>
                    <Badge variant={getLevelColor(map.requirement) as any}>{map.requirement || 'Chưa phân loại'}</Badge>
                  </div>
                  <p className="text-neutral-500 mb-4">Gồm {map.exercises.length} dạng bài tập luyện tập</p>
                  
                  <div className="flex items-center text-primary-600 font-semibold">
                    Vào học <span className="ml-1">→</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* LEVEL 3: HIỂN THỊ DANH SÁCH EXERCISES CỦA 1 LEARNING MAP */}
        {selectedMap && (
          <>
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setSelectedMap(null)} leftIcon={<span className="mr-2">←</span>}>
                Quay lại danh sách Bài học
              </Button>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-neutral-900 mb-3">{selectedMap.name}</h1>
              <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-lg px-4 py-2 mt-4">
                <span className="text-sm text-primary-700 font-medium">Hoàn thành bài trước để mở khóa bài tiếp theo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {selectedMap.exercises.map((ex) => {
                const isLocked = false; // Tạm thời unlock để test (gốc: ex.status === "LOCKED")
                const colorCategory = getExerciseColor(ex.name);
                const colorClasses = getColorClasses(colorCategory, isLocked);
                const icon = getExerciseIcon(ex.name);

                return (
                  <div
                    key={ex.id}
                    onClick={() => {
                      if (!isLocked) {
                        router.push(`/exercises/${ex.id}`);
                      }
                    }}
                    className={`relative rounded-xl border-2 p-6 transition-all duration-200
                      ${isLocked ? "border-neutral-200 opacity-60 cursor-not-allowed" : "border-neutral-200 cursor-pointer"}
                      ${colorClasses.bg} ${colorClasses.hover}`}
                  >
                    <div className={`w-14 h-14 ${colorClasses.icon} rounded-xl flex items-center justify-center mb-4 text-2xl`}>
                      {isLocked ? "🔒" : icon}
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isLocked ? "text-neutral-500" : "text-neutral-900"}`}>
                      {ex.name}
                    </h3>
                    <p className={`text-sm mb-4 ${isLocked ? "text-neutral-400" : "text-neutral-600"}`}>
                      {ex.description}
                    </p>

                    {!isLocked && (
                      <div className="flex items-center text-primary-600 text-sm font-semibold">
                        Bắt đầu <span className="ml-1">→</span>
                      </div>
                    )}
                    {isLocked && (
                      <div className="flex items-center text-neutral-400 text-sm font-medium">
                        Đã khóa
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

      </main>
    </div>
  );
}
