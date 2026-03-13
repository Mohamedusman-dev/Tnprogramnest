import { motion } from "framer-motion";
import { useScrollReveal } from "./useScrollReveal";

const categories = [
  {
    title: "Frontend",
    techs: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Tailwind CSS", "Angular"],
  },
  {
    title: "Backend",
    techs: ["Node.js", "Express.js", "Python", "Django", "PHP", "Laravel", "Java", "Go"],
  },
  {
    title: "Mobile",
    techs: ["React Native", "Flutter", "Swift", "Kotlin", "Ionic"],
  },
  {
    title: "Database & Cloud",
    techs: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "AWS", "Google Cloud", "Docker", "Kubernetes"],
  },
  {
    title: "DevOps & Tools",
    techs: ["Git", "CI/CD", "Jenkins", "Terraform", "Figma", "Jira"],
  },
];

const TechnologySection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="technology" className="section-padding bg-white" ref={ref}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Tech Stack</p>
          <h2 className="section-title text-slate-900">Tools, Frameworks & Platforms We Specialize In</h2>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mt-4">We leverage the latest technologies to build robust, scalable solutions.</p>
        </div>

        <div className="space-y-8">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: ci * 0.1, duration: 0.5 }}
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-primary">{cat.title}</h3>
              <div className="flex flex-wrap gap-3">
                {cat.techs.map((t) => (
                  <span
                    key={t}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-default shadow-sm"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
