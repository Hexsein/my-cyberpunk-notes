import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 * Customized for Dark Cyberpunk / Hack The Box Style
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Cyberpunk Notes",
    provider: "github",
    baseUrl: "hexsein.github.io/my-cyberpunk-notes",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#0f172a",
          lightgray: "#1e293b",
          gray: "#64748b",
          darkgray: "#cbd5e1",
          dark: "#f8fafc",
          secondary: "#10b981",
          tertiary: "#059669",
          highlight: "rgba(16, 185, 129, 0.15)",
        },
        darkMode: {
          light: "#0b0f19",
          lightgray: "#151d2a",
          gray: "#475569",
          darkgray: "#e2e8f0",
          dark: "#ffffff",
          secondary: "#22c55e",
          tertiary: "#16a34a",
          highlight: "rgba(34, 197, 94, 0.15)",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "relative" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config