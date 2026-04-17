"use client"

import { DivideCircle } from "lucide-react";
import { resolve } from "path";
import { useState, useEffect, useRef, useCallback } from "react"

// Definisikan Tipe Data Item

interface FeedItem {
    id: number;
    title: string;
    description: string;
    page: number;
}

export default function InfiniteScrollFeed() {
    const [items, setItems] = useState<FeedItem[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Ref untuk Observer
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    //Fungsi untuk memuat data baru (Simulasi API Call)
    const fetchData = async(pageNum: number) : Promise<FeedItem[]> => {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulasi delay

        //Batas Maksimum halaman 
        if (pageNum > 5) {
            return [];
        }
    
        const newItems: FeedItem[] = Array.from({ length: 10 }, (_, i ) => ({
            id: (pageNum - 1) * 10 + i + 1,
            title: `Item ${(pageNum - 1) * 10 + i +1}`,
            description: `Descripsi untuk item ${(pageNum - 1) * 10 + i + 1}`,
            page: pageNum
        }));

        return newItems;
    };

    // Callback untuk Intersection Observer
    const loadMoreItems = useCallback(async () => {
        if (isLoading || !hasMore) return;
        
        setIsLoading(true);

        try {
            const newItems = await fetchData(page);
            if (newItems.length === 0) {
                setHasMore(false);
            } else {
                setItems((prevItems) => [...prevItems, ...newItems]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, page]);

    // Setup Intersection Obsever
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreItems();
                }
            },
            {
                rootMargin: "200px",
                threshold: 0.1
            }
        );

        const currentSentinel = sentinelRef.current;
        if (currentSentinel) {
            observer.observe(currentSentinel);
        }

        return () => {
            if (currentSentinel) {
                observer.unobserve(currentSentinel);
            }
        };
    }, [loadMoreItems]);

    //Load Data Awal
    useEffect(() => {
        loadMoreItems();
    }, []);
    
    return (
        <div className="w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
                Infinite Scroll Feed
            </h3>

            {/* Container Feed Items */}
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={`${item.id}-${index}`}
                        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">

                        <h4 className="font-semibold text-lg text-indigo-600 mb-2">
                            {item.title}
                        </h4>
                        <p className="text-gray-600">{item.description}</p>
                        <span className="inline-block mt-2 text-xs text-gray-400">
                            Halaman {item.page} # ID: {item.id}
                        </span>
                    </div>
                ))}
            </div>

            {/* Skeleton Loading */}
            {isLoading && (
                <div className="space-y-4 mt-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <SkeletonLoader key={index} />
                    ))}
                </div>
            )}

            {/* Sentinel untuk Intersection Observer */}
            <div ref={sentinelRef} className="h-10 flex items-center justify-center">
                {!hasMore && !isLoading && (
                    <p className="text-gray-500 text-sm font-medium">
                        Anda sudah mencapai akhir feed.
                    </p>
                )}
            </div>
        </div>
    )
}

// Komponen Skeleton Loader 
function SkeletonLoader() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-100 rounded w-1/4 mt-3"></div>
        </div>
    )
}