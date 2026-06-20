"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

export type ExerciseUI = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  questionCount: number;
  bestScore: number | null;
  isCompleted: boolean;
};

export type LearningMapUI = {
  id: string;
  name: string;
  requirement: string | null;
  status: string;
  subcategory: string | null;
  exercises: ExerciseUI[];
};

export type TopicUI = {
  id: string;
  name: string;
  description: string | null;
  maps: LearningMapUI[];
  isLocked?: boolean;
  completionPercent?: number;
  prerequisiteName?: string;
};

type Tone = "primary" | "success" | "warning" | "accent";

const toneClasses: Record<
  Tone,
  {
    icon: string;
    border: string;
    text: string;
    subtle: string;
  }
> = {
  primary: {
    icon: "bg-primary-50 text-primary-700 border-primary-200",
    border: "hover:border-primary-300 focus-visible:ring-primary-500",
    text: "text-primary-700",
    subtle: "bg-primary-50 border-primary-200",
  },
  success: {
    icon: "bg-success-50 text-success-700 border-success-200",
    border: "hover:border-success-300 focus-visible:ring-success-500",
    text: "text-success-700",
    subtle: "bg-success-50 border-success-200",
  },
  warning: {
    icon: "bg-warning-50 text-warning-700 border-warning-200",
    border: "hover:border-warning-300 focus-visible:ring-warning-500",
    text: "text-warning-700",
    subtle: "bg-warning-50 border-warning-200",
  },
  accent: {
    icon: "bg-accent-50 text-accent-700 border-accent-200",
    border: "hover:border-accent-300 focus-visible:ring-accent-500",
    text: "text-accent-700",
    subtle: "bg-accent-50 border-accent-200",
  },
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getRequirementVariant(requirement: string | null): BadgeVariant {
  const normalized = normalizeText(requirement ?? "");
  if (normalized.includes("trung")) return "warning";
  if (normalized.includes("kho") || normalized.includes("hard")) return "error";
  if (normalized.includes("de") || normalized.includes("basic") || normalized.includes("easy")) return "success";
  return "default";
}

function getStatusVariant(status: string): BadgeVariant {
  if (status === "ACTIVE") return "success";
  if (status === "LOCKED" || status === "DRAFT") return "warning";
  if (status === "ARCHIVED") return "error";
  return "default";
}

function getStatusLabel(status: string) {
  if (status === "ACTIVE") return "Sẵn sàng";
  if (status === "LOCKED") return "Chưa sẵn sàng";
  if (status === "DRAFT") return "Bản nháp";
  if (status === "ARCHIVED") return "Đã lưu trữ";
  return status;
}

function getExerciseTone(name: string): Tone {
  const normalized = normalizeText(name);
  if (normalized.includes("tai") || normalized.includes("listen")) return "primary";
  if (normalized.includes("mieng") || normalized.includes("speak")) return "success";
  if (normalized.includes("thach") || normalized.includes("challenge")) return "warning";
  if (normalized.includes("thuc chien") || normalized.includes("real")) return "accent";
  return "primary";
}

function getExerciseShortCode(name: string) {
  const normalized = normalizeText(name);
  if (normalized.includes("tai") || normalized.includes("listen")) return "L";
  if (normalized.includes("mieng") || normalized.includes("speak")) return "S";
  if (normalized.includes("thach") || normalized.includes("challenge")) return "C";
  if (normalized.includes("thuc chien") || normalized.includes("real")) return "R";
  return "B";
}

function getTopicStats(topic: TopicUI) {
  const total = topic.maps.reduce((sum, map) => sum + map.exercises.length, 0);
  const completed = topic.maps.reduce(
    (sum, map) => sum + map.exercises.filter((exercise) => exercise.isCompleted).length,
    0,
  );

  return { completed, total };
}

function getMapStats(map: LearningMapUI) {
  const total = map.exercises.length;
  const completed = map.exercises.filter((exercise) => exercise.isCompleted).length;

  return { completed, total };
}

function groupMapsBySubcategory(maps: LearningMapUI[]) {
  // Gom maps theo subcategory, giữ thứ tự xuất hiện (maps đã sort theo id ở page.tsx).
  // null → nhóm "không phân loại", UI render phẳng (cho CĐ3/4).
  const groups: { subcategory: string | null; maps: LearningMapUI[] }[] = [];
  for (const map of maps) {
    const key = map.subcategory ?? null;
    const existing = groups.find((g) => g.subcategory === key);
    if (existing) {
      existing.maps.push(map);
    } else {
      groups.push({ subcategory: key, maps: [map] });
    }
  }
  return groups;
}

export default function LearningMapClient({ topics }: { topics: TopicUI[] }) {
  const [selectedTopic, setSelectedTopic] = useState<TopicUI | null>(null);
  const [selectedMap, setSelectedMap] = useState<LearningMapUI | null>(null);

  const overview = useMemo(() => {
    const totalMaps = topics.reduce((sum, topic) => sum + topic.maps.length, 0);
    const totalExercises = topics.reduce((sum, topic) => sum + getTopicStats(topic).total, 0);
    const completedExercises = topics.reduce((sum, topic) => sum + getTopicStats(topic).completed, 0);

    return { totalMaps, totalExercises, completedExercises };
  }, [topics]);

  const openTopic = (topic: TopicUI) => {
    setSelectedTopic(topic);
    setSelectedMap(null);
  };

  const backToTopics = () => {
    setSelectedTopic(null);
    setSelectedMap(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-6xl">
        {!selectedTopic && (
          <>
            <section className="mb-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary-700">Lộ trình học</p>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-neutral-900">Lộ trình học tập</h1>
                  <p className="mt-3 max-w-3xl text-lg text-neutral-600">
                    Chọn chủ đề, sau đó chọn nhóm âm và dạng bài phù hợp để luyện phát âm tiếng Anh.
                  </p>
                </div>
                <div className="grid w-full grid-cols-3 gap-3 lg:w-[420px]">
                  <div className="rounded-lg border border-neutral-200 bg-white p-4">
                    <div className="text-2xl font-bold text-neutral-900">{topics.length}</div>
                    <div className="mt-1 text-xs font-semibold text-neutral-500">Chủ đề</div>
                  </div>
                  <div className="rounded-lg border border-neutral-200 bg-white p-4">
                    <div className="text-2xl font-bold text-neutral-900">{overview.totalMaps}</div>
                    <div className="mt-1 text-xs font-semibold text-neutral-500">Nhóm âm</div>
                  </div>
                  <div className="rounded-lg border border-neutral-200 bg-white p-4">
                    <div className="text-2xl font-bold text-neutral-900">{overview.completedExercises}</div>
                    <div className="mt-1 text-xs font-semibold text-neutral-500">Đã đạt</div>
                  </div>
                </div>
              </div>
            </section>

            {topics.length === 0 ? (
              <Card>
                <h2 className="text-xl font-bold text-neutral-900">Chưa có dữ liệu lộ trình</h2>
                <p className="mt-2 text-neutral-600">
                  Database hiện chưa có topic, learning map hoặc exercise. Hãy chạy seed data trước khi demo.
                </p>
              </Card>
            ) : (
              <section className="space-y-4" aria-label="Danh sách chủ đề">
                {topics.map((topic, index) => {
                  const stats = getTopicStats(topic);
                  const disabled = stats.total === 0 || topic.isLocked;

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => !topic.isLocked && openTopic(topic)}
                      disabled={disabled}
                      className={`group w-full rounded-xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:border-neutral-200 disabled:hover:shadow-sm ${topic.isLocked ? "relative overflow-hidden" : ""}`}
                      aria-label={topic.isLocked ? `Chủ đề ${topic.name} bị khóa` : `Mở chủ đề ${topic.name}`}
                    >
                      {topic.isLocked && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-neutral-900/60 backdrop-blur-sm">
                          <div className="text-4xl">🔒</div>
                          <p className="mt-2 text-lg font-bold text-white">Chủ đề bị khóa</p>
                          <p className="mt-1 text-sm text-neutral-200">
                            Hoàn thành ≥80% &quot;{topic.prerequisiteName}&quot; để mở khóa
                          </p>
                          {topic.completionPercent !== undefined && (
                            <div className="mt-3 w-48">
                              <ProgressBar
                                value={topic.completionPercent}
                                max={100}
                                label={`${topic.completionPercent}% hoàn thành`}
                                color="warning"
                                showPercentage
                              />
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex flex-col gap-5 md:flex-row md:items-start">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-xl font-bold text-white">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h2 className="text-2xl font-bold text-neutral-900">{topic.name}</h2>
                              <p className="mt-2 text-neutral-600">
                                {topic.description || "Chủ đề luyện phát âm tiếng Anh."}
                              </p>
                            </div>
                            <Badge variant={disabled ? "warning" : "info"} size="sm">
                              {disabled ? "Chưa có bài" : `${topic.maps.length} nhóm âm`}
                            </Badge>
                          </div>
                          <div className="mt-5">
                            <ProgressBar
                              value={stats.completed}
                              max={Math.max(stats.total, 1)}
                              label={`${stats.completed}/${stats.total} bài đạt từ 70 điểm`}
                              color={stats.completed === stats.total && stats.total > 0 ? "success" : "primary"}
                              showPercentage={stats.total > 0}
                            />
                          </div>
                          <div className="mt-4 text-sm font-bold text-primary-700">
                            {topic.isLocked
                              ? "Cần mở khóa"
                              : disabled
                                ? "Nội dung đang được chuẩn bị"
                                : "Xem nhóm âm"}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </section>
            )}
          </>
        )}

        {selectedTopic && !selectedMap && (
          <>
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={backToTopics}
                leftIcon={<span aria-hidden="true">{"<-"}</span>}
              >
                Quay lại chủ đề
              </Button>
            </div>

            <section className="mb-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary-700">Chủ đề</p>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900">{selectedTopic.name}</h1>
              <p className="mt-3 max-w-3xl text-lg text-neutral-600">
                {selectedTopic.description || "Chọn nhóm âm để bắt đầu luyện tập."}
              </p>
            </section>

            {selectedTopic.maps.length === 0 ? (
              <Card>
                <h2 className="text-xl font-bold text-neutral-900">Chưa có nhóm âm</h2>
                <p className="mt-2 text-neutral-600">Chủ đề này hiện chưa có bài tập trong database.</p>
              </Card>
            ) : (
              <div className="space-y-10">
                {groupMapsBySubcategory(selectedTopic.maps).map((group) => (
                  <section
                    key={group.subcategory ?? "default"}
                    aria-label={group.subcategory ?? "Danh sách nhóm âm"}
                  >
                    {group.subcategory && (
                      <h3 className="mb-4 text-xl font-bold tracking-tight text-neutral-900">
                        {group.subcategory}
                      </h3>
                    )}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {group.maps.map((map) => {
                        const stats = getMapStats(map);
                        const disabled = map.status !== "ACTIVE" || stats.total === 0;

                        return (
                          <button
                            key={map.id}
                            type="button"
                            onClick={() => setSelectedMap(map)}
                            disabled={disabled}
                            className="rounded-xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:border-neutral-200 disabled:hover:shadow-sm"
                            aria-label={`Mở nhóm âm ${map.name}`}
                          >
                            <div className="mb-4 flex items-start justify-between gap-4">
                              <h2 className="text-xl font-bold text-neutral-900">{map.name}</h2>
                              <div className="flex shrink-0 flex-col items-end gap-2">
                                <Badge variant={getRequirementVariant(map.requirement)} size="sm">
                                  {map.requirement || "Chưa phân loại"}
                                </Badge>
                                {map.status !== "ACTIVE" && (
                                  <Badge variant={getStatusVariant(map.status)} size="sm">
                                    {getStatusLabel(map.status)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="mb-5 text-neutral-600">
                              {stats.total} dạng bài tập, {stats.completed} bài đã đạt từ 70 điểm.
                            </p>
                            <ProgressBar
                              value={stats.completed}
                              max={Math.max(stats.total, 1)}
                              label={`${stats.completed}/${stats.total} bài hoàn thành`}
                              color={stats.completed === stats.total && stats.total > 0 ? "success" : "primary"}
                              showPercentage={stats.total > 0}
                            />
                            <div className="mt-5 text-sm font-bold text-primary-700">
                              {disabled ? "Nội dung chưa sẵn sàng" : "Xem bài tập"}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}

        {selectedMap && (
          <>
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setSelectedMap(null)}
                leftIcon={<span aria-hidden="true">{"<-"}</span>}
              >
                Quay lại nhóm âm
              </Button>
            </div>

            <section className="mb-10">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant={getRequirementVariant(selectedMap.requirement)}>
                  {selectedMap.requirement || "Chưa phân loại"}
                </Badge>
                <Badge variant={getStatusVariant(selectedMap.status)}>
                  {getStatusLabel(selectedMap.status)}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900">{selectedMap.name}</h1>
              <p className="mt-3 max-w-3xl text-lg text-neutral-600">
                Chọn dạng bài để luyện. Bài chưa sẵn sàng là trạng thái nội dung, không phải khóa theo XP.
              </p>
            </section>

            {selectedMap.exercises.length === 0 ? (
              <Card>
                <h2 className="text-xl font-bold text-neutral-900">Chưa có bài tập</h2>
                <p className="mt-2 text-neutral-600">Learning map này chưa có exercise trong database.</p>
              </Card>
            ) : (
              <section className="grid grid-cols-1 gap-5 md:grid-cols-2" aria-label="Danh sách bài tập">
                {selectedMap.exercises.map((exercise) => {
                  const isActive = selectedMap.status === "ACTIVE" && exercise.status === "ACTIVE";
                  const tone = getExerciseTone(exercise.name);
                  const classes = toneClasses[tone];

                  const content = (
                    <>
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border text-lg font-black ${classes.icon}`}
                          aria-hidden="true"
                        >
                          {getExerciseShortCode(exercise.name)}
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          {exercise.isCompleted && exercise.bestScore !== null && (
                            <Badge variant="success" size="sm">
                              Đã đạt {exercise.bestScore}/100
                            </Badge>
                          )}
                          {!exercise.isCompleted && exercise.bestScore !== null && (
                            <Badge variant="warning" size="sm">
                              Tốt nhất {exercise.bestScore}/100
                            </Badge>
                          )}
                          <Badge variant={getStatusVariant(exercise.status)} size="sm">
                            {getStatusLabel(exercise.status)}
                          </Badge>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-neutral-900">{exercise.name}</h2>
                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-neutral-600">
                        {exercise.description || "Bài tập luyện phát âm tiếng Anh."}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                          <div className="text-xs font-semibold text-neutral-500">Số câu</div>
                          <div className="mt-1 font-bold text-neutral-900">{exercise.questionCount}</div>
                        </div>
                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                          <div className="text-xs font-semibold text-neutral-500">Trạng thái</div>
                          <div className="mt-1 font-bold text-neutral-900">
                            {exercise.isCompleted ? "Đã đạt" : "Cần luyện"}
                          </div>
                        </div>
                      </div>

                      <div className={`mt-5 rounded-lg border px-4 py-3 text-sm font-bold ${classes.subtle} ${classes.text}`}>
                        {isActive ? "Bắt đầu luyện tập" : "Nội dung chưa sẵn sàng"}
                      </div>
                    </>
                  );

                  if (!isActive) {
                    return (
                      <div
                        key={exercise.id}
                        className="rounded-xl border border-neutral-200 bg-white p-6 opacity-80 shadow-sm"
                        aria-disabled="true"
                      >
                        {content}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={exercise.id}
                      href={`/exercises/${exercise.id}`}
                      className={`block rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${classes.border}`}
                    >
                      {content}
                    </Link>
                  );
                })}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
