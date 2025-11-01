import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function RequireAuth({ children }: Props) {
  const token = localStorage.getItem("token");
  const { pathname, search } = useLocation();

  const redirectTo = `/login?next=${encodeURIComponent(pathname + search)}`;

  return token ? (
    <>{children}</>
  ) : (
    <Navigate to={redirectTo} replace />
  );
}