import type { Metadata } from "next"
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
} from "lucide-react"
import { PageLayout } from "@/components/page-layout"

export const metadata: Metadata = {
  title: "Services | DataArch",
  description: "Comprehensive data architecture and analytics services for modern businesses",
}

const services = [
  {
    title: "Cloud Transformation",
    description:
      "Migrate your data infrastructure to the cloud with our expert guidance. We help businesses leverage cloud technologies for improved scalability, cost-efficiency, and performance.",
    icon: <Cloud className="h-12 w-12 text-blue-500" />,
    color: "from-blue-50 to-blue-100",
  },
  {
    title: "Data Lakes",
    description:
      "Build centralized repositories that allow you to store structured and unstructured data at any scale. Our data lake solutions enable advanced analytics and machine learning capabilities.",
    icon: <Database className="h-12 w-12 text-purple-500" />,
    color: "from-purple-50 to-purple-100",
  },
  {
    title: "Data Pipelines",
    description:
      "Develop robust data pipelines that automate the flow of data between systems. We design efficient ETL processes that ensure data reliability and consistency.",
    icon: <Layers className="h-12 w-12 text-green-500" />,
    color: "from-green-50 to-green-100",
  },
  {
    title: "Data Strategy",
    description:
      "Create a comprehensive data strategy aligned with your business objectives. We help organizations maximize the value of their data assets through strategic planning and governance.",
    icon: <BarChart3 className="h-12 w-12 text-orange-500" />,
    color: "from-orange-50 to-orange-100",
  },
  {
    title: "Business Intelligence",
    description:
      "Transform raw data into meaningful insights with our BI solutions. We implement dashboards and reporting tools that enable data-driven decision making across your organization.",
    icon: <LineChart className="h-12 w-12 text-red-500" />,
    color: "from-red-50 to-red-100",
  },
  {
    title: "Data Integration",
    description:
      "Connect disparate systems and applications to create a unified data ecosystem. Our integration services ensure seamless data flow between all your business platforms.",
    icon: <Network className="h-12 w-12 text-indigo-500" />,
    color: "from-indigo-50 to-indigo-100",
  },
]

const processSteps = [
  {
    title: "Discovery",
    description:
      "We analyze your current data infrastructure and business goals to identify opportunities and challenges.",
    icon: <Search className="h-10 w-10 text-blue-DEFAULT" />,
  },
  {
    title: "Strategy",
    description:
      "We develop a tailored data strategy aligned with your objectives, creating a roadmap for implementation.",
    icon: <ClipboardList className="h-10 w-10 text-purple-DEFAULT" />,
  },
  {
    title: "Implementation",
    description:
      "Our experts deploy solutions with minimal disruption to your operations, ensuring smooth transitions.",
    icon: <Settings className="h-10 w-10 text-blue-DEFAULT" />,
  },
  {
    title: "Optimization",
    description:
      "We continuously improve your data systems to maximize performance, security, and return on investment.",
    icon: <Zap className="h-10 w-10 text-purple-DEFAULT" />,
  },
]

export default function ServicesPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 z-0"></div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-up">
              Data Solutions for <span className="gradient-text">Modern Businesses</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              We help organizations harness the power of their data through innovative architecture, analytics, and
              integration services tailored to your specific needs.
            </p>
          </div>
        </div>

        {/* Abstract shapes */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-100 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute top-32 -right-16 w-80 h-80 bg-purple-100 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 animate-fade-up">
            Our <span className="gradient-text">Services</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`p-8 h-full flex flex-col bg-gradient-to-br ${service.color}`}>
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-purple-DEFAULT transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 flex-grow">{service.description}</p>
                  <div className="mt-4 h-1 w-0 bg-gradient-to-r from-blue-DEFAULT to-purple-DEFAULT group-hover:w-1/2 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our <span className="gradient-text">Process</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our proven methodology ensures successful data transformations with measurable results
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 to-purple-200 transform -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-8 text-center group hover:shadow-xl transition-all duration-500 animate-fade-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 animate-fade-up">
              Why Choose <span className="gradient-text">DataArch</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4">Industry Expertise</h3>
                <p className="text-gray-700">
                  Our team brings decades of combined experience across industries including finance, healthcare,
                  retail, and manufacturing. We understand the unique data challenges each sector faces.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4">Cutting-Edge Technology</h3>
                <p className="text-gray-700">
                  We stay at the forefront of data technology, implementing solutions using the latest tools and
                  methodologies to ensure your data architecture is future-proof.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4">Tailored Solutions</h3>
                <p className="text-gray-700">
                  We don't believe in one-size-fits-all approaches. Every solution we design is customized to address
                  your specific business challenges and objectives.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold mb-4">Measurable Results</h3>
                <p className="text-gray-700">
                  Our focus is on delivering tangible business value. We establish clear metrics and KPIs to measure the
                  success of our data initiatives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
