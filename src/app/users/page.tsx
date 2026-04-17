"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TableSkeleton from "@/components/TableSkeleton";
import { X } from "lucide-react";
import Link from "next/link";

type User = {
    id: number;
    name: string;
    email: string;
    kelas: string;
    tanggal_lahir: string;
    role: "Admin" | "Siswa";
}

//Data dummy
const dummyUsers : User[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@sekolah.com`,
    // distribute kelas 1 through 6
    kelas: `Kelas ${((i % 6) + 1)}`,
    // simple birthdate pattern
    tanggal_lahir: `200${i % 10}-0${(i % 9) + 1}-15`,
    role: i % 5 === 0 ? "Admin" : "Siswa",
}));

const ITEMS_PER_PAGE = 5;

export default function UsersPage() {
    const router = useRouter();

    //page number derived from query string (client-only)
    const [page, setPage] = useState(1);

    //state tabel
    const [isLoading, setIsLoading] = useState(false);
    const [selectedQR, setSelectedQR] = useState<User | null>(null);

    //State untuk tombol filter
    const [showFilter, setShowFilter] = useState(false);
    const [kelasFilter, setKelasFilter] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [tanggalLahirAwal, setTanggalLahirAwal] = useState<string | null>(null);
    const [tanggalLahirAkhir, setTanggalLahirAkhir] = useState<string | null>(null);

    //Reset Filter
    const [resetFilters, setResetFilters] = useState(false);

    //1. State untuk Pencarian dan Debounce
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncechQuery, setDebouncechQuery] = useState("");
    // hold a timeout id for cleanup
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    //2. Filter data pencarian
    const filteredUsers = dummyUsers.filter((user) => {
        const query = debouncechQuery.toLocaleLowerCase();
        const matchQuery = 
            user.name.toLocaleLowerCase().includes(query) ||
            user.email.toLocaleLowerCase().includes(query) ||
            user.kelas.toLocaleLowerCase().includes(query) ||
            user.tanggal_lahir.toLocaleLowerCase().includes(query) ||
            user.role.toLocaleLowerCase().includes(query)

        const matchKelas = kelasFilter ? user.kelas === kelasFilter : true;
        const matchRole = roleFilter ? user.role === roleFilter : true;
        const matchTanggalLahir = 
            tanggalLahirAwal && tanggalLahirAkhir
            ? user.tanggal_lahir >= tanggalLahirAwal && user.tanggal_lahir <= tanggalLahirAkhir
            : true;
        if (!matchKelas || !matchRole || !matchTanggalLahir) {
            return false;
            }
        return matchQuery;
    })

    //3. Logic pagination
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = filteredUsers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    //4. Reset Halaman ke 1 saat search berubah
    useEffect(() => {
        if (page !== 1) {
            router.push(`/users?page=1`);
            setPage(1);
        }
    }, [debouncechQuery]);

    //5. Efek Loading saat halaman berubah
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);   
    }, 500); // Simulasi loading selama 500ms

        return () => clearTimeout(timer);
    }, [page, debouncechQuery]);

    //Fungsi Navigasi Pagination
    const handlePageChange = (newPage: number) => {
        router.push(`/users?page=${newPage}`);
        setPage(newPage);
    }

    //update page state from URL when component mounts or router changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const p = Number(params.get("page")) || 1;
            setPage(p);
        }
    }, [router]);

    //Fungsi QR Code (menghasilkan URL berdasarkan user yang dipilih)
    const handleQRCode = (user: User) => {
        const data = `ID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`;
        return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=1000x1000`;
    }

    //Handle Click QR Code
    const handleQRCodeClick = (user: User) => {
        setSelectedQR(user);
    }

    //Handle Close QR Code
    const handleCloseModal = () => {
        setSelectedQR(null);
    }

    //Logika Reset Filter
    const handleResetFilters = () => {
        setKelasFilter(null);
        setRoleFilter(null);
        setTanggalLahirAwal(null);
        setTanggalLahirAkhir(null);
        setResetFilters(true);
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-600">Daftar Users</h1>
                    <Link href="/" className="text-indigo-600 hover:underline text-sm">
                        &larr; Kembali ke Home
                    </Link>
                </div>

                {/* Pencarian */}
                <div className="mb-4">
                    <div className="flex gap-2">
                        <input
                        type="text"
                        placeholder="Cari berdasarkan nama, email, atau role..."
                        className="w-full border border-gray-300 text-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            // reset previous timer
                            if (debounceTimer) clearTimeout(debounceTimer);
                            const timer = setTimeout(() => {
                                setDebouncechQuery(e.target.value);
                            }, 300);
                            setDebounceTimer(timer);
                        }}
                    />
                    <button onClick={() => setShowFilter(!showFilter)} className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 rounded-md">Filter</button>
                    </div>
                </div>

                {/* Tampilkan Filter */}
                {showFilter && (
                    <div className="mt-2 p-4 rounded-lg bg-gray-50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kelas</label>
                                    <select
                                        className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md p-2"
                                        value={kelasFilter || ""}
                                        onChange={(e) => setKelasFilter(e.target.value || null)}
                                    >
                                        <option value="">Semua</option>
                                        {[...Array(6)].map((_, i) => (
                                            <option key={i} value={`Kelas ${i + 1}`}>{`Kelas ${i + 1}`}</option>
                                        ))}
                                    </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                    <select
                                        className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md p-2"
                                        value={roleFilter || ""}
                                        onChange={(e) => setRoleFilter(e.target.value || null)}
                                    >
                                        <option value="">Semua</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Siswa">Siswa</option>
                                    </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Lahir Awal</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md p-2"
                                    value={tanggalLahirAwal || ""}
                                    onChange={(e) => setTanggalLahirAwal(e.target.value || null)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Lahir Akhir</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md p-2"
                                    value={tanggalLahirAkhir || ""}
                                    onChange={(e) => setTanggalLahirAkhir(e.target.value || null)}
                                />
                            </div>
                            <div>
                                <button
                                    onClick={handleResetFilters}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabel Users */}
                <div className="border rounded-lg overflow-hidden min-h-[300px] bg-white">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-semibold uppercase">
                            <tr>
                                <th className="p-4 border-b">ID</th>
                                <th className="p-4 border-b">Nama</th>
                                <th className="p-4 border-b">Email</th>
                                <th className="p-4 border-b">Kelas</th>
                                <th className="p-4 border-b">Tanggal Lahir</th>
                                <th className="p-4 border-b">Role</th>
                                <th className="p-4 border-b">QR Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableSkeleton />
                            ) : (
                            currentData.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition border-b last:border-0">
                                    <td className="p-4">{user.id}</td>
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{user.kelas}</td>
                                    <td className="p-4">{user.tanggal_lahir}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full ${user.role === "Admin" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <img
                                            src={handleQRCode(user)}
                                            className="w-16 h-16 cursor-pointer hover:scale-110 transition"
                                            onClick={() => handleQRCodeClick(user)}
                                            alt="Qr Code"
                                        />
                                    </td>
                                </tr>
                            ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Navigasi Pagination */}
                <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-gray-500">
                        Halaman <b>{page}</b> dari <b>{totalPages}</b>
                    </span>

                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                            className="px-4 py-2 border rounded text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Sebelumnya
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => handlePageChange(page + 1)}
                            className="px-4 py-2 border rounded text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Berikutnya
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal QR Code */}
            {selectedQR && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={handleCloseModal}                >                    <div className="bg-white rounded-lg p-6 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
                        {/* Tombol Close */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>

                        {/* Informasi User */}
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedQR?.name}</h2>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                    <span className="font-semibold">
                                        ID: </span> {selectedQR?.id}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Email: </span> {selectedQR?.email}
                                </p>
                                <p>
                                    <span className="font-semibold">
                                        Role: </span> {selectedQR?.role}
                                </p>
                            </div> 
                        </div>

                        {/* QR Code Image */}
                        <div className="flex justify-center">
                            <img src={handleQRCode(selectedQR)} alt="QR Code" className="w-80 h-80 rounded-lg" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}