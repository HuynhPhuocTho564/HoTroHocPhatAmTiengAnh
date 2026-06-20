"use client";

import { useState } from "react";
import BadgeManagement, { type AdminBadge } from "@/components/admin/BadgeManagement";
import AudioManagement, { type AdminAudioFile } from "@/components/admin/AudioManagement";
import ExerciseManagement, { type AdminExercise } from "@/components/admin/ExerciseManagement";
import MinimalPairManagement, { type AdminMinimalPair } from "@/components/admin/MinimalPairManagement";
import PhonemeManagement, { type AdminPhoneme } from "@/components/admin/PhonemeManagement";
import QuestionBankManagement, { type AdminQuestionBankItem } from "@/components/admin/QuestionBankManagement";
import ReportsAnalytics, { type AdminReportsData } from "@/components/admin/ReportsAnalytics";
import SentenceItemManagement, { type AdminSentenceItem } from "@/components/admin/SentenceItemManagement";
import SoundGroupManagement, { type AdminSoundGroup } from "@/components/admin/SoundGroupManagement";
import TopicLevelMapManagement, {
  type AdminLevelItem,
  type AdminMapItem,
  type AdminTopicItem,
} from "@/components/admin/TopicLevelMapManagement";
import UserManagement, { type AdminUser } from "@/components/admin/UserManagement";
import WordItemManagement, { type AdminWordItem } from "@/components/admin/WordItemManagement";
import Card from "@/components/ui/Card";

type AdminTab = "overview" | "users" | "exercises" | "topics" | "phonemes" | "words" | "soundgroups" | "questions" | "minimalpairs" | "sentences" | "audio" | "badges" | "reports";

export type AdminDashboardData = {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalExercises: number;
    totalAudioFiles: number;
    completedAttempts: number;
    newUsersLast7Days: number;
    completedAttemptsLast7Days: number;
    averageScore: number;
  };
  users: AdminUser[];
  exercises: AdminExercise[];
  topics: AdminTopicItem[];
  levels: AdminLevelItem[];
  maps: AdminMapItem[];
  exerciseOptions: {
    topics: AdminExerciseOption[];
    levels: AdminExerciseOption[];
    maps: AdminExerciseOption[];
    questionTypes: AdminExerciseOption[];
  };
  audioFiles: AdminAudioFile[];
  phonemes: AdminPhoneme[];
  wordItems: AdminWordItem[];
  soundGroups: AdminSoundGroup[];
  questionBankItems: AdminQuestionBankItem[];
  minimalPairs: AdminMinimalPair[];
  sentenceItems: AdminSentenceItem[];
  badges: AdminBadge[];
  reports: AdminReportsData;
};

export type AdminExerciseOption = {
  id: string;
  name: string;
};

const tabs: Array<{ id: AdminTab; name: string }> = [
  { id: "overview", name: "Tổng quan" },
  { id: "users", name: "Người dùng" },
  { id: "exercises", name: "Bài tập" },
  { id: "topics", name: "Chủ đề" },
  { id: "phonemes", name: "Phoneme" },
  { id: "words", name: "Từ vựng" },
  { id: "soundgroups", name: "Nhóm âm" },
  { id: "questions", name: "Ngân hàng câu" },
  { id: "minimalpairs", name: "Minimal Pair" },
  { id: "sentences", name: "Câu" },
  { id: "audio", name: "Âm thanh" },
  { id: "badges", name: "Gamification" },
  { id: "reports", name: "Báo cáo" },
];

function StatCard({ label, value, hint }: { label: string; value: number | string; hint: string }) {
  return (
    <Card>
      <div className="p-6">
        <dt className="text-sm font-semibold text-neutral-600">{label}</dt>
        <dd className="mt-2 text-3xl font-bold text-neutral-900">{value}</dd>
        <p className="mt-2 text-xs text-neutral-500">{hint}</p>
      </div>
    </Card>
  );
}

export default function AdminDashboardClient({ data }: { data: AdminDashboardData }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-700">Admin</p>
          <h1 className="text-3xl font-bold text-neutral-900">Quản trị hệ thống PhatAmEN</h1>
          <p className="mt-2 text-sm text-neutral-600">Theo dõi dữ liệu thật từ database và các module quản trị MVP.</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 overflow-x-auto" aria-label="Điều hướng quản trị">
          <div className="flex min-w-max gap-2" role="tablist" aria-label="Các chức năng quản trị">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    const nextIndex = (index + 1) % tabs.length;
                    setActiveTab(tabs[nextIndex].id);
                    document.getElementById(`tab-${tabs[nextIndex].id}`)?.focus();
                  }

                  if (event.key === "ArrowLeft") {
                    const previousIndex = (index - 1 + tabs.length) % tabs.length;
                    setActiveTab(tabs[previousIndex].id);
                    document.getElementById(`tab-${tabs[previousIndex].id}`)?.focus();
                  }
                }}
                className={`min-h-11 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 ${
                  activeTab === tab.id
                    ? "bg-primary-600 text-white"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </nav>

        <section role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} tabIndex={0}>
          {activeTab === "overview" && (
            <div>
              <dl className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Tổng người dùng" value={data.stats.totalUsers} hint={`${data.stats.activeUsers} tài khoản active`} />
                <StatCard label="Bài tập" value={data.stats.totalExercises} hint={`${data.stats.completedAttempts} lượt hoàn thành`} />
                <StatCard label="File audio" value={data.stats.totalAudioFiles} hint="Đọc từ bảng AudioFile" />
                <StatCard label="Điểm TB 7 ngày" value={`${data.stats.averageScore}%`} hint={`${data.stats.completedAttemptsLast7Days} lượt làm bài gần đây`} />
              </dl>

              <Card>
                <div className="p-6">
                  <h2 className="mb-4 text-lg font-bold text-neutral-900">Thao tác nhanh</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("exercises")}
                      className="rounded-lg border-2 border-neutral-200 p-4 text-left transition-all hover:border-primary-500 hover:bg-primary-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
                    >
                      <div className="font-semibold text-neutral-900">Quản lý bài tập</div>
                      <div className="mt-1 text-sm text-neutral-600">Xem danh sách bài tập và số câu hỏi</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("users")}
                      className="rounded-lg border-2 border-neutral-200 p-4 text-left transition-all hover:border-primary-500 hover:bg-primary-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
                    >
                      <div className="font-semibold text-neutral-900">Quản lý người dùng</div>
                      <div className="mt-1 text-sm text-neutral-600">Xem tài khoản, role và trạng thái</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("reports")}
                      className="rounded-lg border-2 border-neutral-200 p-4 text-left transition-all hover:border-primary-500 hover:bg-primary-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
                    >
                      <div className="font-semibold text-neutral-900">Xem báo cáo</div>
                      <div className="mt-1 text-sm text-neutral-600">Tổng hợp 7 ngày và bài phổ biến</div>
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "users" && <UserManagement users={data.users} />}
          {activeTab === "exercises" && (
            <ExerciseManagement
              exercises={data.exercises}
              topics={data.exerciseOptions.topics}
              levels={data.exerciseOptions.levels}
              maps={data.exerciseOptions.maps}
              questionTypes={data.exerciseOptions.questionTypes}
            />
          )}
          {activeTab === "audio" && <AudioManagement audioFiles={data.audioFiles} />}
          {activeTab === "reports" && <ReportsAnalytics data={data.reports} />}

          {activeTab === "topics" && (
            <TopicLevelMapManagement topics={data.topics} levels={data.levels} maps={data.maps} />
          )}

          {activeTab === "phonemes" && (
            <PhonemeManagement phonemes={data.phonemes} />
          )}

          {activeTab === "words" && (
            <WordItemManagement
              items={data.wordItems}
              phonemes={data.phonemes.map((p) => ({ id: p.id, symbol: p.symbol }))}
            />
          )}

          {activeTab === "soundgroups" && (
            <SoundGroupManagement
              items={data.soundGroups}
              topics={data.exerciseOptions.topics}
            />
          )}

          {activeTab === "questions" && (
            <QuestionBankManagement
              items={data.questionBankItems}
              questionTypes={data.exerciseOptions.questionTypes}
              soundGroups={data.soundGroups.map((s) => ({ id: s.id, name: s.name }))}
            />
          )}

          {activeTab === "minimalpairs" && (
            <MinimalPairManagement
              items={data.minimalPairs}
              soundGroups={data.soundGroups.map((s) => ({ id: s.id, name: s.name }))}
              wordItems={data.wordItems.map((w) => ({ id: w.id, word: w.word }))}
            />
          )}

          {activeTab === "sentences" && (
            <SentenceItemManagement
              items={data.sentenceItems}
              soundGroups={data.soundGroups.map((s) => ({ id: s.id, name: s.name }))}
            />
          )}

          {activeTab === "badges" && (
            <BadgeManagement badges={data.badges} />
          )}
        </section>
      </main>
    </div>
  );
}
