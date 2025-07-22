
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  
  const [vendorName, setVendorName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [campusLocation, setCampusLocation] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    // Fetch vendor-specific data
    const fetchVendorData = async () => {
      const res = await fetch('/api/dashboard/settings');
      if (res.ok) {
        const data = await res.json();
        setVendorName(data.user.name);
        setEmail(data.user.email);
        setDescription(data.description);
        setCampusLocation(data.campusLocation);
        setLogoUrl(data.logoUrl);
      }
    };
    fetchVendorData();
  }, []);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: vendorName, description, campusLocation, logoUrl }),
      });
      if (!res.ok) throw new Error('Failed to update settings');
      
      // Also update the session if the name changed
      await update({ name: vendorName });

      toast({
        title: "Settings Saved",
        description: "Your profile details have been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSaveChanges} className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Vendor Settings</CardTitle>
                <CardDescription>Manage your vendor profile and account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="vendor-name">Vendor Name</Label>
                    <Input id="vendor-name" value={vendorName} onChange={e => setVendorName(e.target.value)} disabled={loading}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} disabled />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="logo-url">Logo URL</Label>
                    <Input id="logo-url" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} disabled={loading}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="campus-location">Campus Location</Label>
                    <Input id="campus-location" value={campusLocation} onChange={e => setCampusLocation(e.target.value)} disabled={loading}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} disabled={loading}/>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
            </CardContent>
        </Card>
    </form>
  );
}
