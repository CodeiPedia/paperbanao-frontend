import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import SupportChatWidget from "@/components/SupportChatWidget";

export const metadata = {
  metadataBase: new URL("https://paperbanao.in"),
  title: {
    default: "PaperBanao — AI Question Paper Generator",
    template: "%s | PaperBanao",
  },
  description: "Generate BSEB, CBSE, and NCERT-syllabus question papers in seconds, or digitize a handwritten paper.",
  verification: {
    google: "xx8eqb4rEL73DJvMWGZyniuvRQK6_ROGsN5ZVpV-kFE",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF7F0] text-[#2A2A28]">
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
        <SupportChatWidget />
      </body>
    </html>
  );
}
