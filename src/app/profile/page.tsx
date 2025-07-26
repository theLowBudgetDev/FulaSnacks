
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/shared/ImageUpload";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const { toast } = useToast();
    const { favorites } = useFavorites();
    const [favoriteSnacks, setFavoriteSnacks] = useState<Snack[]>([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(false);
    
    const [name, setName] = useState(session?.user?.name || "");
    const [avatarUrl, setAvatarUrl] = useState((session?.user as any)?.avatarUrl || "");

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            setAvatarUrl((session.user as any).avatarUrl || "");
        }
    }, [session]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (favorites.length > 0) {
                setLoadingFavorites(true);
                try {
                    const res = await fetch(`/api/snacks/byIds?ids=${favorites.join(',')}`);
                    if (!res.ok) throw new Error("Failed to fetch favorites");
                    const snacks = await res.json();
                    setFavoriteSnacks(snacks);
                } catch (error) {
                    console.error("Failed to fetch favorite snacks", error);
                } finally {
                    setLoadingFavorites(false);
                }
            } else {
                setFavoriteSnacks([]);
                setLoadingFavorites(false);
            }
        };
        fetchFavorites();
    }, [favorites]);
    
    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingProfile(true);
        try {
            const res = await fetch('/api/user/profile', { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, avatarUrl }) 
            });
            if (!res.ok) throw new Error("Failed to update profile");
            
            // Update the session locally to reflect changes immediately
            await update({ name, avatarUrl });
            
            toast({
                title: "Profile Updated",
                description: "Your account details have been saved."
            });
        } catch(error) {
             toast({
                variant: "destructive",
                title: "Error",
                description: "Could not update your profile."
            });
        } finally {
            setLoadingProfile(false);
        }
    }

    const user = session?.user as any;

  return (
    <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <Avatar className="h-32 w-32 border-4 border-primary">
                <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "User"} data-ai-hint="person avatar"/>
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
                        {loadingFavorites ? (
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
                    <CardContent className="max-w-lg">
                       <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Avatar</Label>
                                <ImageUpload 
                                    value={avatarUrl} 
                                    onChange={(url) => setAvatarUrl(url)}
                                    disabled={loadingProfile}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input id="fullname" value={name} onChange={(e) => setName(e.target.value)} disabled={loadingProfile}/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" value={user?.email || ''} disabled />
                            </div>
                            <Button type="submit" disabled={loadingProfile}>
                                {loadingProfile ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
