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
import { User, LogOut, Store, ShoppingCart, Gift, Plus } from 'lucide-react';

export function AuthButton() {
  const { user, profile, signOut, loading } = useAuth();

  if (loading) {
    return <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />;
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/signin">Log In</Link>
        </Button>
        <Button size="sm" className="bg-primary-gradient hover:opacity-90" asChild>
          <Link to="/signup">Join Now</Link>
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
    <div className="flex items-center gap-3">
      {/* User name and role display */}
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-sm font-medium text-foreground">{profile.name}</span>
        <span className="text-xs text-muted-foreground capitalize">
          {profile.role}
        </span>
      </div>
      
      {/* Blue circular avatar with dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-600 text-white font-semibold">
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
        <DropdownMenuItem asChild>
          <Link to={profile.role === 'merchant' ? "/merchant-post-offer" : "/your-offers"} className="flex items-center">
            {profile.role === 'merchant' ? <Plus className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
            <span>{profile.role === 'merchant' ? 'Post Offer' : 'Your Offers'}</span>
          </Link>
        </DropdownMenuItem>
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
    </div>
  );
}