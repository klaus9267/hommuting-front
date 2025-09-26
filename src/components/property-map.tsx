"use client";

import { useEffect, useRef, useState } from "react";
import { usePropertyContext } from "@/contexts/property-context";
import { usePropertyData } from "@/hooks/use-property-data";

export function PropertyMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const {
    selectedProperty,
    hoveredProperty,
    setSelectedProperty,
    setHoveredProperty,
    mapCenter,
  } = usePropertyContext();
  const { properties } = usePropertyData();
  // 선택된 매물만 단일로 표시

  useEffect(() => {
    let map: any | null = null;
    let containerEl: HTMLDivElement | null = null;
    let cleanup: (() => void) | null = null;

    async function init() {
      const { loadKakaoMapsSdk } = await import("@/lib/kakao");
      await loadKakaoMapsSdk();

      // @ts-expect-error - kakao는 전역에 로드됩니다
      const kakao = window.kakao;
      if (!kakao) return;

      // autoload=false로 로드했으므로 kakao.maps.load로 보장
      kakao.maps.load(() => {
        containerEl = mapRef.current;
        if (!containerEl) return;

        const center = new kakao.maps.LatLng(mapCenter.lat, mapCenter.lng);
        map = new kakao.maps.Map(containerEl, {
          center,
          level: 5,
        });

        // 드래그/줌 시 중심 갱신이 필요하면 여기에서 context setter 사용 가능
      });

      cleanup = () => {
        // 카카오맵은 명시적인 destroy API가 없어 DOM을 비워 정리
        if (containerEl) {
          containerEl.innerHTML = "";
        }
      };
    }

    init();

    return () => {
      if (cleanup) cleanup();
    };
  }, [mapCenter.lat, mapCenter.lng]);

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
    if (!property || !property.title) return "";
    const type: string | undefined = property.type;
    if (type && typeof type === "string" && property.title.endsWith(type)) {
      return property.title
        .slice(0, property.title.length - type.length)
        .trim();
    }
    return property.title;
  };

  // 누적 표시 제거: 선택된 매물 하나만 표시하므로 별도 배열 상태 불필요

  // Group properties by map location to show count bubbles like Zigbang
  const groupedByLocation = (() => {
    const groups: Array<{
      key: string;
      lat: number;
      lng: number;
      items: any[];
    }> = [];
    const map = new Map<
      string,
      { key: string; lat: number; lng: number; items: any[] }
    >();
    properties.slice(0, 20).forEach((p) => {
      const loc = getPropertyLocation(p);
      const key = `${loc.lat},${loc.lng}`;
      if (!map.has(key)) {
        map.set(key, { key, lat: loc.lat, lng: loc.lng, items: [] });
      }
      map.get(key)!.items.push(p);
    });
    map.forEach((v) => groups.push(v));
    return groups;
  })();

  return (
    <div className="relative w-full h-full bg-muted">
      {/* Mock Map Background */}
      <div ref={mapRef} className="w-full h-full relative overflow-hidden">
        {/* Property Markers - clustered bubbles with counts */}
        {groupedByLocation.map((group) => {
          const left = 45 + (group.lng - 126.978) * 2000;
          const top = 50 + (37.5665 - group.lat) * 2000;
          return (
            <div
              key={group.key}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{ left: `${left}%`, top: `${top}%` }}
              onClick={() => setSelectedProperty(group.items[0])}
            >
              <div className="w-9 h-9 rounded-full bg-white border border-border shadow-md flex items-center justify-center text-sm font-semibold text-foreground">
                {group.items.length}
              </div>
            </div>
          );
        })}

        {/* 선택된 매물 단일 미니 카드 마커 */}
        {selectedProperty &&
          (() => {
            const loc = getPropertyLocation(selectedProperty);
            const left = 45 + (loc.lng - 126.978) * 2000;
            const top = 50 + (37.5665 - loc.lat) * 2000;
            return (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-[120%]"
                style={{ left: `${left}%`, top: `${top}%`, zIndex: 30 }}
              >
                <div className="bg-card/95 backdrop-blur border border-border rounded-md p-2 shadow-xl w-[140px] pointer-events-none">
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={selectedProperty.images?.[0] || "/placeholder.svg"}
                      alt={selectedProperty.title}
                      className="w-14 h-14 object-cover rounded-sm"
                    />
                    <div className="text-xs font-semibold text-primary leading-tight">
                      {selectedProperty.price}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

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
                  src={selectedProperty.images?.[0] || "/placeholder.svg"}
                  alt={selectedProperty.title}
                  className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="px-1.5 py-0.5 border border-border rounded-sm bg-background/60 text-foreground/80">
                      {selectedProperty.type}
                    </span>
                  </div>
                  <div className="text-base font-semibold text-primary mt-1">
                    {selectedProperty.price}
                  </div>
                  {selectedProperty.maintenanceFee && (
                    <div className="text-sm font-semibold text-primary mt-0.5">
                      {selectedProperty.maintenanceFee}
                    </div>
                  )}
                  <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                    {getAddressOnly(selectedProperty)}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {selectedProperty.area} · {selectedProperty.floor}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                    {selectedProperty.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
