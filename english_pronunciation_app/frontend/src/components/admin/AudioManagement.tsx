"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";

export type AdminAudioFile = {
  id: string;
  path: string;
  duration: number | null;
  playLimit: number | null;
  usedIn: number;
};

function fileNameFromPath(path: string) {
  return path.split(/[\\/]/).filter(Boolean).at(-1) ?? path;
}

export default function AudioManagement({ audioFiles }: { audioFiles: AdminAudioFile[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAudio = useMemo(() => {
    const keyword = searchTerm.toLowerCase();
    return audioFiles.filter((audio) => audio.path.toLowerCase().includes(keyword));
  }, [audioFiles, searchTerm]);

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Quản lý tệp âm thanh</h2>
            <p className="mt-1 text-sm text-neutral-600">Tổng số: {audioFiles.length} tệp</p>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="admin-audio-search" className="sr-only">
            Tìm kiếm tệp âm thanh
          </label>
          <input
            id="admin-audio-search"
            type="search"
            placeholder="Tìm kiếm tệp âm thanh..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:outline-none focus:ring-4 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAudio.map((audio) => (
            <Card key={audio.id}>
              <div className="p-4">
                <h3 className="mb-2 truncate text-center font-semibold text-neutral-900">{fileNameFromPath(audio.path)}</h3>
                <p className="mb-4 truncate text-center text-xs text-neutral-500">{audio.path}</p>

                <dl className="space-y-2 text-sm text-neutral-600">
                  <div className="flex justify-between gap-3">
                    <dt>Thời lượng</dt>
                    <dd className="font-semibold text-neutral-900">{audio.duration ? `${audio.duration}s` : "Chưa rõ"}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Giới hạn phát</dt>
                    <dd className="font-semibold text-neutral-900">{audio.playLimit ?? "Không giới hạn"}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Sử dụng trong</dt>
                    <dd className="font-semibold text-neutral-900">{audio.usedIn} bài tập</dd>
                  </div>
                </dl>
              </div>
            </Card>
          ))}
        </div>

        {filteredAudio.length === 0 && (
          <div className="py-12 text-center text-neutral-500">
            <p>Không tìm thấy tệp âm thanh nào</p>
          </div>
        )}
      </div>
    </Card>
  );
}
