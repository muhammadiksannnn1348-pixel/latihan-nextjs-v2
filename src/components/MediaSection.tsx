import Image from "next/image"

export default function MediaSection() {
    return (
        <section className="mt-8 pace-y-8">
            {/* judul Section */}
            <h3 className="text-2xl font-bold">Galeri Media Responsive</h3>

            {/*Single Image dengan Next/image */}
            <div className="space-y-4">
                <h4 className="text-2xl font-semibold">Gambar Optimasi Otomatis</h4>
                <Image
                    src="/image.png"
                    alt="Gambar Optimasi Otomatis"
                    width={800}
                    height={500}
                    className="w-full h-auto rounded-lg shadow-xl"
                />
                <p className="text-gray-600 text-sm">
                    Gambar ini Otomatisdi lazi load, dikonversi jadi Webp, dan ukurannya disesuaikan
                </p>
            </div>

            {/* Grid 2 : Gambar bertumpuk di mobile, bersampingan di desktop */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Galeri Responsive</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Image
                        src="/image.png"
                        alt="Gambar Pertama"
                        width={800}
                        height={500}
                        className="w-full h-auto rounded-lg shadow-xl"
                    />
                    <Image
                        src="/image3.png"
                        alt="Gambar Kedua"
                        width={800}
                        height={500}
                        className="w-full h-auto rounded-lg shadow-xl"
                    />
                </div>
            </div>

            {/* Video Responsive Youtube  */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Videp Responsive Youtube</h4>
                <div className="aspect-video w-full">
                    <iframe 
                        src="https://www.youtube.com/embed/szht9RG3VoY" 
                        className="w-full h-full rounded-lg shadow-xl"
                        allowFullScreen
                        ></iframe>
                </div>
                <p className="text-gray-600 text-sm">Video Selalu menjaga rasio 16:9 dan Responsive disemua ukuran layar</p>
            </div>

            {/* Video Lokal Opsional  */}
            <div className="space-y-4">
                <h4 className="text-xl font-semibold">Video Responsive Youtube</h4>
                <div className="aspect-video w-full">
                    <iframe 
                        src="https://www.youtube.com/embed/TXFLa-xMPjk"
                        className="w-full h-full rounded-lg shadow-xl"
                        allowFullScreen
                    >
                    </iframe>
                </div>
                <p className="text-gray-600 text-sm">Video Selalu menjaga rasio 16:9 dan Responsive disemua ukuran layar</p>
            </div>
        </section>
    )
}