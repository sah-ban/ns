"use client";

import { useState } from "react";
import { Network, DataSet } from "vis-network/standalone";

interface NodeType {
  id: string;
  label: string;
}

interface LinkType {
  from: string;
  to: string;
}

export default function EnsSocialGraph() {
  const [input, setInput] = useState(`{vitalik.eth, balajis.eth}
{sassal.eth, cdixon.eth, punk6529.eth}
{jessepollak.eth, balajis.eth}
{cdixon.eth, vitalik.eth}
{balajis.eth, punk6529.eth}`);

  const buildGraph = () => {
    const lines = input
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const nodesMap = new Map<string, NodeType>();
    const edges: LinkType[] = [];

    for (const line of lines) {
      const matches = line.match(/{([^}]+)}/);
      if (!matches) continue;

      const names = matches[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (names.length < 2) continue;

      for (const name of names) {
        if (!nodesMap.has(name)) {
          nodesMap.set(name, { id: name, label: name.split(".")[0] });
        }
      }

      for (let i = 0; i < names.length; i++) {
        for (let j = i + 1; j < names.length; j++) {
          edges.push({ from: names[i], to: names[j] });
        }
      }
    }

    const nodes = new DataSet(Array.from(nodesMap.values()));
    const edgesDS = new DataSet(edges);

    const container = document.getElementById("network");
    if (container) {
      const data = { nodes, edges: edgesDS };
      const options = {
        nodes: {
          shape: "circle",
          size: 20,
          color: "#8b5cf6",
          font: { color: "#fff", size: 14 },
        },
        edges: {
          color: { color: "#8b5cf6", opacity: 0.5 },
          width: 2,
          smooth: {
            enabled: true,
            type: "dynamic",
            roundness: 0.5,
          },
        },
        physics: {
          enabled: true,
          stabilization: false,
          barnesHut: { springLength: 200 },
        },
        interaction: { hover: true },
      };
      const net = new Network(container, data, options);

      net.on("click", (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          window.open(`/?name=${encodeURIComponent(nodeId)}`, "_blank");
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:to-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            ENS Social Graph
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Paste groups of connected people in curly braces. Click any node to
            view profile.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <textarea
              className="w-full h-96 p-6 font-mono text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-inner focus:ring-4 focus:ring-purple-400 outline-none resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={buildGraph}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg transition transform hover:scale-105"
            >
              Build Graph
            </button>
          </div>

          <div
            id="network"
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
            style={{ height: "600px" }}
          />
        </div>
      </div>
    </div>
  );
}
