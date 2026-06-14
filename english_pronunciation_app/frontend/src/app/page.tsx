import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 font-semibold text-sm mb-8">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Đồ án tốt nghiệp 2026
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
              Chinh phục phát âm<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                tiếng Anh chuẩn
              </span>
            </h1>

            <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-12">
              Học 44 âm vị IPA với công nghệ AI, nhận phản hồi tức thì và theo dõi tiến độ qua gamification. 
              Dành riêng cho người Việt.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button 
                  variant="primary" 
                  size="lg"
                  rightIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  }
                >
                  Bắt đầu miễn phí
                </Button>
              </Link>
              <Link href="/practice">
                <Button variant="secondary" size="lg">
                  Xem bảng IPA
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-primary-600">44</div>
                <div className="text-sm text-neutral-600 mt-1">Âm vị IPA</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent-600">AI</div>
                <div className="text-sm text-neutral-600 mt-1">Chấm điểm tự động</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-success-600">100%</div>
                <div className="text-sm text-neutral-600 mt-1">Miễn phí</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-neutral-600">
              Học phát âm hiệu quả với công nghệ hiện đại
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Ghi âm & Phân tích
              </h3>
              <p className="text-neutral-600">
                Ghi âm giọng nói của bạn và nhận phản hồi tức thì về độ chính xác phát âm từng âm vị.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-neutral-200 hover:border-accent-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Theo dõi Tiến độ
              </h3>
              <p className="text-neutral-600">
                Xem biểu đồ tiến độ, điểm XP và chuỗi ngày luyện tập để duy trì động lực học tập.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-neutral-200 hover:border-success-300 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-success-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Gamification
              </h3>
              <p className="text-neutral-600">
                Thu thập huy hiệu, tăng cấp và cạnh tranh trên bảng xếp hạng với các học viên khác.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sẵn sàng cải thiện phát âm?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Tham gia ngay hôm nay và bắt đầu hành trình chinh phục 44 âm vị tiếng Anh
          </p>
          <Link href="/register">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-primary-600 hover:bg-neutral-50"
            >
              Đăng ký miễn phí
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
