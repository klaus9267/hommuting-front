"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PropertyFilterModal } from "@/components/property-filter-modal"
import { ChevronDown, MapPin, Bone as Won, Home } from "lucide-react"

const propertyTypes = [
  { id: "apartment", label: "아파트", active: true },
  { id: "villa", label: "빌라/투룸+", active: false },
  { id: "studio", label: "원룸", active: false },
  { id: "officetel", label: "오피스텔", active: false },
]

const detailFilters = [
  { id: "price", label: "가격", value: "전체", icon: Won },
  { id: "area", label: "면적", value: "전체", icon: Home },
  { id: "location", label: "지역", value: "서울시 전체", icon: MapPin },
]

export function PropertyFilters() {
  const [activeType, setActiveType] = useState("apartment")
  const [modalOpen, setModalOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"price" | "area" | "location" | null>(null)
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({})

  const openFilterModal = (filterType: "price" | "area" | "location") => {
    setActiveFilter(filterType)
    setModalOpen(true)
  }

  const closeFilterModal = () => {
    setModalOpen(false)
    setActiveFilter(null)
  }

  const applyFilter = (filters: any) => {
    if (activeFilter) {
      setAppliedFilters((prev) => ({
        ...prev,
        [activeFilter]: filters,
      }))
    }
    closeFilterModal()
  }

  const getFilterDisplayValue = (filterId: string) => {
    const applied = appliedFilters[filterId]
    if (!applied) return detailFilters.find((f) => f.id === filterId)?.value || "전체"

    switch (filterId) {
      case "price":
        return applied.range ? `${applied.range[0]}억-${applied.range[1]}억` : "전체"
      case "area":
        return applied.range ? `${applied.range[0]}㎡-${applied.range[1]}㎡` : "전체"
      case "location":
        return applied.locations?.length > 0 ? `${applied.locations.length}개 지역` : "서울시 전체"
      default:
        return "전체"
    }
  }

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4 space-y-4">
          {/* Property Types */}
          <div className="flex items-center gap-2">
            {propertyTypes.map((type) => (
              <Button
                key={type.id}
                variant={activeType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveType(type.id)}
                className="h-9"
              >
                {type.label}
              </Button>
            ))}
          </div>

          {/* Detail Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {detailFilters.map((filter) => {
              const Icon = filter.icon
              const hasAppliedFilter = appliedFilters[filter.id]
              return (
                <Button
                  key={filter.id}
                  variant={hasAppliedFilter ? "default" : "outline"}
                  size="sm"
                  className="h-9 gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => openFilterModal(filter.id as any)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{filter.label}</span>
                  <span
                    className={`text-sm font-medium ${hasAppliedFilter ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    {getFilterDisplayValue(filter.id)}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              )
            })}
            <div className="flex items-center gap-2 ml-auto">
              <Badge variant="secondary" className="text-xs">
                매물 1,234개
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <PropertyFilterModal
        isOpen={modalOpen}
        onClose={closeFilterModal}
        filterType={activeFilter}
        onApply={applyFilter}
      />
    </>
  )
}
