"use client";

import { useEffect } from "react";

export default function PWARegister() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);

                    // Check for update Periodically 
                    setInterval(() => {
                        registration.update();
                    }, 60000); //check every 10 minutes
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }, []);
    return null;
}