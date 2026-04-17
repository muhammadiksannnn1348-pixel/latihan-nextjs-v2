"use client";

import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

export default function RegisterPage() {
    const router = useRouter();

    // State Input
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ReCAPTCHAValue, setReCAPTCHAValue] = useState<string | null>(null);

    //State Error
    const [error, setError] = useState("");

    //Handle Submit Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //1. Validasi Required (Wajib di isi)
        if(!email || !password) {
            setError ("Email dan Password Wajib diisi!")
            return;
        }

        //2. Validasi Format Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(email)) {
            setError("Format Email tidak valid");
            return;
        }

        //3. validasi Panjang Password
        if(password.length < 6) {
            setError("Pasword minimal 6 karakter!");
            return;
        }

        //4. Validasi ReCAPTCHA
        if(!ReCAPTCHAValue) {
            setError("Silahkan verifikasi ReCAPTCHA!");
            return;
        }

        // Jika lolos
        setError("");
        alert("Login Berhasil!");
        router.push("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Masuk Akun</h1>
                    <p className="text-sm text-gray-500 mt-2">Silahkan login untuk mengakses Dashboard</p>
                </div>
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan Email Anda"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan Password Anda"
                        />
                    </div>

                    {/* Tambahkan ReCAPTCHA disini  */}
                    <div className="flex justify-center pt-2">
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            onChange={(value) => setReCAPTCHAValue(value)}
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-blue-500 text-white">
                        Masuk Sekarang
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Belum punya Akun?{" "}
                    <Link href="/Register" className="text-blue-500 hover:underline">
                        Daftar disini
                    </Link>
                </p>
            </div>
        </div>
    )
}