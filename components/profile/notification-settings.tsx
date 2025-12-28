'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationSettings() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mock State - In real app, load from DB
    const [settings, setSettings] = useState({
        emailAlerts: true,
        whatsappAlerts: false,
        weeklyDigest: true,
        marketing: false
    });

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false);
        setOpen(false);
        toast.success('Notification preferences saved');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notification Settings">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Notification Settings</DialogTitle>
                    <DialogDescription>
                        Manage how you want to be notified about activity and payouts.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="email-alerts" className="flex flex-col space-y-1">
                            <span>Email Alerts</span>
                            <span className="font-normal text-xs text-muted-foreground">Receive updates about your slices and dividends.</span>
                        </Label>
                        <Switch
                            id="email-alerts"
                            checked={settings.emailAlerts}
                            onCheckedChange={(c) => setSettings(s => ({ ...s, emailAlerts: c }))}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="whatsapp-alerts" className="flex flex-col space-y-1">
                            <span>WhatsApp Alerts</span>
                            <span className="font-normal text-xs text-muted-foreground">Get instant pings for urgent updates.</span>
                        </Label>
                        <Switch
                            id="whatsapp-alerts"
                            checked={settings.whatsappAlerts}
                            onCheckedChange={(c) => setSettings(s => ({ ...s, whatsappAlerts: c }))}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="weekly-digest" className="flex flex-col space-y-1">
                            <span>Weekly Digest</span>
                            <span className="font-normal text-xs text-muted-foreground">Summary of your Aura growth and earnings.</span>
                        </Label>
                        <Switch
                            id="weekly-digest"
                            checked={settings.weeklyDigest}
                            onCheckedChange={(c) => setSettings(s => ({ ...s, weeklyDigest: c }))}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="marketing" className="flex flex-col space-y-1">
                            <span>Product Updates</span>
                            <span className="font-normal text-xs text-muted-foreground">News about new Umarel features.</span>
                        </Label>
                        <Switch
                            id="marketing"
                            checked={settings.marketing}
                            onCheckedChange={(c) => setSettings(s => ({ ...s, marketing: c }))}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Preferences
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
