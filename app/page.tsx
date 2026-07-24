import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Organization from "@/components/Organization";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Organization />
      <Projects />
      <Skills />
      <Education />
      <Contact />
    </main>
  );
}