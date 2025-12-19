import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Calendar, 
  LayoutDashboard,
  Stethoscope,
  CalendarPlus
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight" data-testid="text-logo">
              Cliniga
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-1">
            {!isAuthenticated ? (
              <>
                <Link href="/">
                  <Button
                    variant={isActive("/") ? "secondary" : "ghost"}
                    data-testid="link-home"
                  >
                    Beranda
                  </Button>
                </Link>
                <Link href="/doctors">
                  <Button
                    variant={isActive("/doctors") ? "secondary" : "ghost"}
                    data-testid="link-doctors"
                  >
                    Cari Dokter
                  </Button>
                </Link>
                <div className="ml-2 flex items-center gap-2">
                  <Link href="/register">
                    <Button data-testid="link-register">Masuk</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button
                    variant={isActive("/dashboard") ? "secondary" : "ghost"}
                    className="gap-2"
                    data-testid="link-dashboard"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                {user?.role === "patient" && (
                  <Link href="/book-appointment">
                    <Button
                      variant={isActive("/book-appointment") ? "secondary" : "ghost"}
                      className="gap-2"
                      data-testid="link-book-appointment"
                    >
                      <CalendarPlus className="h-4 w-4" />
                      Pesan Janji Temu
                    </Button>
                  </Link>
                )}
                <div className="ml-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative gap-2"
                        data-testid="button-user-menu"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {getInitials(user?.name || "U")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden lg:inline">{user?.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-muted-foreground capitalize mt-1">
                          {user?.role}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-destructive focus:text-destructive"
                        data-testid="button-logout"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Keluar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t pb-4 md:hidden">
            <div className="flex flex-col gap-1 pt-4">
              {!isAuthenticated ? (
                <>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={isActive("/") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      Beranda
                    </Button>
                  </Link>
                  <Link href="/doctors" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={isActive("/doctors") ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      Cari Dokter
                    </Button>
                  </Link>
                  <div className="mt-2 flex flex-col gap-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Masuk
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Masuk</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-2 flex items-center gap-3 px-3 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user?.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={isActive("/dashboard") ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  {user?.role === "patient" && (
                    <Link href="/book-appointment" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant={isActive("/book-appointment") ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                      >
                        <CalendarPlus className="h-4 w-4" />
                        Pesan Janji Temu
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
