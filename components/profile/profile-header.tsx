"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Link as LinkIcon, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface ProfileHeaderProps {
    user: any
    isOwnProfile: boolean
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
    return (
        <div className="bg-card rounded-lg border shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="text-4xl">{user.fullName?.[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">{user.fullName}</h1>
                            {user.profile?.tagline && (
                                <p className="text-lg text-muted-foreground">{user.profile.tagline}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {isOwnProfile ? (
                                <Button variant="outline">Edit Profile</Button>
                            ) : (
                                <Link href={`/messages?userId=${user.id}`}>
                                    <Button>
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Message
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {user.profile?.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {user.profile.location}
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
                        </div>
                        {user.profile?.website && (
                            <div className="flex items-center gap-1">
                                <LinkIcon className="h-4 w-4" />
                                <a href={user.profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    Website
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                            {user.auraPoints} Aura Points
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}
