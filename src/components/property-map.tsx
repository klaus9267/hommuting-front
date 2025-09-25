'use client';

import { useEffect, useRef, useState } from 'react';
import { usePropertyContext } from '@/contexts/property-context';
import { usePropertyData } from '@/hooks/use-property-data';

export function PropertyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { selectedProperty, hoveredProperty, setSelectedProperty, setHoveredProperty, mapCenter } = usePropertyContext();
  const { properties } = usePropertyData();
  const [pinnedProperties, setPinnedProperties] = useState<any[]>([]);

  useEffect(() => {
    // This would be where you'd initialize your map (Kakao Map, Google Maps, etc.)
    // For now, we'll create a mock map interface
  }, []);

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
    ];

    const index = (property.id - 1) % baseLocations.length;
    return baseLocations[index];
  };

  const getAddressOnly = (property: any) => {
    if (!property || !property.title) return '';
    const type: string | undefined = property.type;
    if (type && typeof type === 'string' && property.title.endsWith(type)) {
      return property.title.slice(0, property.title.length - type.length).trim();
    }
    return property.title;
  };

  // 누적 핀: 선택될 때마다 작은 카드가 버블 위로 쌓이도록 저장
  useEffect(() => {
    if (!selectedProperty) return;
    setPinnedProperties(prev => [...prev, selectedProperty]);
  }, [selectedProperty]);

  // Group properties by map location to show count bubbles like Zigbang
  const groupedByLocation = (() => {
    const groups: Array<{ key: string; lat: number; lng: number; items: any[] }> = [];
    const map = new Map<string, { key: string; lat: number; lng: number; items: any[] }>();
    properties.slice(0, 20).forEach(p => {
      const loc = getPropertyLocation(p);
      const key = `${loc.lat},${loc.lng}`;
      if (!map.has(key)) {
        map.set(key, { key, lat: loc.lat, lng: loc.lng, items: [] });
      }
      map.get(key)!.items.push(p);
    });
    map.forEach(v => groups.push(v));
    return groups;
  })();

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
        {/* Property Markers - clustered bubbles with counts */}
        {groupedByLocation.map(group => {
          const left = 45 + (group.lng - 126.978) * 2000;
          const top = 50 + (37.5665 - group.lat) * 2000;
          return (
            <div key={group.key} className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10" style={{ left: `${left}%`, top: `${top}%` }} onClick={() => setSelectedProperty(group.items[0])}>
              <div className="w-9 h-9 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-sm font-semibold text-foreground">{group.items.length}</div>
            </div>
          );
        })}

        {/* Selected mini-card marker (thumbnail + price only) */}
        {pinnedProperties.map((p, idx) => {
          const loc = getPropertyLocation(p);
          const left = 45 + (loc.lng - 126.978) * 2000;
          const top = 50 + (37.5665 - loc.lat) * 2000;
          return (
            <div key={`${p.id}-${idx}`} className="absolute transform -translate-x-1/2 -translate-y-[120%]" style={{ left: `${left}%`, top: `${top}%`, zIndex: 30 + idx }}>
              <div className="bg-card/95 backdrop-blur border border-border rounded-md p-2 shadow-xl w-[140px] pointer-events-none">
                <div className="flex flex-col items-center gap-1">
                  <img src={p.images?.[0] || '/placeholder.svg'} alt={p.title} className="w-14 h-14 object-cover rounded-sm" />
                  <div className="text-xs font-semibold text-primary leading-tight">{p.price}</div>
                </div>
              </div>
            </div>
          );
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
                <img src={selectedProperty.images?.[0] || '/placeholder.svg'} alt={selectedProperty.title} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="px-1.5 py-0.5 border border-border rounded-sm bg-background/60 text-foreground/80">{selectedProperty.type}</span>
                  </div>
                  <div className="text-base font-semibold text-primary mt-1">{selectedProperty.price}</div>
                  {selectedProperty.maintenanceFee && <div className="text-sm font-semibold text-primary mt-0.5">{selectedProperty.maintenanceFee}</div>}
                  <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{getAddressOnly(selectedProperty)}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {selectedProperty.area} · {selectedProperty.floor}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{selectedProperty.description}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
