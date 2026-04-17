interface FooterProps {
    year?: number;
    companyName?: string;
    text?: string;
}

export default function Footer({
    year = new Date().getFullYear(),
    companyName = "PT Universal Big Data",
    text = "Belajar Next.js Responsive"
}: FooterProps) {
    return (
        <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* CopyRight */}
                    <div className="text-gray-400 text-sm text-center md:text-left">
                        &copy; {year} {text}
                    </div>

                    {/* Company Name */}
                    <div className="text-gray-300 text-sm font-medium text-center md:text-right">
                        {companyName}
                    </div>
                </div>

                {/* Additional Links (optional) */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-center gap-6 text-xs text-gray-400">
                        <a href="#" className="hover:text-gray-200 transition">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-200 transition">Terms of Servise</a>
                        <a href="#" className="hover:text-gray-200 transition">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}