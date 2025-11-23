import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Heart, Menu, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/providers/AuthProvider';
import { ThemeToggle } from '@/components/ThemeToggle';

export const AppHeader = () => {
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (hasRole('admin')) return '/admin';
    if (hasRole('student')) return '/student';
    if (hasRole('donor')) return '/donor';
    return '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container grid h-16 items-center grid-cols-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            EdVisingU
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-6">
          {isAuthenticated && (
            <Link
              to={getDashboardRoute()}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          )}
          {isAuthenticated && hasRole('student') && (
            <Link
              to="/campaigns/new"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Create Campaign
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to="/discover"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Discover Students
            </Link>
          )}
          {isAuthenticated && hasRole('donor') && (
            <Link
              to="/membership"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Membership
            </Link>
          )}
        </nav>

  {/* Actions */}
  <div className="flex items-center justify-end gap-3 pr-2">
          <ThemeToggle />
          
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardRoute())}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Log in
              </Button>
              <Button onClick={() => navigate('/register')} className="hidden sm:inline-flex">
                Get Started
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
