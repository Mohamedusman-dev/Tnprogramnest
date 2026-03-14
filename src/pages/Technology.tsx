import { useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ScrollToTop = lazy(() => import("@/components/ScrollToTop"));

const techCategories = [
  {
    title: "Frontend Web",
    highlight: "Technologies",
    items: [
      { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "Angular", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
      { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "HTML5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "Vue.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
      { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "CSS3", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" }
    ]
  },
  {
    title: "Backend",
    highlight: "Technologies",
    items: [
      { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
      { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "Django", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
      { name: "PHP", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
      { name: "Laravel", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg" },
      { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "Go", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" }
    ]
  },
  {
    title: "Mobile",
    highlight: "Development",
    items: [
      { name: "React Native", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Flutter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
      { name: "Swift", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
      { name: "Kotlin", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
      { name: "Ionic", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ionic/ionic-original.svg" }
    ]
  },
  {
    title: "Database &",
    highlight: "Cloud",
    items: [
      { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "Redis", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
      { name: "AWS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
      { name: "Google Cloud", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
      { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "Kubernetes", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" }
    ]
  },
  {
    title: "DevOps &",
    highlight: "Tools",
    items: [
      { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "CI/CD", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg" },
      { name: "Jenkins", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
      { name: "Terraform", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg" },
      { name: "Figma", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
      { name: "Jira", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" }
    ]
  }
];

const Technology = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(220,25%,6%)] text-white overflow-x-hidden font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 relative pt-32 pb-24">
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: 'linear-gradient(hsl(200,80%,50%) 1px, transparent 1px), linear-gradient(90deg, hsl(200,80%,50%) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.07
        }}></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none z-0" style={{ background: 'hsl(210,100%,50%)', opacity: 0.04, filter: 'blur(120px)' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none z-0" style={{ background: 'hsl(280,70%,55%)', opacity: 0.04, filter: 'blur(120px)' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full pointer-events-none z-0" style={{ background: 'hsl(170,80%,40%)', opacity: 0.03, filter: 'blur(100px)' }}></div>

        <div className="container mx-auto relative z-10 px-4 max-w-[1100px]">
          {/* Title Section */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="text-[hsl(200,100%,55%)] text-sm font-semibold tracking-[0.2em] uppercase mb-4 block">
              Tech Stack
            </span>
            <h1 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold text-white mb-4 leading-[1.2]">
              Tools, Frameworks & Platforms We Specialize In
            </h1>
            <p className="text-white/50 text-[clamp(0.95rem,2vw,1.1rem)] max-w-[600px] mx-auto">
              We leverage the latest technologies to build robust, scalable solutions.
            </p>
          </motion.div>

          {/* Categories */}
          <div>
            {techCategories.map((cat, catIdx) => (
              <div key={cat.title} className="mb-12">
                <motion.h2 
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5 }}
                  className="font-display text-[clamp(1.1rem,2.5vw,1.5rem)] font-semibold text-center mb-8"
                >
                  <span>{cat.title} </span>
                  <span className="text-[hsl(200,100%,55%)]">{cat.highlight}</span>
                </motion.h2>
                
                <div className="flex flex-wrap justify-center gap-4 md:gap-5">
                  {cat.items.map((item, i) => {
                    const floatIndex = (catIdx * 10 + i) % 5;
                    const delay = i * 0.06;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, scale: 0.5, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ duration: 0.5, delay: delay }}
                        className="w-16 h-20 md:w-20 md:h-24 bg-white/95 backdrop-blur-md rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.2)] relative group transition-all duration-300 hover:!scale-110 hover:shadow-[0_0_30px_hsla(200,100%,50%,0.25)]"
                      >
                        <div className="absolute inset-0 rounded-xl bg-[hsl(200,100%,50%)] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className={`flex flex-col items-center gap-1 float-${floatIndex}`}>
                          <img src={item.logo} alt={item.name} className="w-7 h-7 md:w-9 md:h-9 object-contain transition-transform duration-300 group-hover:scale-110 relative z-10" loading="lazy" />
                          <span className="text-[10px] md:text-xs font-medium text-slate-800 whitespace-nowrap leading-none relative z-10">{item.name}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </div>
  );
};

export default Technology;
