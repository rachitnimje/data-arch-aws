"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What makes DataArch different from other data solution providers?",
    answer:
      "DataArch combines deep technical expertise with business acumen to deliver solutions that not only solve technical challenges but also drive measurable business outcomes. Our team of certified data architects and engineers have experience across industries, ensuring you get best practices tailored to your specific needs.",
  },
  {
    question: "How long does a typical data transformation project take?",
    answer:
      "Project timelines vary based on complexity, scope, and your organization's readiness. A typical cloud migration might take 3-6 months, while implementing a comprehensive data lake solution could take 6-9 months. During our discovery phase, we'll provide a detailed timeline specific to your project with clear milestones and deliverables.",
  },
  {
    question: "Do you work with businesses of all sizes?",
    answer:
      "Yes, we serve organizations from fast-growing startups to large enterprises. Our solutions are scalable and can be tailored to meet the specific needs and budgets of businesses at any stage of growth. We have specialized packages for small businesses looking to establish their data foundation, as well as comprehensive solutions for enterprises with complex data ecosystems.",
  },
  {
    question: "How do you ensure data security during migration and transformation?",
    answer:
      "Security is built into every aspect of our process. We implement industry-leading encryption, access controls, and compliance measures throughout the data lifecycle. Our team follows strict security protocols and best practices, and we work closely with your security team to ensure all requirements are met. We're also compliant with major regulations including GDPR, HIPAA, and CCPA.",
  },
  {
    question: "Can you integrate with our existing systems and tools?",
    answer:
      "Absolutely. We design our solutions to integrate seamlessly with your existing technology stack. Whether you're using legacy systems, modern SaaS applications, or a hybrid environment, we ensure smooth data flow and interoperability. Our team has experience with a wide range of technologies and platforms, allowing us to create cohesive solutions that leverage your current investments.",
  },
]

export function FAQSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get answers to common questions about our data solutions and services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto card-gradient p-6 rounded-lg"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200/70">
                <AccordionTrigger className="text-left text-base font-medium text-gray-800 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
