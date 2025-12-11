"use client";

import { useState, useEffect } from "react";

interface EnsData {
  name: string;
  address?: string;
  avatar?: string;
  avatar_url?: string;
  header_url?: string;
  description?: string;
  records?: Record<string, string>;
  resolver?: string;
  registrant?: string;
  expiry_date?: string;
  is_primary_name?: boolean;
  [key: string]: unknown;
}

function getQueryParam(param: string): string | null {
  if (typeof window === "undefined") return null;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export default function EnsLookup() {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<EnsData | null>(null);
  const [error, setError] = useState<string>("");

  // Prefill input from query param
  useEffect(() => {
    const name = getQueryParam("name");
    if (name) {
      setInput(name);
    }
  }, []);

  const search = async (): Promise<void> => {
    if (!input) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/ens?name=${encodeURIComponent(input)}`);
      const json = (await res.json()) as {
        success?: boolean;
        data?: EnsData;
        error?: string;
      };

      if (!res.ok || !json.success) {
        setError(json.error ?? "ENS not found");
      } else {
        setData(json.data ?? null);
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      search();
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">ENS Lookup</h1>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-900"
          placeholder="vitalik.eth or 0x1234..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={search}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all"
        >
          GO
        </button>
      </div>

      {loading && <p className="text-center">Loading…</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* ENS DATA CARD */}
      {data && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-md space-y-6 bg-white dark:bg-gray-900">
          {/* Header Section */}
          <div className="flex items-center gap-4">
            {data.avatar_url && (
              <img
                src={data.avatar_url as string}
                alt="ENS avatar"
                className="w-20 h-20 rounded-xl border object-cover"
              />
            )}

            <div>
              <h2 className="text-xl font-semibold">
                {typeof data.ens === "string"
                  ? data.ens
                  : data.name ?? "No ENS name"}
              </h2>
              {data.address && (
                <p className="text-gray-600 dark:text-gray-400 text-sm break-all">
                  {data.address}
                </p>
              )}
              {"ens_primary" in data && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Primary: {String(data.ens_primary)}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-300 dark:border-gray-700" />

          {/* Data Sections */}
          <div className="space-y-4">
            {Object.entries(data).map(([key, value]) => {
              if (
                key === "avatar_url" ||
                key === "avatar" ||
                key === "ens" ||
                key === "address"
              ) {
                return null;
              }

              return (
                <div
                  key={key}
                  className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800"
                >
                  <p className="font-semibold mb-2 capitalize">{key}</p>
                  <pre className="text-sm whitespace-pre-wrap break-all bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
