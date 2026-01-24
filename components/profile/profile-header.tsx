'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Link as LinkIcon, Twitter, Linkedin, Github, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

import { EditProfileDialog } from './edit-profile-dialog';
import { NotificationSettings } from './notification-settings';

interface ProfileHeaderProps {
    userId: string;
    isOwner: boolean;
    fullName: string;
    avatarUrl?: string;
    tagline?: string;
    bio?: string;
    location?: string;
    website?: string;
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
    };
    auraLevel: string;
}

export function ProfileHeader({
    userId,
    isOwner,
    fullName,
    avatarUrl,
    tagline,
    bio,
    location,
    website,
    socialLinks,
    auraLevel
}: ProfileHeaderProps) {
    return (
        <Card className="w-full bg-gradient-to-br from-background to-muted/20 border-border/50">
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                        <AvatarImage src={avatarUrl} alt={fullName} />
                        <AvatarFallback className="text-xl bg-orange-100 text-orange-700">
                            {fullName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                            <div>
                                <h1 className="text-2xl font-bold font-heading">{fullName}</h1>
                                {tagline && <p className="text-muted-foreground font-medium">{tagline}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`
                                    capitalize px-3 py-1 font-bold border-2
                                    ${auraLevel === 'gold' ? 'border-yellow-400 text-yellow-600 bg-yellow-50' : ''}
                                    ${auraLevel === 'silver' ? 'border-slate-300 text-slate-600 bg-slate-50' : ''}
                                    ${auraLevel === 'bronze' ? 'border-orange-200 text-orange-700 bg-orange-50' : ''}
                                    ${auraLevel === 'diamond' ? 'border-blue-300 text-blue-600 bg-blue-50' : ''}
                                `}>
                                    {auraLevel} Aura
                                </Badge>
                                {isOwner && (
                                    <>
                                        <Button variant="outline" size="sm" asChild className="gap-2 border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 h-9">
                                            <Link href="/verify">
                                                <ShieldAlert className="h-4 w-4" />
                                                Verificar Identidad
                                            </Link>
                                        </Button>
                                        <NotificationSettings />
                                        <EditProfileDialog
                                            userId={userId}
                                            initialData={{
                                                fullName,
                                                avatarUrl,
                                                tagline,
                                                bio,
                                                location,
                                                website,
                                                socialLinks
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {bio && <p className="text-sm text-foreground/80 max-w-2xl leading-relaxed">{bio}</p>}

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                            {location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{location}</span>
                                </div>
                            )}
                            {website && (
                                <div className="flex items-center gap-1">
                                    <LinkIcon className="h-4 w-4" />
                                    <Link href={website} target="_blank" className="hover:underline hover:text-primary transition-colors">
                                        Website
                                    </Link>
                                </div>
                            )}
                        </div>

                        {socialLinks && Object.values(socialLinks).some(Boolean) && (
                            <div className="flex gap-2 pt-2">
                                {socialLinks.twitter && (
                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                        <Link href={socialLinks.twitter} target="_blank"><Twitter className="h-4 w-4" /></Link>
                                    </Button>
                                )}
                                {socialLinks.linkedin && (
                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                        <Link href={socialLinks.linkedin} target="_blank"><Linkedin className="h-4 w-4" /></Link>
                                    </Button>
                                )}
                                {socialLinks.github && (
                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                        <Link href={socialLinks.github} target="_blank"><Github className="h-4 w-4" /></Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
