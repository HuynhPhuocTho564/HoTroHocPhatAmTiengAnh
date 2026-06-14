"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type AudioFile = {
  id: string;
  name: string;
  path: string;
  duration: number;
  size: string;
  uploadedAt: string;
  usedIn: number;
};

export default function AudioManagement() {
  const [audioFiles] = useState<AudioFile[]>([
    {
      id: "1",
      name: "sheep_pronunciation.mp3",
      path: "/audio/phonemes/sheep.mp3",
      duration: 2,
      size: "45 KB",
      uploadedAt: "2026-05-20",
      usedIn: 3,
    },
    {
      id: "2",
      name: "ship_pronunciation.mp3",
      path: "/audio/phonemes/ship.mp3",
      duration: 2,
      size: "42 KB",
      uploadedAt: "2026-05-20",
      usedIn: 3,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredAudio = audioFiles.filter((audio) =>
    audio.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    return `${seconds}s`;
  };

  return (
    <div>
      <Card>
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">Quản lý tệp âm thanh</h3>
              <p className="text-sm text-neutral-600 mt-1">
                Tổng số: {audioFiles.length} tệp
              </p>
            </div>
            <Button>+ Upload âm thanh</Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm tệp âm thanh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Audio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAudio.map((audio) => (
              <Card key={audio.id} hover>
                <div className="p-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-xl mb-4 mx-auto">
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>

                  <h4 className="font-semibold text-neutral-900 text-center mb-2 truncate">
                    {audio.name}
                  </h4>

                  <div className="space-y-1 mb-4 text-sm text-neutral-600">
                    <div className="flex justify-between">
                      <span>Thời lượng:</span>
                      <span className="font-medium">{formatDuration(audio.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kích thước:</span>
                      <span className="font-medium">{audio.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sử dụng trong:</span>
                      <span className="font-medium">{audio.usedIn} bài tập</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 text-sm font-medium">
                      Phát
                    </button>
                    <button className="px-3 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredAudio.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              <div className="text-4xl mb-4">🎵</div>
              <p>Không tìm thấy tệp âm thanh nào</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
