import { motion } from "framer-motion";
import { useScrollReveal } from "./useScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { 
    q: "What services does TechNest provide?", 
    a: "We offer a comprehensive suite of digital solutions including Full Stack Development, Mobile App Development, E-commerce Solutions, Digital Marketing, and Managed IT Services tailored to your business needs." 
  },
  { 
    q: "How do you ensure the quality and security of your projects?", 
    a: "We follow industry best practices, including rigorous QA testing, OWASP security guidelines, and regular code reviews. We are also an ISO 27001 certified firm, ensuring your data and intellectual property are always protected." 
  },
  { 
    q: "What is your typical project development process?", 
    a: "Our process involves Discovery & Strategy, UI/UX Design, Agile Development, Comprehensive Testing, and Deployment. We maintain transparent communication throughout the entire lifecycle to ensure your vision is realized." 
  },
  { 
    q: "Do you provide post-launch support and maintenance?", 
    a: "Yes, we offer dedicated post-launch support and maintenance packages. This includes regular security updates, performance monitoring, bug fixes, and feature enhancements to keep your product scalable and up-to-date." 
  },
  { 
    q: "How much does a typical project cost?", 
    a: "Project costs vary depending on the scope, complexity, and technology stack required. We offer flexible engagement models including fixed-price for well-defined projects and dedicated team hiring for ongoing development. Contact us for a free custom quote." 
  },
  { 
    q: "Can you integrate with our existing legacy systems?", 
    a: "Absolutely. Our expert engineers specialize in modernizing legacy applications and building custom APIs to seamlessly integrate new digital products with your existing CRM, ERP, or internal databases without disrupting operations." 
  }
];

const FAQSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100" ref={ref}>
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-display">Frequently Asked Questions</h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-slate-600">Find answers to common questions about our services and process.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white border border-slate-200 rounded-lg px-4 shadow-sm hover:shadow-md transition-shadow">
                <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline hover:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
