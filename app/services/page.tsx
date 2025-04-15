// import type { Metadata } from "next";
// import {
//   Database,
//   Cloud,
//   BarChart3,
//   LineChart,
//   Network,
//   Layers,
//   Search,
//   ClipboardList,
//   Settings,
//   Zap,
// } from "lucide-react";
// import { PageLayout } from "@/components/page-layout";

// export const metadata: Metadata = {
//   title: "Services | DataArch",
//   description:
//     "Comprehensive data architecture and analytics services for modern businesses",
// };

// const services = [
//   {
//     title: "DATA LAKE IMPLEMENTATION",
//     description:
//       "Using Big Data technologies, DataArch assists firms by setting up a Data Lake which holds structured and unstructured data securely. With our unique automation techniques, the process is accomplished at a faster pace.",
//     icon: <Cloud className="h-12 w-12 text-blue-500" />,
//     color: "from-blue-50 to-blue-100",
//   },
//   {
//     title: "CLOUD OPTIMIZATION",
//     description:
//       "DataArch enables the selection and assignment of the right resources to critical workloads and applications on the cloud. Optimal cloud operations bring better productivity and free up capital for core functions.",
//     icon: <Database className="h-12 w-12 text-purple-500" />,
//     color: "from-purple-50 to-purple-100",
//   },
//   {
//     title: "DATA PIPELINES",
//     description:
//       "Develop robust data pipelines that automate the flow of data between systems. We design efficient ETL processes that ensure data reliability and consistency.",
//     icon: <Layers className="h-12 w-12 text-green-500" />,
//     color: "from-green-50 to-green-100",
//   },
//   {
//     title: "DATA PLATFORM MODERNIZATION",
//     description:
//       "In order to be data-driven, DataArch helps enterprises consolidate siloed data sources by leveraging partners and accelerators for modernization on the cloud.",
//     icon: <BarChart3 className="h-12 w-12 text-orange-500" />,
//     color: "from-orange-50 to-orange-100",
//   },
//   {
//     title: "DATA MANAGEMENT",
//     description:
//       "DataArch ensures that enterprise data confirm to best practices in order to meet their business objective backed by enhanced data quality and compliance adherence.",
//     icon: <LineChart className="h-12 w-12 text-red-500" />,
//     color: "from-red-50 to-red-100",
//   },
//   {
//     title: "DATA INTEGRATION",
//     description:
//       "Connect disparate systems and applications to create a unified data ecosystem. Our integration services ensure seamless data flow between all your business platforms.",
//     icon: <Network className="h-12 w-12 text-indigo-500" />,
//     color: "from-indigo-50 to-indigo-100",
//   },
// ];

// const processSteps = [
//   {
//     title: "Discovery",
//     description:
//       "At DataArch, we begin by understanding your current data infrastructure and business goals. We identify opportunities and challenges in your digital journey by assessing where advanced technologies can create maximum impact.",
//     icon: <Search className="h-10 w-10 text-blue-DEFAULT" />,
//   },
//   {
//     title: "Strategy",
//     description:
//       "We craft a tailored strategy that includes cloud transformation, data lake setup, and big data integration—ensuring alignment with your business objectives. Our roadmap guides you from strategic planning through to seamless migration and managed operations.",
//     icon: <ClipboardList className="h-10 w-10 text-purple-DEFAULT" />,
//   },
//   {
//     title: "Implementation",
//     description:
//       "Our team uses an iterative, test-and-learn approach to deploy modular solutions with minimal disruption. We build secure data pipelines—handling structured, unstructured, streaming, or big data—to help you transform how your organization operates.",
//     icon: <Settings className="h-10 w-10 text-blue-DEFAULT" />,
//   },
//   {
//     title: "Optimization",
//     description:
//       "We don't stop at deployment. Our unique automation techniques continuously enhance performance, responsiveness, and efficiency—empowering your teams to focus on high-value activities while ensuring your systems are secure and future-ready.",
//     icon: <Zap className="h-10 w-10 text-purple-DEFAULT" />,
//   },
// ];

// const expertiseFeatures = [
//   {
//     title: "Industry Expertise",
//     description:
//       "At DataArch, we bring deep cross-industry experience to the table—spanning finance, healthcare, retail, and manufacturing. We understand the unique data complexities in each sector and apply our knowledge to deliver impactful, industry-specific solutions.",
//     color: "from-blue-50 to-blue-100",
//   },
//   {
//     title: "Cutting-Edge Technology",
//     description:
//       "We leverage the latest in Big Data, cloud computing, and automation. From building secure Data Lakes to streaming unstructured and structured data, our technology stack is constantly evolving to ensure your architecture is scalable, secure, and future-ready.",
//     color: "from-purple-50 to-purple-100",
//   },
//   {
//     title: "Tailored Solutions",
//     description:
//       "We know that no two businesses are alike. That's why we customize every engagement—from cloud transformation strategies to data pipeline setups—ensuring alignment with your goals and seamless integration into your operations.",
//     color: "from-green-50 to-green-100",
//   },
//   {
//     title: "Measurable Results",
//     description:
//       "We're committed to outcomes. Our approach enables faster delivery, improved responsiveness, and automation that shifts your resources to value-generating tasks. With clear metrics and performance KPIs, we ensure every transformation initiative drives real business value.",
//     color: "from-orange-50 to-orange-100",
//   },
// ];

// export default function ServicesPage() {
//   return (
//     <PageLayout>
//       {/* Hero Section */}
//       <section className="relative overflow-hidden pt-32 pb-10 md:pt-40 md:pb-14">
//         <div className="container relative z-10 mx-auto px-4">
//           <div className="max-w-3xl mx-auto text-center">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
//               Data Solutions for{" "}
//               <span className="gradient-text">Modern Businesses</span>
//             </h1>
//             <p className="text-lg md:text-xl text-gray-700 mb-8 opacity-0 animate-fade-up animation-delay-200">
//               We help organizations harness the power of their data through
//               innovative architecture, analytics, and integration services
//               tailored to your specific needs.
//             </p>
//           </div>
//         </div>

//         {/* Abstract shapes */}
//         <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-100 rounded-full opacity-20 animate-float"></div>
//         <div className="absolute top-32 -right-16 w-80 h-80 bg-purple-100 rounded-full opacity-20 animate-float animation-delay-2000"></div>
//       </section>

//       {/* Services Grid */}
//       <section className="py-16 md:py-20 bg-white">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 opacity-0 animate-fade-up">
//             Our <span className="gradient-text">Services</span>
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
//             {services.map((service, index) => (
//               <div
//                 key={index}
//                 className="group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 opacity-0 animate-fade-up"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div
//                   className={`p-6 md:p-8 h-full flex flex-col bg-gradient-to-br ${service.color}`}
//                 >
//                   <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
//                     {service.icon}
//                   </div>
//                   <h3 className="text-xl font-bold mb-4 group-hover:text-purple-DEFAULT transition-colors duration-300">
//                     {service.title}
//                   </h3>
//                   <p className="text-gray-700 flex-grow">
//                     {service.description}
//                   </p>
//                   <div className="mt-4 h-1 w-0 bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT group-hover:w-1/2 transition-all duration-500"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How We Work Section */}
//       <section className="py-16 md:py-24">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12 md:mb-16 opacity-0 animate-fade-up">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
//               Our <span className="gradient-text">Process</span>
//             </h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Our proven methodology ensures successful data transformations
//               with measurable results
//             </p>
//           </div>

//           <div className="relative">
//             {/* Connection line */}
//             <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 to-purple-200 transform -translate-y-1/2 z-0"></div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 relative z-10">
//               {processSteps.map((step, index) => (
//                 <div
//                   key={index}
//                   className="bg-white rounded-xl shadow-md p-6 md:p-8 text-center group hover:shadow-xl transition-all duration-500 opacity-0 animate-fade-up"
//                   style={{ animationDelay: `${index * 150}ms` }}
//                 >
//                   <div className="flex justify-center mb-6">
//                     <div className="rounded-full bg-white p-4 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-2 border border-gray-100">
//                       {step.icon}
//                     </div>
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-purple-DEFAULT transition-colors duration-300">
//                     {step.title}
//                   </h3>
//                   <p className="text-gray-600">{step.description}</p>
//                   <div className="mt-6 flex justify-center">
//                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-DEFAULT font-bold">
//                       {index + 1}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Expertise Section */}
//       <section className="py-16 md:py-20 bg-white">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 opacity-0 animate-fade-up">
//               Why Choose <span className="gradient-text">DataArch</span>
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
//               {expertiseFeatures.map((feature, index) => (
//                 <div
//                   key={index}
//                   className={`bg-gradient-to-br ${feature.color} p-6 md:p-8 rounded-xl shadow-sm opacity-0 animate-fade-up`}
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
//                   <p className="text-gray-700">{feature.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>
//     </PageLayout>
//   );
// }


import type { Metadata } from "next";
import {
  Database,
  Cloud,
  BarChart3,
  LineChart,
  Network,
  Layers,
  Search,
  ClipboardList,
  Settings,
  Zap,
} from "lucide-react";
import { PageLayout } from "@/components/page-layout";

export const metadata: Metadata = {
  title: "Services | DataArch",
  description:
    "Comprehensive data architecture and analytics services for modern businesses",
};

const services = [
  {
    title: "DATA LAKE IMPLEMENTATION",
    description:
      "Using Big Data technologies, DataArch assists firms by setting up a Data Lake which holds structured and unstructured data securely. With our unique automation techniques, the process is accomplished at a faster pace.",
    icon: <Cloud className="h-12 w-12 text-blue-500" />,
    color: "from-blue-50 to-blue-100",
  },
  {
    title: "CLOUD OPTIMIZATION",
    description:
      "DataArch enables the selection and assignment of the right resources to critical workloads and applications on the cloud. Optimal cloud operations bring better productivity and free up capital for core functions.",
    icon: <Database className="h-12 w-12 text-purple-500" />,
    color: "from-purple-50 to-purple-100",
  },
  {
    title: "DATA PIPELINES",
    description:
      "Develop robust data pipelines that automate the flow of data between systems. We design efficient ETL processes that ensure data reliability and consistency.",
    icon: <Layers className="h-12 w-12 text-green-500" />,
    color: "from-green-50 to-green-100",
  },
  {
    title: "DATA PLATFORM MODERNIZATION",
    description:
      "In order to be data-driven, DataArch helps enterprises consolidate siloed data sources by leveraging partners and accelerators for modernization on the cloud.",
    icon: <BarChart3 className="h-12 w-12 text-orange-500" />,
    color: "from-orange-50 to-orange-100",
  },
  {
    title: "DATA MANAGEMENT",
    description:
      "DataArch ensures that enterprise data confirm to best practices in order to meet their business objective backed by enhanced data quality and compliance adherence.",
    icon: <LineChart className="h-12 w-12 text-red-500" />,
    color: "from-red-50 to-red-100",
  },
  {
    title: "DATA INTEGRATION",
    description:
      "Connect disparate systems and applications to create a unified data ecosystem. Our integration services ensure seamless data flow between all your business platforms.",
    icon: <Network className="h-12 w-12 text-indigo-500" />,
    color: "from-indigo-50 to-indigo-100",
  },
];

const processSteps = [
  {
    title: "Discovery",
    description:
      "At DataArch, we begin by understanding your current data infrastructure and business goals. We identify opportunities and challenges in your digital journey by assessing where advanced technologies can create maximum impact.",
    icon: <Search className="h-10 w-10 text-blue-DEFAULT" />,
  },
  {
    title: "Strategy",
    description:
      "We craft a tailored strategy that includes cloud transformation, data lake setup, and big data integration—ensuring alignment with your business objectives. Our roadmap guides you from strategic planning through to seamless migration and managed operations.",
    icon: <ClipboardList className="h-10 w-10 text-purple-DEFAULT" />,
  },
  {
    title: "Implementation",
    description:
      "Our team uses an iterative, test-and-learn approach to deploy modular solutions with minimal disruption. We build secure data pipelines—handling structured, unstructured, streaming, or big data—to help you transform how your organization operates.",
    icon: <Settings className="h-10 w-10 text-blue-DEFAULT" />,
  },
  {
    title: "Optimization",
    description:
      "We don't stop at deployment. Our unique automation techniques continuously enhance performance, responsiveness, and efficiency—empowering your teams to focus on high-value activities while ensuring your systems are secure and future-ready.",
    icon: <Zap className="h-10 w-10 text-purple-DEFAULT" />,
  },
];

const expertiseFeatures = [
  {
    title: "Industry Expertise",
    description:
      "At DataArch, we bring deep cross-industry experience to the table—spanning finance, healthcare, retail, and manufacturing. We understand the unique data complexities in each sector and apply our knowledge to deliver impactful, industry-specific solutions.",
    color: "from-blue-50 to-blue-100",
    icon: <Database className="h-10 w-10 text-blue-500" />,
  },
  {
    title: "Cutting-Edge Technology",
    description:
      "We leverage the latest in Big Data, cloud computing, and automation. From building secure Data Lakes to streaming unstructured and structured data, our technology stack is constantly evolving to ensure your architecture is scalable, secure, and future-ready.",
    color: "from-purple-50 to-purple-100",
    icon: <Cloud className="h-10 w-10 text-purple-500" />,
  },
  {
    title: "Tailored Solutions",
    description:
      "We know that no two businesses are alike. That's why we customize every engagement—from cloud transformation strategies to data pipeline setups—ensuring alignment with your goals and seamless integration into your operations.",
    color: "from-green-50 to-green-100",
    icon: <Settings className="h-10 w-10 text-green-500" />,
  },
  {
    title: "Measurable Results",
    description:
      "We're committed to outcomes. Our approach enables faster delivery, improved responsiveness, and automation that shifts your resources to value-generating tasks. With clear metrics and performance KPIs, we ensure every transformation initiative drives real business value.",
    color: "from-orange-50 to-orange-100",
    icon: <BarChart3 className="h-10 w-10 text-orange-500" />,
  },
];

export default function ServicesPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-10 md:pt-40 md:pb-14">
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
              Data Solutions for{" "}
              <span className="gradient-text">Modern Businesses</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 opacity-0 animate-fade-up animation-delay-200">
              We help organizations harness the power of their data through
              innovative architecture, analytics, and integration services
              tailored to your specific needs.
            </p>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-100 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-32 -right-16 w-80 h-80 bg-purple-100 rounded-full opacity-20 animate-float animation-delay-2000"></div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-10 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 md:mb-14 opacity-0 animate-fade-up">
            Our <span className="gradient-text">Services</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`p-6 md:p-8 h-full flex flex-col bg-gradient-to-br ${service.color}`}
                >
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-purple-DEFAULT transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 flex-grow">
                    {service.description}
                  </p>
                  <div className="mt-4 h-1 w-0 bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT group-hover:w-1/2 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-12 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 md:mb-14 opacity-0 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our <span className="gradient-text">Process</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our proven methodology ensures successful data transformations
              with measurable results
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 to-purple-200 transform -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 relative z-10">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 md:p-8 text-center group hover:shadow-xl transition-all duration-500 opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-white p-4 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-2 border border-gray-100">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-purple-DEFAULT transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                  <div className="mt-6 flex justify-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-DEFAULT font-bold">
                      {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-16 md:py-14 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-14 opacity-0 animate-fade-up">
              Why Choose <span className="gradient-text">DataArch</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
              {expertiseFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`group bg-gradient-to-br ${feature.color} p-6 md:p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-500 opacity-0 animate-fade-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center mb-4">
                    <div className="mr-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-purple-DEFAULT transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT mb-4 group-hover:w-1/3 transition-all duration-500"></div>
                  <p className="text-gray-700">{feature.description}</p>
                  <div className="mt-4 w-full h-0.5 bg-white/30 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Added subtle background pattern for visual interest */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0"></div>
    </PageLayout>
  );
}