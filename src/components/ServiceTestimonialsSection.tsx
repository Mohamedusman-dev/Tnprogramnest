import { useState, useEffect } from "react";
import { useScrollReveal } from "./useScrollReveal";
import { useSiteData } from "@/context/SiteDataContext";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  type CarouselApi 
} from "@/components/ui/carousel";

const ServiceTestimonialsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { siteData } = useSiteData();
  
  // Fetch reviews from global state (Supabase) instead of hardcoded array
  const clutchReviews = siteData.clutchReviews || [];

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Initialize dots pagination
  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, clutchReviews.length]);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      if (!isHovered) {
        api.scrollNext();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [api, isHovered]);

  if (clutchReviews.length === 0) return null;

  return (
    <section 
      className="py-10 md:py-16 bg-[#f9f9f9]" 
      ref={ref}
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Import Roboto font specifically for this section as requested */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');`}
      </style>

      <div className="container mx-auto px-4 max-w-[1200px]">
        
        <h2 className="text-center text-[28px] md:text-[32px] font-bold text-black mb-2.5">
          Clutch Reviews
        </h2>
        <p className="text-center text-[16px] text-[#555] mb-[30px]">
          Verified client feedback and ratings on Clutch
        </p>

        <div className="bg-[#fafafa] rounded-[4px] p-5 relative">
          
          {/* Widget Header */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-[15px]">
            <div className="flex items-center gap-[10px] text-[16px] md:text-[18px] text-[#333] flex-wrap">
              <span className="font-medium">TechNest Reviews</span>
              <span className="font-bold">5.0</span>
              <div className="text-[#ff401e] text-[14px] tracking-[1px] flex gap-0.5">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <a href="#" className="text-[#007bff] text-[14px] no-underline ml-1 hover:underline">
                {clutchReviews.length} reviews
              </a>
            </div>
            <div className="text-[12px] text-[#333] flex items-center gap-[5px]">
              <span>Powered by</span>
              <span className="font-bold text-[16px]">Clutch</span>
            </div>
          </div>

          {/* Carousel Area */}
          <div 
            className="relative flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Custom Prev Button */}
            <button 
              onClick={() => api?.scrollPrev()} 
              className="hidden md:block bg-transparent border-none text-[24px] text-[#333] hover:text-black cursor-pointer px-[15px] z-10"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            
            <div className="overflow-hidden w-full py-2.5 pb-[30px]">
              <Carousel
                opts={{ align: "start", loop: true }}
                setApi={setApi}
                className="w-full"
              >
                <CarouselContent className="-ml-5">
                  {clutchReviews.map((review, index) => {
                    const ratingValue = parseFloat(review.rating) || 5;
                    return (
                      <CarouselItem key={review.id || index} className="pl-5 basis-full md:basis-1/2 lg:basis-1/4">
                        {/* Review Card */}
                        <div className="bg-white rounded-[5px] p-[25px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col justify-between h-full min-h-[260px]">
                          
                          <div>
                            <div className="flex items-center gap-2 mb-[15px]">
                              <span className="font-bold text-[#333]">{review.rating}</span>
                              <div className="text-[#ff401e] text-[12px] flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className={`fa-solid fa-star ${i >= ratingValue ? 'opacity-30' : ''}`}></i>
                                ))}
                              </div>
                            </div>
                            <p className="text-[14px] text-[#4a4a4a] leading-[1.5] mb-[20px] italic">
                              "{review.text}"
                            </p>
                          </div>

                          <div>
                            <div className="text-[12px] text-[#666] mb-[15px] leading-[1.4]">
                              <strong>{review.author}</strong><br />
                              {review.company}
                            </div>
                            <div className="flex items-center gap-[5px] text-[12px] text-[#666]">
                              <i className="fa-regular fa-circle-check text-[#2db77b] text-[14px]"></i> Verified Review
                            </div>
                          </div>

                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Custom Next Button */}
            <button 
              onClick={() => api?.scrollNext()} 
              className="hidden md:block bg-transparent border-none text-[24px] text-[#333] hover:text-black cursor-pointer px-[15px] z-10"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {/* Dots Pagination */}
          <div className="flex justify-center gap-[8px] mt-2.5">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`w-[10px] h-[10px] rounded-full transition-colors duration-300 ${
                  i === current ? "bg-[#333]" : "bg-[#ddd]"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServiceTestimonialsSection;
