// app/graph/page.tsx
import Link from "next/link";
import EnsSocialGraph from "@/components/EnsSocialGraph"; // or inline

export default function GraphPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:to-black">
      {/* Same Nav */}
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ENS Tools
          </h1>
          <div className="space-x-6">
            <Link
              href="/"
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Profile Lookup
            </Link>
            <Link
              href="/graph"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Social Graph
            </Link>
          </div>
        </div>
      </nav>

      <EnsSocialGraph />
    </div>
  );
}