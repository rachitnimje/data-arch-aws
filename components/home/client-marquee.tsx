"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const clientLogos = [
  {
    name: "Client 1",
    logo: "https://www.mothersontechnology.com/wp-content/uploads/2025/03/siemens-logo.png",
  },
  {
    name: "Client 2",
    logo: "https://1000logos.net/wp-content/uploads/2016/10/Barclays-Logo.jpg",
  },
  {
    name: "Client 3",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTSde0eYgejkWCAwgN8tzVIUaHr1K2vR2RzQ&s",
  },
  {
    name: "Client 4",
    logo: "https://storage.googleapis.com/accesswire/logos/subaccounts/34398.png?v=1",
  },
  {
    name: "Client 5",
    logo: "https://1000logos.net/wp-content/uploads/2023/03/Tech-Data-logo.png",
  },
  {
    name: "Client 6",
    logo: "https://cdn.prod.website-files.com/63a9fb94e473f36dbe99c1b1/67869eb0cd938cd9961d9ef7_651bc8a82584d575aa063f42_3DcMFa1QseMNc6NUeX0l.jpeg",
  },
  {
    name: "Client 7",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Tata_Consultancy_Services_old_logo.svg/2560px-Tata_Consultancy_Services_old_logo.svg.png",
  },
  {
    name: "Client 8",
    logo: "https://www.cdnlogo.com/logos/c/78/capgemini-201x.svg",
  },
];

// Duplicate the array to create a seamless loop
const duplicatedLogos = [...clientLogos, ...clientLogos];

export function ClientMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marqueeAnimation = () => {
      if (!marqueeRef.current) return;

      const marqueeElement = marqueeRef.current;
      let scrollAmount = 0;
      const speed = 0.5; // Adjust for faster/slower scrolling

      const scroll = () => {
        if (!marqueeElement) return;

        scrollAmount += speed;

        // Reset when we've scrolled through half the items (to create infinite loop)
        if (scrollAmount >= marqueeElement.scrollWidth / 2) {
          scrollAmount = 0;
        }

        marqueeElement.style.transform = `translateX(-${scrollAmount}px)`;
        requestAnimationFrame(scroll);
      };

      const animationId = requestAnimationFrame(scroll);

      return () => cancelAnimationFrame(animationId);
    };

    const animation = marqueeAnimation();
    return () => {
      if (animation) animation();
    };
  }, []);

  return (
    <section className="py-16 overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 mb-8">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          Trusted by <span className="gradient-text">Industry Leaders</span>
        </motion.h2>
      </div>

      <div className="relative w-full overflow-hidden">
        <div
          ref={marqueeRef}
          className="flex items-center space-x-12 py-6 whitespace-nowrap"
        >
          {duplicatedLogos.map((client, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-8 py-4 bg-white/80 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={client.logo || "/placeholder.svg"}
                alt={client.name}
                width={120}
                height={60}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>

        {/* Gradient fade effect on the sides */}
        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
      </div>
    </section>
  );
}
