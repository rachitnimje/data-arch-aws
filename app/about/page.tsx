"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { Users, Target, TrendingUp } from "lucide-react";

const heroData = {
  title: "About <span class='gradient-text'>DataArch</span>",
  description: [
    "DataArch Consultancy LLP has been at the forefront of data transformation, helping organizations generate measurable value from their data while maintaining a low expense ratio. Based in Pune, India, we specialize in combining cloud technologies, data engineering, and analytics to enable scalable, efficient, and impactful digital transformation.",
    "Our team of seasoned data architects, engineers, and scientists leverages cutting-edge tools—including AWS, Microsoft Azure, and Google Cloud Platform (GCP)—to deliver elegant, modular, and secure solutions tailored to each client's unique needs. Whether it's building robust data pipelines, managing Data Lakes, or delivering insightful machine learning and analytics, we empower companies to transform the way they work.",
  ],
  image: "/placeholder.svg?height=400&width=500",
};

const teamMembers = [
  {
    name: "Team Member 1",
    role: "CEO & Founder",
    image: "/placeholder.svg?height=300&width=300",
    bio: "With over 15 years of experience in data architecture and cloud solutions, Alex founded DataArch to help businesses unlock the full potential of their data assets.",
  },
  {
    name: "Team Member 2",
    role: "CTO",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Samantha leads our technical team with her expertise in AI and machine learning, ensuring our solutions leverage cutting-edge technologies.",
  },
  {
    name: "Team Member 3",
    role: "Head of Data Science",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Michael brings deep expertise in data analytics and predictive modeling, helping our clients turn raw data into actionable insights.",
  },
  {
    name: "Team Member 4",
    role: "Senior Developer",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Emily ensures our clients achieve their business objectives through strategic data initiatives and continuous improvement.",
  },
];

const values = [
  {
    title: "Collaboration",
    description:
      "We work closely with our clients, becoming an extension of their team to achieve shared goals.",
    icon: <Users className="h-8 w-8 text-purple-DEFAULT" />,
  },
  {
    title: "Results-Driven",
    description:
      "We focus on delivering measurable business outcomes, not just technical implementations.",
    icon: <Target className="h-8 w-8 text-blue-DEFAULT" />,
  },
  {
    title: "Adaptability",
    description:
      "We embrace change and continuously evolve our approaches to meet emerging challenges.",
    icon: <TrendingUp className="h-8 w-8 text-purple-DEFAULT" />,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                className="text-4xl md:text-5xl font-bold mb-6"
                dangerouslySetInnerHTML={{ __html: heroData.title }}
              ></h1>
              {heroData.description.map((paragraph, index) => (
                <p key={index} className="text-lg text-gray-700 mb-6">
                  {paragraph}
                </p>
              ))}
            </motion.div>
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-light/20 rounded-full"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-light/20 rounded-full"></div>
                <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={heroData.image}
                    alt="DataArch Team"
                    width={500}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white/80">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from how we develop
              solutions to how we interact with our clients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="card-gradient p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="bg-white p-3 rounded-full shadow-md mr-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                </div>
                <p className="text-gray-700">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our diverse team of experts brings together decades of experience
              in data architecture, cloud computing, and analytics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="card-gradient rounded-lg overflow-hidden shadow-lg group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-purple-DEFAULT font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-700 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
