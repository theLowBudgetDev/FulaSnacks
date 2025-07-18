
"use client";

import type { User } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserProfileDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ user, open, onOpenChange }: UserProfileDialogProps) {

  const getRoleVariant = (role: string) => {
    switch (role) {
        case 'admin': return 'destructive';
        case 'vendor': return 'default';
        case 'customer': return 'secondary';
        default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{user.name}</DialogTitle>
              <DialogDescription>{user.email}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Role</h4>
                <p>
                    <Badge variant={getRoleVariant(user.role) as any}>{user.role}</Badge>
                </p>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-muted-foreground">User ID</h4>
                <p className="text-sm">{user.id}</p>
            </div>
             <div>
                <h4 className="text-sm font-semibold text-muted-foreground">Joined On</h4>
                <p className="text-sm">{new Date(user.createdAt).toLocaleString()}</p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
