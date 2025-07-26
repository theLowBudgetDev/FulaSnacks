
"use client";

import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, User as UserIcon, Search } from "lucide-react";
import { PaginationComponent } from '@/components/shared/PaginationComponent';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { UserProfileDialog } from '@/components/admin/UserProfileDialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

export default function AdminUsersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

    const searchTerm = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') || 'all';
    const currentPage = Number(searchParams.get('page') || '1');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const params = new URLSearchParams({
                search: searchTerm,
                role: roleFilter,
                page: String(currentPage),
                limit: String(ITEMS_PER_PAGE),
            });
            const res = await fetch(`/api/admin/users?${params.toString()}`);
            const data = await res.json();
            setUsers(data.users);
            setTotalUsers(data.total);
            setLoading(false);
        };
        fetchUsers();
    }, [searchTerm, roleFilter, currentPage]);
    
    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('search', term);
        params.set('page', '1');
        router.push(`/admin/users?${params.toString()}`);
    }

    const handleFilter = (role: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('role', role);
        params.set('page', '1');
        router.push(`/admin/users?${params.toString()}`);
    }
    
    const getRoleVariant = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin': return 'destructive';
            case 'vendor': return 'default';
            case 'customer': return 'secondary';
            default: return 'outline';
        }
    };

    const handleViewProfile = (user: User) => {
        setSelectedUser(user);
        setIsProfileDialogOpen(true);
    };

    const handleResetPassword = (user: User) => {
        toast({
            title: "Password Reset Sent",
            description: `A password reset link has been sent to ${user.email}.`,
        });
    };

    const handleSuspendUser = async (user: User) => {
        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ suspended: true }),
            });
            if (!res.ok) throw new Error('Failed to suspend user');
            setUsers(users.map(u => u.id === user.id ? { ...u, suspended: true } : u));
            toast({
                variant: "destructive",
                title: "User Suspended",
                description: `${user.name} (${user.email}) has been suspended.`,
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to suspend user.',
                variant: 'destructive',
            });
        }
    };

    const handleChangeRole = async (user: User) => {
        // Cycle roles: CUSTOMER → VENDOR → ADMIN → CUSTOMER
        const nextRole = user.role === 'CUSTOMER' ? 'VENDOR' : user.role === 'VENDOR' ? 'ADMIN' : 'CUSTOMER';
        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: nextRole }),
            });
            if (!res.ok) throw new Error('Failed to change role');
            setUsers(users.map(u => u.id === user.id ? { ...u, role: nextRole } : u));
            toast({ title: 'Role Changed', description: `${user.name} is now ${nextRole}.` });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to change role.', variant: 'destructive' });
        }
    };


  return (
    <>
    <Card>
        <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View, manage, search, and filter all users on the platform.</CardDescription>
        </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    type="search"
                    placeholder="Search by name or email..."
                    className="pl-10"
                    defaultValue={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <Select value={roleFilter} onValueChange={handleFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="VENDOR">Vendor</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined On</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                ))
            ) : users.map(user => (
                <TableRow key={user.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
                            <AvatarFallback>
                                <UserIcon />
                            </AvatarFallback>
                        </Avatar>
                        {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={getRoleVariant(user.role) as any}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewProfile(user)}>View Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleResetPassword(user)}>Reset Password</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleChangeRole(user)}>Change Role</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={async () => {
                                  if (window.confirm(`Are you sure you want to delete ${user.name}? This cannot be undone.`)) {
                                    try {
                                      const res = await fetch(`/api/admin/users/${user.id}`, {
                                        method: 'DELETE',
                                      });
                                      if (!res.ok) throw new Error('Failed to delete user');
                                      setUsers(users.filter(u => u.id !== user.id));
                                      toast({ title: 'User Deleted', description: `${user.name} has been deleted.` });
                                    } catch (error) {
                                      toast({ title: 'Error', description: 'Failed to delete user.', variant: 'destructive' });
                                    }
                                  }
                                }}>Delete User</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => handleSuspendUser(user)}>Suspend User</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
             {users.length === 0 && !loading && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No users found.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter>
        <PaginationComponent 
            totalPages={totalPages}
            currentPage={currentPage}
        />
      </CardFooter>
    </Card>

    {selectedUser && (
        <UserProfileDialog
            user={selectedUser}
            open={isProfileDialogOpen}
            onOpenChange={setIsProfileDialogOpen}
        />
    )}
    </>
  );
}
