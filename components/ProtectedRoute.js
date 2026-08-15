"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SkeletonList } from "@/components/Skeleton";

export default function ProtectedRoute({ children }) {
  const { isAuthed, checked } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (checked && !isAuthed) {
      router.replace("/login");
    }
  }, [checked, isAuthed, router]);

  if (!checked) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <SkeletonList count={2} />
      </div>
    );
  }
  if (!isAuthed) return null;

  return children;
}
