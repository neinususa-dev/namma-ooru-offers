import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, useUsers } from "@/hooks/useUsers";
import { Search, Edit, UserCheck, UserX, Mail, Phone, MapPin, Building } from "lucide-react";

interface UserManagementProps {
  role: 'customer' | 'merchant';
  title: string;
}

export function UserManagement({ role, title }: UserManagementProps) {
  const { users, loading, updateUser, toggleUserStatus } = useUsers(role);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.store_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (user: User) => {
    const newStatus = !user.is_active;
    const result = await toggleUserStatus(user.id, newStatus);
    
    if (result.success) {
      toast.success(
        `${user.name} ${newStatus ? 'enabled' : 'disabled'} successfully`
      );
    } else {
      toast.error(result.error || 'Failed to update user status');
    }
  };

  const handleEditUser = async (updates: Partial<User>) => {
    if (!editingUser) return;
    
    const result = await updateUser(editingUser.id, updates);
    
    if (result.success) {
      toast.success('User updated successfully');
      setIsEditDialogOpen(false);
      setEditingUser(null);
    } else {
      toast.error(result.error || 'Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${role}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className={`transition-all duration-200 ${!user.is_active ? 'opacity-60 bg-muted/30' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <Badge variant={user.is_active ? "default" : "destructive"}>
                      {user.is_active ? "Active" : "Disabled"}
                    </Badge>
                    {role === 'merchant' && user.store_name && (
                      <Badge variant="outline">{user.store_name}</Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone_number && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{user.phone_number}</span>
                      </div>
                    )}
                    {(user.city || user.district) && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{user.city || user.district}</span>
                      </div>
                    )}
                    {role === 'merchant' && user.store_location && (
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{user.store_location}</span>
                      </div>
                    )}
                  </div>

                  {!user.is_active && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                      <p className="text-sm text-yellow-800">
                        <strong>Account Disabled:</strong> This user cannot login. They should contact{' '}
                        <a href="mailto:nammaooruoffers.official@gmail.com" className="text-yellow-900 underline">
                          nammaooruoffers.official@gmail.com
                        </a>{' '}
                        for assistance.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      {editingUser && (
                        <EditUserForm
                          user={editingUser}
                          onSave={handleEditUser}
                          onCancel={() => {
                            setIsEditDialogOpen(false);
                            setEditingUser(null);
                          }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant={user.is_active ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.is_active ? (
                      <>
                        <UserX className="h-4 w-4 mr-1" />
                        Disable
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Enable
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? `No ${role}s found matching "${searchTerm}"` : `No ${role}s found`}
          </p>
        </div>
      )}
    </div>
  );
}

interface EditUserFormProps {
  user: User;
  onSave: (updates: Partial<User>) => void;
  onCancel: () => void;
}

function EditUserForm({ user, onSave, onCancel }: EditUserFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone_number: user.phone_number || '',
    city: user.city || '',
    district: user.district || '',
    store_name: user.store_name || '',
    store_location: user.store_location || '',
    is_active: user.is_active
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone_number}
          onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
          />
        </div>
      </div>

      {user.role === 'merchant' && (
        <>
          <div>
            <Label htmlFor="store_name">Store Name</Label>
            <Input
              id="store_name"
              value={formData.store_name}
              onChange={(e) => setFormData(prev => ({ ...prev, store_name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="store_location">Store Location</Label>
            <Input
              id="store_location"
              value={formData.store_location}
              onChange={(e) => setFormData(prev => ({ ...prev, store_location: e.target.value }))}
            />
          </div>
        </>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="active">Account Active</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}