"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, Eye, Share2 } from "lucide-react"
import { usePropertyData } from "@/hooks/use-property-data"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { usePropertyContext } from "@/contexts/property-context"

export function PropertySidebar() {
  const [sortBy, setSortBy] = useState<"latest" | "price" | "area">("latest")
  const { properties, isLoading, hasNextPage, fetchNextPage, toggleLike, sortProperties } = usePropertyData()

  const { selectedProperty, hoveredProperty, setSelectedProperty, setHoveredProperty } = usePropertyContext()

  const { loadingRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage: isLoading,
    fetchNextPage,
    threshold: 200,
  })

  const handleSortChange = (newSortBy: "latest" | "price" | "area") => {
    setSortBy(newSortBy)
    sortProperties(newSortBy)
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">매물 목록</h2>
          <Badge variant="secondary" className="text-xs">
            {properties.length}개
          </Badge>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">정렬:</span>
          <div className="flex gap-1">
            {[
              { key: "latest", label: "최신순" },
              { key: "price", label: "가격순" },
              { key: "area", label: "면적순" },
            ].map((option) => (
              <Button
                key={option.key}
                variant={sortBy === option.key ? "default" : "ghost"}
                size="sm"
                onClick={() => handleSortChange(option.key as any)}
                className="h-7 text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Property List */}
      <div className="p-4 space-y-4">
        {properties.map((property) => {
          const isSelected = selectedProperty?.id === property.id
          const isHovered = hoveredProperty?.id === property.id

          return (
            <Card
              key={property.id}
              className={`overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group ${
                isSelected ? "ring-2 ring-primary shadow-lg" : isHovered ? "shadow-md" : ""
              }`}
              onClick={() => setSelectedProperty(property)}
              onMouseEnter={() => setHoveredProperty(property)}
              onMouseLeave={() => setHoveredProperty(null)}
            >
              <div className="relative">
                <img
                  src={property.images[0] || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-t-lg"></div>
                )}

                {/* Image Overlay Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                    >
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800">
                      {property.type}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                      <Eye className="w-3 h-3 text-gray-600" />
                      <span className="text-xs text-gray-600">{property.views}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className={`font-semibold text-foreground text-sm leading-tight line-clamp-2 flex-1 ${
                      isSelected ? "text-primary" : ""
                    }`}
                  >
                    {property.title}
                  </h3>
                </div>

                {/* Price */}
                <div className="space-y-1 mb-3">
                  <div className="text-lg font-bold text-primary">{property.price}</div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Home className="w-4 h-4" />
                    <span>
                      {property.area} · {property.floor}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{property.description}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    상세보기
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}

        {/* Infinite Scroll Trigger */}
        <div ref={loadingRef} className="h-10">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span className="text-sm">더 많은 매물을 불러오는 중...</span>
              </div>
            </div>
          )}
        </div>

        {/* End of Results */}
        {!hasNextPage && properties.length > 0 && (
          <div className="text-center py-8">
            <div className="text-sm text-muted-foreground">모든 매물을 확인했습니다</div>
            <div className="text-xs text-muted-foreground mt-1">총 {properties.length}개의 매물</div>
          </div>
        )}
      </div>
    </div>
  )
}
