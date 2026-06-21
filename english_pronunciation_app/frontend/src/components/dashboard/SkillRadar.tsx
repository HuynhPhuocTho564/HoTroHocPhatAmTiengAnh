import React from "react";
import Card from "@/components/ui/Card";

/**
 * SkillRadar — radar chart SVG 4 axes: Nguyên âm / Phụ âm / Âm khó / Nối âm.
 *
 * Hiển thị điểm trung bình (0-100) của user ở mỗi chủ đề IPA (Task 6.4).
 * Thuần SVG — không cần chart library (YAGNI, performance tốt).
 *
 * @module dashboard/SkillRadar
 */

export type SkillScores = {
  vowels: number;
  consonants: number;
  difficult: number;
  linking: number;
};

type SkillRadarProps = {
  scores: SkillScores;
};

// 4 axes, mỗi axis 90° (top, right, bottom, left)
const AXES: Array<{ key: keyof SkillScores; label: string; angle: number }> = [
  { key: "vowels", label: "Nguyên âm", angle: -90 }, // top
  { key: "consonants", label: "Phụ âm", angle: 0 }, // right
  { key: "difficult", label: "Âm khó", angle: 90 }, // bottom
  { key: "linking", label: "Nối âm", angle: 180 }, // left
];

const CENTER = 120;
const MAX_RADIUS = 90;
const GRID_LEVELS = [25, 50, 75, 100];

function axisPoint(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function polygonPoints(radius: number): string {
  return AXES.map((axis) => {
    const p = axisPoint(axis.angle, radius);
    return `${p.x},${p.y}`;
  }).join(" ");
}

function dataPolygonPoints(scores: SkillScores): string {
  return AXES.map((axis) => {
    const value = Math.max(0, Math.min(100, scores[axis.key]));
    const radius = (value / 100) * MAX_RADIUS;
    const p = axisPoint(axis.angle, radius);
    return `${p.x},${p.y}`;
  }).join(" ");
}

export default function SkillRadar({ scores }: SkillRadarProps) {
  const total = scores.vowels + scores.consonants + scores.difficult + scores.linking;
  const hasData = total > 0;

  return (
    <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-neutral-900">🎯 Kỹ năng của bạn</h3>
        <span className="text-xs font-semibold text-neutral-500">4 chủ đề IPA</span>
      </div>

      {!hasData ? (
        <p className="mt-3 text-xs text-neutral-600">
          Làm bài tập để thấy điểm mạnh/yếu của bạn ở mỗi chủ đề phát âm.
        </p>
      ) : (
        <div className="mt-3 flex items-center justify-center">
          <svg
            viewBox="0 0 240 240"
            className="h-56 w-56"
            role="img"
            aria-label={`Radar kỹ năng: Nguyên âm ${scores.vowels}, Phụ âm ${scores.consonants}, Âm khó ${scores.difficult}, Nối âm ${scores.linking}`}
          >
            {/* Grid lines (4 concentric polygons) */}
            {GRID_LEVELS.map((level) => (
              <polygon
                key={level}
                points={polygonPoints((level / 100) * MAX_RADIUS)}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Axis lines (4 diagonals) */}
            {AXES.map((axis) => {
              const end = axisPoint(axis.angle, MAX_RADIUS);
              return (
                <line
                  key={axis.key}
                  x1={CENTER}
                  y1={CENTER}
                  x2={end.x}
                  y2={end.y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              );
            })}

            {/* Data polygon — primary color fill + stroke */}
            <polygon
              points={dataPolygonPoints(scores)}
              fill="rgba(37, 99, 235, 0.25)"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Data points (circles at each vertex) */}
            {AXES.map((axis) => {
              const value = Math.max(0, Math.min(100, scores[axis.key]));
              const radius = (value / 100) * MAX_RADIUS;
              const p = axisPoint(axis.angle, radius);
              return <circle key={`pt-${axis.key}`} cx={p.x} cy={p.y} r="4" fill="#2563eb" />;
            })}

            {/* Axis labels */}
            <text x={CENTER} y={10} textAnchor="middle" className="fill-neutral-700 text-[11px] font-bold">
              Nguyên âm
            </text>
            <text x={CENTER} y={24} textAnchor="middle" className="fill-primary-600 text-[11px] font-bold">
              {scores.vowels}
            </text>

            <text x={235} y={CENTER - 4} textAnchor="end" className="fill-neutral-700 text-[11px] font-bold">
              Phụ âm
            </text>
            <text x={235} y={CENTER + 10} textAnchor="end" className="fill-primary-600 text-[11px] font-bold">
              {scores.consonants}
            </text>

            <text x={CENTER} y={235} textAnchor="middle" className="fill-neutral-700 text-[11px] font-bold">
              Âm khó
            </text>
            <text x={CENTER} y={222} textAnchor="middle" className="fill-primary-600 text-[11px] font-bold">
              {scores.difficult}
            </text>

            <text x={5} y={CENTER - 4} textAnchor="start" className="fill-neutral-700 text-[11px] font-bold">
              Nối âm
            </text>
            <text x={5} y={CENTER + 10} textAnchor="start" className="fill-primary-600 text-[11px] font-bold">
              {scores.linking}
            </text>
          </svg>
        </div>
      )}

      {/* Weakest skill hint — khuyến khích practice */}
      {hasData && (() => {
        const sorted = (Object.entries(scores) as Array<[keyof SkillScores, number]>).sort(
          (a, b) => a[1] - b[1],
        );
        const weakest = sorted[0];
        if (weakest[1] >= 70) return null; // All skills good, no hint needed
        const label = AXES.find((a) => a.key === weakest[0])?.label ?? "";
        return (
          <p className="mt-2 text-center text-xs font-semibold text-warning-700">
            💪 "{label}" cần luyện thêm — chọn bài chủ đề này để cải thiện!
          </p>
        );
      })()}
    </Card>
  );
}
