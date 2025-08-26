import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, Store, ShoppingCart } from 'lucide-react';

export function AuthButton() {
  const { user, profile, signOut, loading } = useAuth();

  if (loading) {
    return <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />;
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
        <Button size="sm" className="bg-primary-gradient hover:opacity-90" asChild>
          <Link to="/auth">Join Now</Link>
        </Button>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile.email}
            </p>
            <div className="flex items-center pt-1">
              {profile.role === 'merchant' ? (
                <><Store className="w-3 h-3 mr-1" /> Merchant</>
              ) : (
                <><ShoppingCart className="w-3 h-3 mr-1" /> Customer</>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}