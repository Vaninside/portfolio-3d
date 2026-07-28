import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Organization from "@/components/Organization";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollReveal><About /></ScrollReveal>
      <ScrollReveal><Experience /></ScrollReveal>
      <ScrollReveal><Organization /></ScrollReveal>
      <ScrollReveal><Projects /></ScrollReveal>
      <ScrollReveal><Skills /></ScrollReveal>
      <ScrollReveal><Education /></ScrollReveal>
      <ScrollReveal><Contact /></ScrollReveal>
    </main>
  );
}