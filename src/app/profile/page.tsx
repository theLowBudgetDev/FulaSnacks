
"use client";

import { useState, useEffect } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import SnackCard from "@/components/shared/SnackCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Snack, User } from "@/lib/types";

export default function ProfilePage() {
    const { toast } = useToast();
    const { favorites } = useFavorites();
    const [user, setUser] = useState<User | null>(null);
    const [favoriteSnacks, setFavoriteSnacks] = useState<Snack[]>([]);
    
    useEffect(() => {
        // Fetch user data and favorite snacks
        // For now, using mock data
        const mockUser = {
            id: 'user-2',
            name: 'Alex Doe',
            email: 'alex.doe@fulafia.edu.ng',
            avatarUrl: 'https://placehold.co/100x100.png',
        };
        // setUser(mockUser as any);
    }, []);

    const handleUpdateProfile = () => {
        toast({
            title: "Profile Updated",
            description: "Your account details have been saved."
        });
    }

  return (
    <div className="container mx-auto px-4 py-16">
        {user && (
            <>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                <Avatar className="h-32 w-32 border-4 border-primary">
                    <AvatarImage src={user.avatarUrl} alt="User" data-ai-hint="person avatar"/>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                    <h1 className="font-headline text-4xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground text-lg">{user.email}</p>
                </div>
            </div>
            
            <Tabs defaultValue="favorites">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="favorites">My Favorites</TabsTrigger>
                    <TabsTrigger value="settings">Account Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="favorites" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Favorite Snacks</CardTitle>
                            <CardDescription>The snacks you love the most, all in one place.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {favoriteSnacks.length > 0 ? (
                                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                    {favoriteSnacks.map((snack) => (
                                        <SnackCard key={snack.id} snack={snack} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground py-8 text-center">You haven't added any snacks to your favorites yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="settings" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Profile</CardTitle>
                            <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 max-w-lg">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input id="fullname" defaultValue={user.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={user.email} disabled />
                            </div>
                            <Button onClick={handleUpdateProfile}>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            </>
        )}
    </div>
  );
}
