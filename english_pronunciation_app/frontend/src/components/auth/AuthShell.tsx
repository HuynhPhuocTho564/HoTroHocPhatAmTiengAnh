type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

const benefits = [
  {
    label: "Lưu tiến độ",
    value: "Theo dõi bài đã làm, điểm tốt nhất và mức độ tiến bộ.",
    icon: "✓",
    tone: "bg-primary-50 text-primary-700 dark:bg-primary-950/70 dark:text-primary-300",
  },
  {
    label: "Động lực học mỗi ngày",
    value: "XP, streak, huy hiệu và bảng xếp hạng được cập nhật theo tài khoản.",
    icon: "★",
    tone: "bg-accent-50 text-accent-700 dark:bg-accent-950/70 dark:text-accent-300",
  },
  {
    label: "Tập trung phát âm",
    value: "Luyện nghe, đọc IPA và nói lại theo từng bài học ngắn.",
    icon: "IPA",
    tone: "bg-success-50 text-success-700 dark:bg-success-950/70 dark:text-success-300",
  },
];

export default function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-neutral-50 px-4 py-8 transition-colors dark:bg-neutral-950 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden lg:block" aria-labelledby="auth-benefit-heading">
          <p className="text-sm font-bold uppercase tracking-wide text-primary-700 dark:text-primary-300">{eyebrow}</p>
          <h1 id="auth-benefit-heading" className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
            Luyện phát âm đều hơn với tài khoản của bạn
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-neutral-700 dark:text-neutral-300">
            Một tài khoản giúp hệ thống lưu điểm, streak và kết quả luyện tập để bạn tiếp tục đúng nơi lần trước.
          </p>

          <dl className="mt-8 space-y-4">
            {benefits.map((benefit) => (
              <div key={benefit.label} className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900">
                <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold ${benefit.tone}`} aria-hidden="true">
                  {benefit.icon}
                </span>
                <div>
                  <dt className="text-sm font-bold text-neutral-950 dark:text-neutral-50">{benefit.label}</dt>
                  <dd className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{benefit.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="auth-form-heading" className="mx-auto w-full max-w-md">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-lg shadow-neutral-900/10 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/30 sm:p-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary-700 dark:text-primary-300">{eyebrow}</p>
              <h2 id="auth-form-heading" className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-3xl">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{description}</p>
            </div>

            <div className="mt-6">{children}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
