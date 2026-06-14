import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <span className="font-extrabold text-xl tracking-tight text-neutral-900">PhatAmEN</span>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 transition-colors"
            >
              Trang chủ
            </Link>
            <Link 
              href="/practice" 
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 transition-colors"
            >
              Bảng IPA
            </Link>
            <Link 
              href="/learning_map" 
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 transition-colors"
            >
              Lộ trình
            </Link>
            <Link 
              href="/checkin" 
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 transition-colors"
            >
              🔥 Điểm danh
            </Link>
            <Link 
              href="/leaderboard" 
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 transition-colors"
            >
              Xếp hạng
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Admin Link - Chỉ hiển thị cho Admin */}
            {/* TODO: Thay bằng check role thật từ session */}
            <Link 
              href="/admin"
              className="hidden md:inline-flex items-center px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Trang quản trị (chỉ Admin)"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </Link>

            <button 
              type="button" 
              className="p-1 rounded-full text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Xem thông báo"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <Link href="/dashboard">
              <button className="flex text-sm bg-neutral-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                <span className="sr-only">Mở menu người dùng</span>
                <img className="h-8 w-8 rounded-full bg-neutral-200" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" />
              </button>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}
