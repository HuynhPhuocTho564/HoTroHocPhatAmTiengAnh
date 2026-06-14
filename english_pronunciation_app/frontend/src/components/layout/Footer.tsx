import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
              Về chúng tôi
            </h3>
            <p className="text-sm text-neutral-600">
              Web hỗ trợ phát âm tiếng Anh cho người Việt, sử dụng công nghệ AI và gamification.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
              Liên kết
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/practice" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                  Luyện tập
                </Link>
              </li>
              <li>
                <Link href="/learning_map" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                  Bản đồ học tập
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                  Bảng xếp hạng
                </Link>
              </li>
              <li>
                <Link href="/badges" className="text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                  Huy hiệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
              Liên hệ
            </h3>
            <p className="text-sm text-neutral-600">
              Email: support@phatamen.edu.vn
            </p>
            <p className="text-sm text-neutral-600 mt-2">
              Đồ án tốt nghiệp 2026
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200">
          <p className="text-center text-sm text-neutral-500">
            © 2026 Web_HoTroPhatAmEN. Tuân thủ WCAG 2.1 AA.
          </p>
        </div>
      </div>
    </footer>
  );
}
