"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample page content data - in a real app, this would come from an API
const pageContents = {
  home: {
    title: "Home Page",
    sections: [
      {
        id: "hero",
        title: "Hero Section",
        fields: [
          {
            id: "heading",
            label: "Heading",
            type: "text",
            value: "Helping Data-Driven Businesses Unlock Greater Value",
          },
          {
            id: "subheading",
            label: "Subheading",
            type: "textarea",
            value:
              "We transform complex data challenges into strategic business advantages through innovative architecture and analytics solutions.",
          },
          { id: "buttonText", label: "Button Text", type: "text", value: "Get Started" },
        ],
      },
      {
        id: "services",
        title: "Services Section",
        fields: [
          { id: "heading", label: "Heading", type: "text", value: "Why choose DataArch?" },
          {
            id: "subheading",
            label: "Subheading",
            type: "textarea",
            value:
              "Our comprehensive suite of data solutions helps businesses unlock the full potential of their data assets",
          },
        ],
      },
      {
        id: "testimonials",
        title: "Testimonials Section",
        fields: [
          { id: "heading", label: "Heading", type: "text", value: "Hear What Our Clients Say" },
          {
            id: "subheading",
            label: "Subheading",
            type: "textarea",
            value:
              "Don't just take our word for it. Here's what industry leaders have to say about our data solutions.",
          },
        ],
      },
    ],
  },
  about: {
    title: "About Us",
    sections: [
      {
        id: "intro",
        title: "Introduction",
        fields: [
          { id: "heading", label: "Heading", type: "text", value: "About DataArch" },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            value:
              "Founded in 2015, DataArch has been at the forefront of data transformation, helping businesses across industries harness the power of their data to drive growth and innovation.",
          },
        ],
      },
      {
        id: "mission",
        title: "Mission & Vision",
        fields: [
          {
            id: "mission",
            label: "Mission",
            type: "textarea",
            value:
              "To empower organizations to make data-driven decisions by providing innovative, scalable, and secure data solutions that drive business growth and digital transformation.",
          },
          {
            id: "vision",
            label: "Vision",
            type: "textarea",
            value:
              "To be the global leader in data architecture and analytics, recognized for our technical excellence, innovative solutions, and measurable impact on our clients' success.",
          },
        ],
      },
      {
        id: "team",
        title: "Team Section",
        fields: [
          { id: "heading", label: "Heading", type: "text", value: "Meet Our Team" },
          {
            id: "subheading",
            label: "Subheading",
            type: "textarea",
            value:
              "Our diverse team of experts brings together decades of experience in data architecture, cloud computing, and analytics.",
          },
        ],
      },
    ],
  },
  services: {
    title: "Services",
    sections: [
      {
        id: "intro",
        title: "Introduction",
        fields: [
          { id: "heading", label: "Heading", type: "text", value: "Our Services" },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            value:
              "We offer a comprehensive suite of data services designed to help businesses leverage their data assets effectively.",
          },
        ],
      },
      {
        id: "cloudTransformation",
        title: "Cloud Transformation",
        fields: [
          { id: "title", label: "Title", type: "text", value: "Cloud Transformation" },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            value: "Seamless strategy, migration & management",
          },
        ],
      },
      {
        id: "dataLakes",
        title: "AI-Ready Data Lakes",
        fields: [
          { id: "title", label: "Title", type: "text", value: "AI-Ready Data Lakes" },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            value: "Secure storage for structured & unstructured data",
          },
        ],
      },
    ],
  },
  careers: {
    title: "Careers",
    sections: [
      {
        id: "intro",
        title: "Introduction",
        fields: [
          { id: "heading", label: "Heading", type: "text", value: "Join Our Team" },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            value:
              "Find your next career opportunity at DataArch and help us transform how businesses leverage their data",
          },
        ],
      },
      {
        id: "whyJoin",
        title: "Why Join Us",
        fields: [
          { id: "heading", label: "Heading", type: "text", value: "Why Join DataArch?" },
          {
            id: "description",
            label: "Description",
            type: "textarea",
            value: "We offer more than just a job. Join us and be part of a team that's shaping the future of data.",
          },
        ],
      },
    ],
  },
  contact: {
    title: "Contact",
    sections: [
      {
        id: "contactInfo",
        title: "Contact Information",
        fields: [
          { id: "email", label: "Email", type: "text", value: "sales@dataarch.co" },
          { id: "phone", label: "Phone", type: "text", value: "+91-9960743850" },
          {
            id: "address",
            label: "Address",
            type: "textarea",
            value: "New Sanghavi Pimpri-Chinchwad, Maharashtra 411027",
          },
        ],
      },
      {
        id: "formSection",
        title: "Contact Form",
        fields: [
          { id: "heading", label: "Heading", type: "text", value: "Ready to transform your data strategy?" },
          { id: "subheading", label: "Subheading", type: "text", value: "Get in touch with our experts now!" },
        ],
      },
    ],
  },
}

export default function PageEditorPage() {
  const params = useParams()
  const router = useRouter()
  const [pageData, setPageData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch page content
    const fetchPageContent = async () => {
      setIsLoading(true)
      try {
        const pageId = params.id as string
        const content = pageContents[pageId as keyof typeof pageContents]

        if (content) {
          setPageData(content)
          if (content.sections && content.sections.length > 0) {
            setActiveTab(content.sections[0].id)
          }
        } else {
          router.push("/admin/content")
        }
      } catch (error) {
        console.error("Error fetching page content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPageContent()
  }, [params.id, router])

  const handleFieldChange = (sectionId: string, fieldId: string, value: string) => {
    setPageData((prevData) => {
      const updatedSections = prevData.sections.map((section: any) => {
        if (section.id === sectionId) {
          const updatedFields = section.fields.map((field: any) => {
            if (field.id === fieldId) {
              return { ...field, value }
            }
            return field
          })
          return { ...section, fields: updatedFields }
        }
        return section
      })
      return { ...prevData, sections: updatedSections }
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // In a real app, this would be an API call to save the page content
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Page updated",
        description: "The page content has been successfully updated.",
      })
    } catch (error) {
      console.error("Error saving page content:", error)
      toast({
        title: "Error",
        description: "There was an error saving the page content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-DEFAULT"></div>
      </div>
    )
  }

  if (!pageData) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Page not found</p>
        <Link href="/admin/content">
          <Button className="mt-4">Back to Content Management</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/admin/content">
            <Button variant="outline" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit {pageData.title}</h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 overflow-x-auto flex-wrap">
              {pageData.sections.map((section: any) => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {pageData.sections.map((section: any) => (
              <TabsContent key={section.id} value={section.id} className="space-y-6">
                <div className="border-b pb-2 mb-4">
                  <h3 className="text-lg font-medium">{section.title}</h3>
                </div>

                {section.fields.map((field: any) => (
                  <div key={field.id} className="mb-4">
                    <label
                      htmlFor={`${section.id}-${field.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.label}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        id={`${section.id}-${field.id}`}
                        value={field.value}
                        onChange={(e) => handleFieldChange(section.id, field.id, e.target.value)}
                        className="w-full min-h-[100px] p-2 border rounded-md"
                      />
                    ) : (
                      <input
                        type="text"
                        id={`${section.id}-${field.id}`}
                        value={field.value}
                        onChange={(e) => handleFieldChange(section.id, field.id, e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    )}
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
