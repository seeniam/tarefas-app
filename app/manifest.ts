import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tarefas App",
    short_name: "Tarefas",
    description: "Aplicacao de organizacao pessoal com sincronizacao via Google Sheets.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: []
  };
}
