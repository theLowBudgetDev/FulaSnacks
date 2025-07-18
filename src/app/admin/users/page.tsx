
"use client";

import { useState, useMemo } from 'react';
import { allUsers } from "@/lib/placeholder-data";
import type { User } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, User as UserIcon } from "lucide-react";
import { PaginationComponent } from '@/components/shared/PaginationComponent';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { UserProfileDialog } from '@/components/admin/UserProfileDialog';

const ITEMS_PER_PAGE = 10;

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>(allUsers);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const { toast } = useToast();

    const paginatedUsers = useMemo(() => {
        return users.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
    }, [users, currentPage]);
    
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
    
    const getRoleVariant = (role: string) => {
        switch (role) {
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
            <CardDescription>View and manage all users on the platform.</CardDescription>
        </CardHeader>
      <CardContent>
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
            {paginatedUsers.map(user => (
                <TableRow key={user.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter>
        <PaginationComponent 
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
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
