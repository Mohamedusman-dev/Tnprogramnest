import { motion } from "framer-motion";

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

const TechnologySection = () => {
  return (
    <section className="relative w-full overflow-hidden pb-24">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.07]" 
        style={{ 
          backgroundImage: 'linear-gradient(hsl(200,80%,50%) 1px, transparent 1px), linear-gradient(90deg, hsl(200,80%,50%) 1px, transparent 1px)', 
          backgroundSize: '60px 60px' 
        }}
      ></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#0088ff] rounded-full opacity-[0.04] blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#a633ff] rounded-full opacity-[0.04] blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#14cc99] rounded-full opacity-[0.03] blur-[100px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="text-[#00aaff] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
            Tech Stack
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 font-display leading-tight max-w-3xl mx-auto">
            Tools, Frameworks & Platforms We Specialize In
          </h1>
          <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto">
            We leverage the latest technologies to build robust, scalable solutions.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-16 md:space-y-20 max-w-5xl mx-auto">
          {techCategories.map((cat, catIdx) => (
            <motion.div 
              key={catIdx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-center mb-8 md:mb-10 text-white font-display">
                {cat.title} <span className="text-[#00aaff]">{cat.highlight}</span>
              </h2>
              
              <div className="flex flex-wrap justify-center gap-4 md:gap-5">
                {cat.items.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="w-[64px] h-[80px] md:w-[80px] md:h-[96px] bg-white/95 backdrop-blur-md rounded-xl flex flex-col items-center justify-center cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(0,170,255,0.25)] transition-all duration-300 group hover:scale-110 relative overflow-hidden"
                  >
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#00aaff] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    
                    {/* Floating Content */}
                    <div className={`float-${(catIdx * 10 + i) % 5} flex flex-col items-center gap-1.5 relative z-10 w-full`}>
                      <img 
                        src={item.logo} 
                        alt={item.name} 
                        loading="lazy"
                        width="36"
                        height="36"
                        decoding="async"
                        className="w-7 h-7 md:w-9 md:h-9 object-contain group-hover:scale-110 transition-transform duration-300" 
                      />
                      <span className="text-[10px] md:text-[11px] font-semibold text-slate-800 whitespace-nowrap px-1 text-center leading-none">
                        {item.name}
                      </span>
                    </div>
                  </motion.div>
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
