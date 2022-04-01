import { useState, useEffect, useReducer } from "react";
import { urbitVisor } from "@dcspark/uv-core";
import type { Graph, Post, Content, TextContent } from "./types";

interface NotebookProps {
  ship: string;
}

export default function Notebook({ ship }: NotebookProps) {
  const [posts, setPosts] = useState<Graph>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      const res = await urbitVisor.scry({
        app: "graph-store",
        path: `/graph/${ship}/my-urbit-notes`,
      });

      setPosts(res["graph-update"]["add-graph"]["graph"]);
      setLoading(false);
    }

    fetchPosts();
  }, []);

  return (
    <div>
      <div>My Urbit Notes</div>
    </div>
  );
}
