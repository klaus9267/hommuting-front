'use client';

import { useState } from 'react';
import { Home } from 'lucide-react';
import { usePropertyData } from '@/hooks/use-property-data';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { usePropertyContext } from '@/contexts/property-context';

export function PropertySidebar() {
  const [sortBy, setSortBy] = useState<'latest' | 'price' | 'area'>('latest');
  const { properties, isLoading, hasNextPage, fetchNextPage, toggleLike, sortProperties } = usePropertyData();

  const { selectedProperty, hoveredProperty, setSelectedProperty, setHoveredProperty } = usePropertyContext();

  const { loadingRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage: isLoading,
    fetchNextPage,
    threshold: 200,
  });

  const handleSortChange = (newSortBy: 'latest' | 'price' | 'area') => {
    setSortBy(newSortBy);
    sortProperties(newSortBy);
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">매물 목록</h2>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">정렬:</span>
          <div className="flex gap-1">
            {[
              { key: 'latest', label: '최신순' },
              { key: 'price', label: '가격순' },
              { key: 'area', label: '면적순' },
            ].map(option => (
              <button key={option.key} className={`h-7 px-2 rounded-md text-xs border ${sortBy === option.key ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`} onClick={() => handleSortChange(option.key as any)}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Property List */}
      <div className="px-2 py-2 divide-y divide-border">
        {properties.map(property => {
          const isSelected = selectedProperty?.id === property.id;
          const isHovered = hoveredProperty?.id === property.id;

          return (
            <div key={property.id} className={`flex gap-3 px-2 py-2 cursor-pointer transition-colors hover:bg-accent/30 ${isSelected ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedProperty(property)} onMouseEnter={() => setHoveredProperty(property)} onMouseLeave={() => setHoveredProperty(null)}>
              <div className="relative flex-shrink-0 w-28 h-20 bg-muted overflow-hidden flex items-center justify-center">
                <img src={property.images[0] || '/placeholder.svg'} alt={property.title} className="max-w-full max-h-full object-cover object-center" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="px-1.5 py-0.5 border border-border rounded-sm bg-background/60 text-foreground/80">{property.type}</span>
                </div>
                {/* 가격 */}
                <div className="text-sm font-semibold text-primary mt-1">{property.price}</div>
                {/* 관리비: 가격과 동일한 UI 크기 */}
                {property.maintenanceFee && <div className="text-sm font-semibold text-primary mt-0.5">{property.maintenanceFee}</div>}
                {/* 주소(제목에서 유형 제거) */}
                <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{property.title.endsWith(property.type) ? property.title.slice(0, property.title.length - property.type.length).trim() : property.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {property.area} · {property.floor}
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{property.description}</p>
              </div>
            </div>
          );
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
  );
}
