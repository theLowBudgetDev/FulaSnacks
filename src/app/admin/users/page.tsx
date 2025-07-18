
"use client";

<<<<<<< HEAD
import { useState, useMemo, useEffect } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
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
<<<<<<< HEAD
=======
import { useRouter, useSearchParams } from 'next/navigation';
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

export default function AdminUsersPage() {
<<<<<<< HEAD
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
=======
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

<<<<<<< HEAD
    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            // const response = await fetch('/api/admin/users');
            // const data = await response.json();
            // setUsers(data);
            setLoading(false);
        }
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);
=======
    const searchTerm = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') || 'all';
    const currentPage = Number(searchParams.get('page') || '1');
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const params = new URLSearchParams({
                search: searchTerm,
                role: roleFilter,
                page: String(currentPage),
                limit: String(ITEMS_PER_PAGE),
            });
            // const res = await fetch(`/api/admin/users?${params.toString()}`);
            // const data = await res.json();
            // setUsers(data.users);
            // setTotalUsers(data.total);
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
<<<<<<< HEAD
        switch (role) {
            case 'ADMIN': return 'destructive';
            case 'VENDOR': return 'default';
            case 'CUSTOMER': return 'secondary';
=======
        switch (role.toLowerCase()) {
            case 'admin': return 'destructive';
            case 'vendor': return 'default';
            case 'customer': return 'secondary';
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
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

    const handleSuspendUser = (user: User) => {
        toast({
            variant: "destructive",
            title: "User Suspended",
            description: `${user.name} (${user.email}) has been suspended.`,
        });
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
<<<<<<< HEAD
                [...Array(ITEMS_PER_PAGE)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))
            ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map(user => (
=======
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell>
                    </TableRow>
                ))
            ) : users.map(user => (
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
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
                                <DropdownMenuItem className="text-destructive" onClick={() => handleSuspendUser(user)}>Suspend User</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
<<<<<<< HEAD
            ))
            ) : (
=======
            ))}
             {users.length === 0 && !loading && (
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
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
