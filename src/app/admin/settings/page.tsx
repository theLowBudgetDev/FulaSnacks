
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [platformLoading, setPlatformLoading] = useState(false);
  
  // Form states
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [commissionRate, setCommissionRate] = useState<number | undefined>(undefined);
  const [deliveryFee, setDeliveryFee] = useState<number | undefined>(undefined);
  const [enableNotifications, setEnableNotifications] = useState<boolean | undefined>(undefined);
  const [enableAutoApproval, setEnableAutoApproval] = useState<boolean | undefined>(undefined);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        setAdminName(data.admin?.name || '');
        setAdminEmail(data.admin?.email || '');
        setCommissionRate(data.commissionRate);
        setDeliveryFee(data.deliveryFee);
        setEnableNotifications(data.enableNotifications);
        setEnableAutoApproval(data.enableAutoApproval);
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' });
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminName,
          adminEmail,
          commissionRate,
          deliveryFee,
          enableNotifications,
          enableAutoApproval,
        }),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast({
        title: "Settings Saved",
        description: "Your admin details have been updated.",
      });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    }
    setIsLoading(false);
  };


  const handleUpdatePassword = async () => {
    // Validate passwords
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setPasswordLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPasswordLoading(false);
    
    // Clear password fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };
  
  const handleSavePlatformSettings = async () => {
    setPlatformLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPlatformLoading(false);
    
    toast({
      title: "Platform Settings Saved",
      description: "Global platform settings have been updated.",
    });
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Manage your administrator account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="admin-name">Full Name</Label>
                    <Input 
                      id="admin-name" 
                      value={adminName} 
                      onChange={(e) => setAdminName(e.target.value)} 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={adminEmail} 
                      onChange={(e) => setAdminEmail(e.target.value)} 
                    />
                </div>
                <Button onClick={handleSaveChanges} disabled={isLoading}>
                  {isLoading ? (
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
        <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <Button onClick={handleUpdatePassword} disabled={passwordLoading}>
                  {passwordLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Global settings for the FulaSnacks application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                    <Input 
                      id="commission-rate" 
                      type="number" 
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      min="0"
                      max="100"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="delivery-fee">Default Delivery Fee (₦)</Label>
                    <Input 
                      id="delivery-fee" 
                      type="number" 
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(Number(e.target.value))}
                      min="0"
                    />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="notifications" 
                      checked={enableNotifications}
                      onCheckedChange={setEnableNotifications}
                    />
                    <Label htmlFor="notifications">Enable Email Notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-approval" 
                      checked={enableAutoApproval}
                      onCheckedChange={setEnableAutoApproval}
                    />
                    <Label htmlFor="auto-approval">Auto-approve New Vendors</Label>
                </div>
                <Separator className="my-2" />
                <Button onClick={handleSavePlatformSettings} disabled={platformLoading}>
                  {platformLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Platform Settings"
                  )}
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
