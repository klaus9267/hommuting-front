"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Property } from "@/hooks/use-property-data"

interface PropertyContextType {
  selectedProperty: Property | null
  hoveredProperty: Property | null
  setSelectedProperty: (property: Property | null) => void
  setHoveredProperty: (property: Property | null) => void
  mapCenter: { lat: number; lng: number }
  setMapCenter: (center: { lat: number; lng: number }) => void
  activeFilters: Record<string, any>
  setActiveFilters: (filters: Record<string, any>) => void
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined)

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 })
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({})

  return (
    <PropertyContext.Provider
      value={{
        selectedProperty,
        hoveredProperty,
        setSelectedProperty,
        setHoveredProperty,
        mapCenter,
        setMapCenter,
        activeFilters,
        setActiveFilters,
      }}
    >
      {children}
    </PropertyContext.Provider>
  )
}

export function usePropertyContext() {
  const context = useContext(PropertyContext)
  if (context === undefined) {
    throw new Error("usePropertyContext must be used within a PropertyProvider")
  }
  return context
}
