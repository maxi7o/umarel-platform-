import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { InAppNotificationService } from '@/lib/services/in-app-notification-service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCheck, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default async function NotificationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const notifications = await InAppNotificationService.getForUser(user.id, 50);
    const unreadCount = await InAppNotificationService.getUnreadCount(user.id);

    return (
        <div className="container max-w-4xl py-10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Notificaciones</h1>
                    <p className="text-muted-foreground mt-2">
                        Historial de tus alertas y actualizaciones recientes.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <form action="/api/notifications/mark-all-read" method="POST">
                        <Button type="submit" variant="outline" className="gap-2">
                            <CheckCheck className="w-4 h-4" />
                            Marcar todo como leído
                        </Button>
                    </form>
                )}
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Bell className="w-5 h-5" /> Tus Alertas
                        </CardTitle>
                        <Badge variant="secondary">{unreadCount} no leídas</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                                <div className="bg-slate-50 p-4 rounded-full mb-4">
                                    <Bell className="w-8 h-8 opacity-20" />
                                </div>
                                <h3 className="font-semibold text-lg">Todo al día</h3>
                                <p>No tenés notificaciones pendientes.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={cn(
                                            "p-6 flex gap-4 transition-colors hover:bg-slate-50 group",
                                            !n.isRead ? "bg-blue-50/30" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "w-3 h-3 mt-1.5 rounded-full flex-shrink-0",
                                            !n.isRead ? "bg-blue-600" : "bg-slate-200"
                                        )} />

                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className={cn("text-base", !n.isRead ? "font-semibold text-slate-900" : "font-medium text-slate-700")}>
                                                    {n.title}
                                                </h4>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                                    {formatDistanceToNow(n.createdAt || new Date(), { addSuffix: true, locale: es })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                                                {n.message}
                                            </p>

                                            {n.actionUrl && (
                                                <div className="pt-2">
                                                    <Button variant="link" className="px-0 h-auto text-blue-600 flex items-center gap-1 group-hover:underline" asChild>
                                                        <a href={n.actionUrl}>
                                                            Ver detalle &rarr;
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
