"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { X, Check } from "lucide-react"

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  filterType: "price" | "area" | "location" | null
  onApply: (filters: any) => void
}

const locations = [
  { id: "gangnam", name: "강남구", count: 234 },
  { id: "seocho", name: "서초구", count: 189 },
  { id: "songpa", name: "송파구", count: 156 },
  { id: "mapo", name: "마포구", count: 143 },
  { id: "yongsan", name: "용산구", count: 98 },
  { id: "jongno", name: "종로구", count: 87 },
  { id: "jung", name: "중구", count: 76 },
  { id: "seodaemun", name: "서대문구", count: 65 },
]

const moveInDates = [
  { id: "immediate", name: "즉시입주", count: 456 },
  { id: "within1month", name: "1개월 이내", count: 234 },
  { id: "within3months", name: "3개월 이내", count: 189 },
  { id: "within6months", name: "6개월 이내", count: 123 },
  { id: "negotiable", name: "협의가능", count: 98 },
]

export function PropertyFilterModal({ isOpen, onClose, filterType, onApply }: FilterModalProps) {
  const [priceRange, setPriceRange] = useState([0, 10])
  const [areaRange, setAreaRange] = useState([10, 100])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedMoveInDate, setSelectedMoveInDate] = useState<string>("")

  if (!isOpen || !filterType) return null

  const toggleLocation = (locationId: string) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId) ? prev.filter((id) => id !== locationId) : [...prev, locationId],
    )
  }

  const renderPriceFilter = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">가격 범위</h3>
        <div className="space-y-4">
          <div className="px-4">
            <Slider value={priceRange} onValueChange={setPriceRange} max={10} step={0.5} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{priceRange[0]}억원</span>
              <span>{priceRange[1]}억원</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">최소 가격</label>
              <div className="mt-1 p-3 border border-border rounded-lg">
                <span className="text-lg font-semibold">{priceRange[0]}억원</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">최대 가격</label>
              <div className="mt-1 p-3 border border-border rounded-lg">
                <span className="text-lg font-semibold">{priceRange[1]}억원</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">거래 유형</h4>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            전세
          </Button>
          <Button variant="outline" size="sm">
            월세
          </Button>
          <Button variant="outline" size="sm">
            매매
          </Button>
        </div>
      </div>
    </div>
  )

  const renderAreaFilter = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">면적 범위</h3>
        <div className="space-y-4">
          <div className="px-4">
            <Slider value={areaRange} onValueChange={setAreaRange} max={200} step={5} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{areaRange[0]}㎡</span>
              <span>{areaRange[1]}㎡</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">최소 면적</label>
              <div className="mt-1 p-3 border border-border rounded-lg">
                <span className="text-lg font-semibold">{areaRange[0]}㎡</span>
                <span className="text-sm text-muted-foreground ml-1">({Math.round(areaRange[0] * 0.3025)}평)</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">최대 면적</label>
              <div className="mt-1 p-3 border border-border rounded-lg">
                <span className="text-lg font-semibold">{areaRange[1]}㎡</span>
                <span className="text-sm text-muted-foreground ml-1">({Math.round(areaRange[1] * 0.3025)}평)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderLocationFilter = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">지역 선택</h3>
      <div className="grid grid-cols-2 gap-2">
        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => toggleLocation(location.id)}
            className={`p-3 rounded-lg border text-left transition-colors ${
              selectedLocations.includes(location.id)
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{location.name}</span>
              {selectedLocations.includes(location.id) && <Check className="w-4 h-4 text-primary" />}
            </div>
            <div className="text-sm text-muted-foreground mt-1">매물 {location.count}개</div>
          </button>
        ))}
      </div>

      {selectedLocations.length > 0 && (
        <div className="pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {selectedLocations.map((locationId) => {
              const location = locations.find((l) => l.id === locationId)
              return (
                <Badge key={locationId} variant="secondary" className="gap-1">
                  {location?.name}
                  <button
                    onClick={() => toggleLocation(locationId)}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  const getFilterTitle = () => {
    switch (filterType) {
      case "price":
        return "가격 설정"
      case "area":
        return "면적 설정"
      case "location":
        return "지역 선택"
      default:
        return "필터 설정"
    }
  }

  const getFilterContent = () => {
    switch (filterType) {
      case "price":
        return renderPriceFilter()
      case "area":
        return renderAreaFilter()
      case "location":
        return renderLocationFilter()
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">{getFilterTitle()}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">{getFilterContent()}</div>

        <div className="flex gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            취소
          </Button>
          <Button onClick={() => onApply({})} className="flex-1">
            적용하기
          </Button>
        </div>
      </Card>
    </div>
  )
}
