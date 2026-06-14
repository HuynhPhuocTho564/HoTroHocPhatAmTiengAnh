import { auth } from "@/lib/auth";
import NavbarClient, { type NavbarLink } from "./NavbarClient";

const navLinks: Array<NavbarLink & { authOnly: boolean }> = [
  { href: "/dashboard", label: "Trang chủ", authOnly: true },
  { href: "/practice", label: "Bảng IPA", authOnly: true },
  { href: "/learning_map", label: "Lộ trình", authOnly: true },
  { href: "/checkin", label: "Điểm danh", authOnly: true },
  { href: "/leaderboard", label: "Xếp hạng", authOnly: true },
  { href: "/badges", label: "Huy hiệu", authOnly: true },
];

export default async function Navbar() {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user?.id);
  const isAdmin = session?.user?.role === "Admin";
  const username = session?.user?.name ?? "Người học";
  const avatarUrl = session?.user?.image ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  return (
    <NavbarClient
      links={navLinks.filter((link) => !link.authOnly || isAuthenticated)}
      user={isAuthenticated ? { username, avatarUrl } : null}
      isAdmin={isAdmin}
    />
  );
}
