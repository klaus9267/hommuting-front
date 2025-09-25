"use client"

import { useEffect, useRef } from "react"
import { usePropertyContext } from "@/contexts/property-context"
import { usePropertyData } from "@/hooks/use-property-data"

export function PropertyMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const { selectedProperty, hoveredProperty, setSelectedProperty, setHoveredProperty, mapCenter } = usePropertyContext()
  const { properties } = usePropertyData()

  useEffect(() => {
    // This would be where you'd initialize your map (Kakao Map, Google Maps, etc.)
    // For now, we'll create a mock map interface
  }, [])

  // Mock property locations based on real Seoul coordinates
  const getPropertyLocation = (property: any) => {
    const baseLocations = [
      { lat: 37.5665, lng: 126.978 }, // 명동
      { lat: 37.5651, lng: 126.9895 }, // 을지로
      { lat: 37.5707, lng: 126.9794 }, // 종로
      { lat: 37.5633, lng: 126.9816 }, // 중구
      { lat: 37.5689, lng: 126.9831 }, // 인사동
      { lat: 37.5612, lng: 126.9882 }, // 동대문
      { lat: 37.5734, lng: 126.9751 }, // 경복궁
      { lat: 37.5598, lng: 126.9847 }, // 남산
    ]

    const index = (property.id - 1) % baseLocations.length
    return baseLocations[index]
  }

  return (
    <div className="relative w-full h-full bg-muted">
      {/* Mock Map Background */}
      <div
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23e5e7eb' fillOpacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Property Markers */}
        {properties.slice(0, 20).map((property) => {
          const location = getPropertyLocation(property)
          const isSelected = selectedProperty?.id === property.id
          const isHovered = hoveredProperty?.id === property.id

          return (
            <div
              key={property.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              style={{
                left: `${45 + (location.lng - 126.978) * 2000}%`,
                top: `${50 + (37.5665 - location.lat) * 2000}%`,
              }}
              onClick={() => setSelectedProperty(property)}
              onMouseEnter={() => setHoveredProperty(property)}
              onMouseLeave={() => setHoveredProperty(null)}
            >
              <div
                className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-lg transition-all duration-200 border-2 border-white ${
                  isSelected || isHovered
                    ? "bg-primary text-primary-foreground scale-110 shadow-xl z-20"
                    : "bg-white text-primary hover:scale-105 hover:shadow-xl"
                }`}
              >
                {property.price.split(" ")[1]}
              </div>

              {/* Hover/Selected tooltip */}
              {(isHovered || isSelected) && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 pointer-events-none z-30">
                  <div className="bg-card border border-border rounded-lg p-4 shadow-xl min-w-[280px] max-w-[320px]">
                    <div className="flex gap-3">
                      <img
                        src={property.images[0] || "/placeholder.svg"}
                        alt={property.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-card-foreground line-clamp-2 mb-1">
                          {property.title}
                        </div>
                        <div className="text-lg font-bold text-primary mb-1">{property.price}</div>
                        <div className="text-xs text-muted-foreground">
                          {property.area} · {property.distance}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground">클릭하여 상세보기</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <span className="text-lg font-bold text-foreground">+</span>
          </button>
          <button className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
            <span className="text-lg font-bold text-foreground">-</span>
          </button>
        </div>

        {/* Current Location Button */}
        <div className="absolute bottom-4 right-4">
          <button className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
          </button>
        </div>

        {/* Selected Property Info Panel */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-4 right-20">
            <div className="bg-card border border-border rounded-lg p-4 shadow-xl max-w-md">
              <div className="flex gap-4">
                <img
                  src={selectedProperty.images[0] || "/placeholder.svg"}
                  alt={selectedProperty.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground text-sm line-clamp-2 mb-2">
                    {selectedProperty.title}
                  </h3>
                  <div className="text-lg font-bold text-primary mb-1">{selectedProperty.price}</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {selectedProperty.area} · {selectedProperty.distance}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                      onClick={() => setSelectedProperty(null)}
                    >
                      상세보기
                    </button>
                    <button
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium hover:bg-secondary/90 transition-colors"
                      onClick={() => setSelectedProperty(null)}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
