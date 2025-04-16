"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  LogOut,
  Menu,
  X,
  MessageSquare,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Check if we're on the login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Skip auth check for login page
        if (pathname === "/admin/login") {
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/auth/check");
        const data = await response.json();

        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // If loading or not authenticated and not on login page, show loading
  if ((isLoading || !isAuthenticated) && pathname !== "/admin/login") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-DEFAULT"></div>
      </div>
    );
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Applications",
      href: "/admin/applications",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Job Posts",
      href: "/admin/jobs",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      name: "Blog Posts",
      href: "/admin/blogs",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Contact Submissions",
      href: "/admin/contact",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Create Account",
      href: "/admin/create-account",
      icon: <User className="h-5 w-5" />,
    }
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/admin/login");
        router.refresh(); // Refresh to update server components
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle click on overlay or main content when sidebar is open on mobile
  const handleContentClick = (e: React.MouseEvent) => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  // If on login page, only render the children without the sidebar
  if (isLoginPage) {
    return <div className="h-screen bg-gray-100">{children}</div>;
  }

  // Otherwise, we render the full admin layout with sidebar
  // The middleware will handle redirecting unauthenticated users to the login page
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm p-4 flex justify-between items-center">
        <Link href="/admin" className="text-3xl font-bold gradient-text">
          DataArch Admin
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar Overlay - only visible on mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white shadow-md z-20 transition-all duration-300 ease-in-out flex flex-col",
          isSidebarOpen
            ? "fixed inset-y-0 left-0 w-64 lg:relative lg:translate-x-0"
            : "fixed inset-y-0 -translate-x-full lg:w-20 lg:translate-x-0 lg:relative",
          isMobile ? "top-14 pt-2" : "top-0"
        )}
      >
        {/* Sidebar Header - Desktop */}
        <div className="p-6 border-b shrink-0 hidden lg:block">
          <Link
            href="/admin"
            className={cn(
              "text-3xl font-bold gradient-text",
              !isSidebarOpen && "lg:hidden"
            )}
          >
            DataArch Admin
          </Link>
          {!isSidebarOpen && (
            <div className="flex justify-center">
              <Link href="/admin" className="text-xl font-bold gradient-text">
                D
              </Link>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 flex flex-col flex-grow overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center p-3 rounded-md transition-colors",
                    isActive(item.href)
                      ? "bg-purple-dark text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className={cn(!isSidebarOpen && "lg:hidden")}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-4 border-t">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span className="mr-3">
                <LogOut className="h-5 w-5" />
              </span>
              <span className={cn(!isSidebarOpen && "lg:hidden")}>
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        ref={mainContentRef}
        onClick={handleContentClick}
        className={cn(
          "flex-1 overflow-y-auto p-6 transition-all duration-300",
          isMobile ? "pt-20" : "pt-6",
          isMobile && isSidebarOpen && "opacity-50 lg:opacity-100"
        )}
      >
        {children}
      </main>
    </div>
  );
}
