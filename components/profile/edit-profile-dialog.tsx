'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Pencil } from 'lucide-react';
import { updateProfile, ProfileUpdateData } from '@/app/actions/profile-actions';
import { toast } from 'sonner';

interface EditProfileDialogProps {
    userId: string;
    initialData: ProfileUpdateData;
}

export function EditProfileDialog({ userId, initialData }: EditProfileDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ProfileUpdateData>(initialData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await updateProfile(userId, formData);
            if (result.success) {
                toast.success('Profile updated successfully');
                setOpen(false);
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullName" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="fullName"
                                value={formData.fullName || ''}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tagline" className="text-right">
                                Tagline
                            </Label>
                            <Input
                                id="tagline"
                                value={formData.tagline || ''}
                                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                className="col-span-3"
                                placeholder="e.g. Master Carpenter"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bio" className="text-right">
                                Bio
                            </Label>
                            <Textarea
                                id="bio"
                                value={formData.bio || ''}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="col-span-3"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right">
                                Location
                            </Label>
                            <Input
                                id="location"
                                value={formData.location || ''}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="website" className="text-right">
                                Website
                            </Label>
                            <Input
                                id="website"
                                value={formData.website || ''}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                className="col-span-3"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="border-t pt-4 mt-2">
                            <h4 className="text-sm font-medium mb-4">Social Links</h4>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="twitter" className="text-right">Twitter</Label>
                                    <Input
                                        id="twitter"
                                        value={formData.socialLinks?.twitter || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                                        })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="linkedin" className="text-right">LinkedIn</Label>
                                    <Input
                                        id="linkedin"
                                        value={formData.socialLinks?.linkedin || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                                        })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="github" className="text-right">GitHub</Label>
                                    <Input
                                        id="github"
                                        value={formData.socialLinks?.github || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            socialLinks: { ...formData.socialLinks, github: e.target.value }
                                        })}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
