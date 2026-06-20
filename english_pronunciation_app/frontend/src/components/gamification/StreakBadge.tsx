import React from "react";
import StreakFireIndicator from "./effects/StreakFireIndicator";

interface StreakBadgeProps {
  days: number;
  className?: string;
}

/**
 * StreakBadge Component - Hiển thị chuỗi ngày liên tiếp
 * Gamification: Motivation through visual streak counter
 */
export default function StreakBadge({ days, className = "" }: StreakBadgeProps) {
  
  // Màu sắc thay đổi theo milestone (HCI: Progressive disclosure)
  const getStreakColor = (days: number) => {
    if (days >= 30) return "from-purple-500 to-pink-500";
    if (days >= 14) return "from-orange-500 to-red-500";
    if (days >= 7) return "from-yellow-500 to-orange-500";
    return "from-blue-500 to-cyan-500";
  };
  
  const getMessage = (days: number) => {
    if (days === 0) return "Bắt đầu chuỗi ngày của bạn!";
    if (days === 1) return "Khởi đầu tuyệt vời!";
    if (days < 7) return "Tiếp tục phát huy!";
    if (days < 14) return "Bạn đang làm rất tốt!";
    if (days < 30) return "Thật ấn tượng!";
    return "Bạn là huyền thoại! 🏆";
  };
  
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${getStreakColor(days)} p-6 rounded-2xl shadow-lg text-white ${className}`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold opacity-90">Chuỗi ngày liên tiếp</p>
            <StreakFireIndicator streak={days} />
          </div>
          <div>
            <p className="text-3xl font-bold">{days} ngày</p>
          </div>
        </div>
        
        <p className="text-sm opacity-90 mt-3">
          {getMessage(days)}
        </p>
        
        {days > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-xs opacity-75">
              Đừng quên luyện tập hôm nay để giữ chuỗi! 🔥
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
