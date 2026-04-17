"use client";

import { useEffect, useState, useCallback } from "react"; // Tambah useCallback
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import PWAInstallButton from "../PWAButton";
import PWARegister from "../PWARegister";
import { NotificationProvider, useNotification } from "../NotificationComponent";
import { supabase } from "@/lib/supabase";

interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: string;
}

function LayoutContext({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Penulisan camelCase
    const { sendNotification } = useNotification();

    useEffect(() => {
        const channel = supabase
            .channel('layout-notification')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'todos' },
                async (payload) => {
                    // Gunakan optional chaining untuk keamanan data
                    const todo = (payload.new || payload.old) as Todo;
                    
                    let title = "";
                    if (payload.eventType === 'INSERT') title = 'New Todo Added';
                    else if (payload.eventType === 'UPDATE') title = todo.completed ? 'Todo Completed' : 'Todo Updated';
                    else if (payload.eventType === 'DELETE') title = 'Todo Deleted';

                    if (title) {
                        sendNotification({
                            title: title,
                            body: todo?.text || 'A todo item was modified',
                            redirectUrl: '/realtime-db'
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sendNotification]); // Pastikan context provider tidak me-recreate sendNotification setiap render

    // Gunakan useCallback agar fungsi tidak dibuat ulang terus menerus
    const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    return (
        <div className="flex min-h-screen">
            <PWAInstallButton/>
            <PWARegister/>
            
            {/* Pastikan Sidebar menggunakan Next/Link */}
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>
            
            <div className="flex flex-col flex-1">
                <Header brandName="MyApp" onBrandClick={toggleSidebar}/>
                
                {/* POIN PENTING: {children} di bawah ini akan merender file page.tsx 
                   sesuai dengan route/url saat ini.
                */}
                <main className="flex-1 p-4 md:p-6 bg-gray-50">
                    {children}
                </main>
                
                <Footer/>
            </div>
        </div>
    );
}

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <NotificationProvider>
            <LayoutContext>{children}</LayoutContext>
        </NotificationProvider>
    );
}