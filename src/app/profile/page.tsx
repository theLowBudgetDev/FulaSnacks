
"use client";

import { useState, useEffect } from "react";
<<<<<<< HEAD
=======
import { useSession } from "next-auth/react";
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
import { useFavorites } from "@/context/FavoritesContext";
import SnackCard from "@/components/shared/SnackCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
<<<<<<< HEAD
import type { Snack, User } from "@/lib/types";
=======
import type { Snack } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const { toast } = useToast();
    const { favorites } = useFavorites();
<<<<<<< HEAD
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
=======
    const [favoriteSnacks, setFavoriteSnacks] = useState<Snack[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [name, setName] = useState(session?.user?.name || "");

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session]);

    useEffect(() => {
        if (favorites.length > 0) {
            // In a real app, you'd fetch this from an API
            const fetchFavorites = async () => {
                setLoading(true);
                // This would be an API call, e.g., fetch('/api/snacks/favorites', { method: 'POST', body: JSON.stringify({ ids: favorites }) })
                // const res = await fetch(`/api/snacks/byIds?ids=${favorites.join(',')}`);
                // const snacks = await res.json();
                // setFavoriteSnacks(snacks);
                setLoading(false);
            };
            fetchFavorites();
        } else {
            setLoading(false);
        }
    }, [favorites]);
    
    const handleUpdateProfile = async () => {
        // API call to update user profile
        // e.g., await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify({ name }) })
        
        // Update the session locally
        await update({ name });
        
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
        toast({
            title: "Profile Updated",
            description: "Your account details have been saved."
        });
    }

    const user = session?.user as any;

  return (
    <div className="container mx-auto px-4 py-16">
<<<<<<< HEAD
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
=======
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <Avatar className="h-32 w-32 border-4 border-primary">
                <AvatarImage src={user?.avatarUrl || "https://placehold.co/100x100.png"} alt={user?.name || "User"} data-ai-hint="person avatar"/>
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
                <h1 className="font-headline text-4xl font-bold">{user?.name}</h1>
                <p className="text-muted-foreground text-lg">{user?.email}</p>
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
                        {loading ? (
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
                            </div>
                        ) : favoriteSnacks.length > 0 ? (
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
                            <Input id="fullname" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={user?.email || ''} disabled />
                        </div>
                        <Button onClick={handleUpdateProfile}>Save Changes</Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
    </div>
  );
}
