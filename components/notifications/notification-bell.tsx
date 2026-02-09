"use client"

import { useState, useEffect } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Types matching DB schema
interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    actionUrl?: string;
    metadata?: any;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications?limit=20');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 60s
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkRead = async (id: string, url?: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
        } catch (err) {
            console.error('Failed to mark read', err);
        }

        if (url) {
            setIsOpen(false);
            router.push(url);
        }
    };

    const handleMarkAllRead = async () => {
        setIsLoading(true);
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllRead: true }),
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-stone-900">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border border-background animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96 p-0 shadow-xl border-slate-200" align="end">
                <div className="p-3 border-b flex items-center justify-between bg-white rounded-t-lg">
                    <h4 className="font-semibold text-sm">Notificaciones</h4>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllRead}
                            disabled={isLoading}
                            className="h-7 text-xs text-muted-foreground hover:text-primary"
                        >
                            {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Check className="w-3 h-3 mr-1" />}
                            Marcar leídas
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[350px] bg-slate-50">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                            <Bell className="w-12 h-12 mb-2 opacity-20" />
                            <p className="text-sm">No tenés notificaciones</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        "p-4 hover:bg-slate-100 transition-colors cursor-pointer flex gap-3 items-start group",
                                        !n.isRead ? "bg-white" : "bg-slate-50/50"
                                    )}
                                    onClick={() => handleMarkRead(n.id, n.actionUrl)}
                                >
                                    <div className={cn(
                                        "w-2 h-2 mt-1.5 rounded-full flex-shrink-0",
                                        !n.isRead ? "bg-blue-600" : "bg-transparent"
                                    )} />

                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className={cn("text-sm leading-none", !n.isRead ? "font-semibold text-slate-900" : "font-medium text-slate-700")}>
                                                {n.title}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: es })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2">
                                            {n.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="p-2 border-t bg-white text-center rounded-b-lg">
                    <Button variant="link" size="sm" className="text-xs w-full h-auto py-1" onClick={() => router.push('/notifications')}>
                        Ver todas
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
