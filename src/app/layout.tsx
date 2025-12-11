import "./globals.css";

export const metadata = {
  title: "ens-lookup",
  description: "A simple ENS lookup tool built with Next.js 13 and Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <main className="min-h-screen container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
