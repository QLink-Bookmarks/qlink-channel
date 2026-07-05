import type { UserRole } from "@/features/account/types";

// ADMIN and SUPER_ADMIN can manage announcements (create posts of type ANNOUNCEMENT).
function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export { isAdminRole };
