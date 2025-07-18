
"use client";

import { useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { allSnacks } from "@/lib/placeholder-data";
import SnackCard from "@/components/shared/SnackCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
    const { toast } = useToast();
    const { favorites } = useFavorites();
    const favoriteSnacks = allSnacks.filter(snack => favorites.includes(snack.id));
    
    const handleUpdateProfile = () => {
        toast({
            title: "Profile Updated",
            description: "Your account details have been saved."
        });
    }

  return (
    <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <Avatar className="h-32 w-32 border-4 border-primary">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person avatar"/>
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
                <h1 className="font-headline text-4xl font-bold">Alex Doe</h1>
                <p className="text-muted-foreground text-lg">alex.doe@fulafia.edu.ng</p>
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
                            <Input id="fullname" defaultValue="Alex Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue="alex.doe@fulafia.edu.ng" disabled />
                        </div>
                        <Button onClick={handleUpdateProfile}>Save Changes</Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}

