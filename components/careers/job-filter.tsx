"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown } from "lucide-react"
import type { JobPosition } from "./job-card"

interface JobFilterProps {
  jobs: JobPosition[]
  onFilter: (filteredJobs: JobPosition[]) => void
}

export function JobFilter({ jobs, onFilter }: JobFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  // State to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Refs for dropdown containers
  const departmentRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)
  const typeRef = useRef<HTMLDivElement>(null)

  // Extract unique departments, locations, and types
  const departments = Array.from(new Set(jobs.map((job) => job.department)))
  const locations = Array.from(new Set(jobs.map((job) => job.location)))
  const types = Array.from(new Set(jobs.map((job) => job.type)))

  // Handle clicks outside the dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        departmentRef.current &&
        !departmentRef.current.contains(event.target as Node) &&
        locationRef.current &&
        !locationRef.current.contains(event.target as Node) &&
        typeRef.current &&
        !typeRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    applyFilters(value, selectedDepartment, selectedLocation, selectedType)
  }

  const handleDepartmentChange = (department: string | null) => {
    setSelectedDepartment(department)
    setOpenDropdown(null)
    applyFilters(searchTerm, department, selectedLocation, selectedType)
  }

  const handleLocationChange = (location: string | null) => {
    setSelectedLocation(location)
    setOpenDropdown(null)
    applyFilters(searchTerm, selectedDepartment, location, selectedType)
  }

  const handleTypeChange = (type: string | null) => {
    setSelectedType(type)
    setOpenDropdown(null)
    applyFilters(searchTerm, selectedDepartment, selectedLocation, type)
  }

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const applyFilters = (search: string, department: string | null, location: string | null, type: string | null) => {
    let filteredJobs = [...jobs]

    if (search) {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (department) {
      filteredJobs = filteredJobs.filter((job) => job.department === department)
    }

    if (location) {
      filteredJobs = filteredJobs.filter((job) => job.location === location)
    }

    if (type) {
      filteredJobs = filteredJobs.filter((job) => job.type === type)
    }

    onFilter(filteredJobs)
  }

  const FilterDropdown = ({
    label,
    options,
    selected,
    onChange,
    isOpen,
    onToggle,
    dropdownRef,
  }: {
    label: string
    options: string[]
    selected: string | null
    onChange: (value: string | null) => void
    isOpen: boolean
    onToggle: () => void
    dropdownRef: React.RefObject<HTMLDivElement>
  }) => (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition-colors"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selected || label}</span>
        <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1">
          <div className="bg-white rounded-md shadow-lg py-1 max-h-60 overflow-auto" role="listbox">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-light/10"
              onClick={() => onChange(null)}
              role="option"
              aria-selected={selected === null}
            >
              All {label}s
            </button>
            {options.map((option) => (
              <button
                key={option}
                className={`w-full text-left px-4 py-2 text-sm ${
                  selected === option ? "bg-purple-light/20 text-purple-dark" : "text-gray-700 hover:bg-purple-light/10"
                }`}
                onClick={() => onChange(option)}
                role="option"
                aria-selected={selected === option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="mb-12">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search jobs..."
          className="pl-10 py-6 rounded-lg border-gray-300"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FilterDropdown
          label="Department"
          options={departments}
          selected={selectedDepartment}
          onChange={handleDepartmentChange}
          isOpen={openDropdown === "department"}
          onToggle={() => toggleDropdown("department")}
          dropdownRef={departmentRef}
        />
        <FilterDropdown
          label="Location"
          options={locations}
          selected={selectedLocation}
          onChange={handleLocationChange}
          isOpen={openDropdown === "location"}
          onToggle={() => toggleDropdown("location")}
          dropdownRef={locationRef}
        />
        <FilterDropdown
          label="Work type"
          options={types}
          selected={selectedType}
          onChange={handleTypeChange}
          isOpen={openDropdown === "type"}
          onToggle={() => toggleDropdown("type")}
          dropdownRef={typeRef}
        />
      </div>
    </div>
  )
}
