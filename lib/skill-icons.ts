import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiNuxt,
  SiTailwindcss,
  SiFramer,
  SiHtml5,
  SiCss,
  SiNodedotjs,
  SiPhp,
  SiMysql,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiDart,
  SiGithub,
  SiPostman,
  SiFigma,
  SiJira,
  SiVercel,
  SiNpm,
  SiScikitlearn,
  SiTensorflow,
  SiPandas,
} from "react-icons/si";
import {
  Network,
  ShieldCheck,
  Database,
  Boxes,
  Plug,
  BarChart3,
  LineChart,
  SlidersHorizontal,
  MessagesSquare,
  Sparkles,
  Coffee,
  Code,
} from "lucide-react";

/**
 * Maps a technical-skill label to a small icon. Brand/tech logos come from
 * Simple Icons (react-icons/si); skills with no real brand logo fall back to a
 * relevant lucide glyph so every item still gets an icon.
 */
const SKILL_ICONS: Record<string, IconType> = {
  // Frontend
  "React": SiReact,
  "Next.js": SiNextdotjs,
  "Vue.js": SiVuedotjs,
  "Nuxt.js": SiNuxt,
  "Tailwind CSS": SiTailwindcss,
  "Framer Motion": SiFramer,
  "HTML5": SiHtml5,
  "CSS3": SiCss,
  // Backend (brand where real, lucide glyph otherwise)
  "Node.js": SiNodedotjs,
  "REST API": Network,
  "Authentication & Middleware": ShieldCheck,
  "PHP": SiPhp,
  "SQL / MySQL": SiMysql,
  "Database Design": Database,
  "OOP": Boxes,
  "API Integration": Plug,
  // Data & AI
  "Machine Learning": SiScikitlearn,
  "Deep Learning": SiTensorflow,
  "NLP / IndoBERT": MessagesSquare,
  "Data Analysis": BarChart3,
  "Data Science": SiPandas,
  "Data Visualization": LineChart,
  "Generative AI": Sparkles,
  "Model Fine-tuning": SlidersHorizontal,
  // Programming Languages
  "JavaScript": SiJavascript,
  "TypeScript": SiTypescript,
  "Python": SiPython,
  "SQL": Database,
  "Java": Coffee,
  "C / C++": SiCplusplus,
  "Dart": SiDart,
  // Tools
  "Git / GitHub": SiGithub,
  "VS Code": Code,
  "Postman": SiPostman,
  "Figma": SiFigma,
  "Jira / Trello": SiJira,
  "Vercel / Netlify": SiVercel,
  "AWS": Boxes,
  "npm": SiNpm,
};

/** Returns the icon for a skill, or a generic code glyph if unmapped. */
export function getSkillIcon(skill: string): IconType {
  return SKILL_ICONS[skill] ?? Code;
}
