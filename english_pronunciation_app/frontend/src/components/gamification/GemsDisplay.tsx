"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { SHOP_ITEMS } from "@/lib/gamification";

type GemsDisplayProps = {
  initialGems: number;
};

type PurchaseResult = {
  success: boolean;
  data?: {
    item: { id: string; name: string };
    cost: number;
    user: { gems: number; streakFreezes: number; unlockedIpaReveal: boolean; unlockedSlowAudio: boolean };
  };
  error?: { code: string; message: string };
};

/**
 * GemsDisplay - Hiển thị số đá quý và nút mở cửa hàng
 * Đặt trên navbar, bên cạnh avatar user.
 */
export default function GemsDisplay({ initialGems }: GemsDisplayProps) {
  const [gems, setGems] = useState(initialGems);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handlePurchase(itemId: string, cost: number) {
    setPurchasingId(itemId);
    setMessage(null);

    try {
      const response = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      const body = (await response.json()) as PurchaseResult;

      if (body.success && body.data) {
        setGems(body.data.user.gems);
        setMessage(`Đã mua "${body.data.item.name}" thành công!`);
      } else {
        setMessage(body.error?.message ?? "Mua hàng thất bại.");
      }
    } catch {
      setMessage("Không thể kết nối server.");
    } finally {
      setPurchasingId(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsShopOpen(true)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-bold text-amber-600 transition-colors hover:bg-amber-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 dark:text-amber-400 dark:hover:bg-neutral-800"
        aria-label={`Mở cửa hàng. Hiện có ${gems} đá quý`}
      >
        <span aria-hidden="true">💎</span>
        <span>{gems}</span>
      </button>

      <Modal
        isOpen={isShopOpen}
        onClose={() => {
          setIsShopOpen(false);
          setMessage(null);
        }}
        title="Cửa Hàng Đá Quý"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Bạn đang có <strong className="text-amber-600">{gems} 💎</strong> đá quý.
            Nhận thêm bằng cách đạt rating EXCELLENT khi nộp bài!
          </p>

          <ul className="space-y-3">
            {SHOP_ITEMS.map((item) => {
              const canAfford = gems >= item.cost;
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                    <p className="mt-1 text-sm font-bold text-amber-600">{item.cost} 💎</p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!canAfford}
                    loading={purchasingId === item.id}
                    onClick={() => handlePurchase(item.id, item.cost)}
                  >
                    {canAfford ? "Mua" : "Không đủ"}
                  </Button>
                </li>
              );
            })}
          </ul>

          {message && (
            <div
              className="rounded-lg border border-primary-200 bg-primary-50 p-3 text-sm text-neutral-700"
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
