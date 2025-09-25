'use client';

import { useState, useCallback } from 'react';

export interface Property {
  id: number;
  title: string;
  price: string;
  monthlyPrice: string;
  maintenanceFee?: string;
  area: string;
  floor: string;
  type: string;
  location: string;
  distance: string;
  images: string[];
  features: string[];
  isLiked: boolean;
  updatedAt: string;
  views: number;
  description: string;
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: '강남구 역삼동 아파트',
    price: '전세 2억 5천만원',
    monthlyPrice: '월세 200/50만원',
    maintenanceFee: '관리비 5만원',
    area: '84㎡ (25평)',
    floor: '15층/20층',
    type: '아파트',
    location: '서울시 강남구 역삼동',
    distance: '역삼역 도보 5분',
    images: ['/modern-apartment.png'],
    features: ['주차가능', '엘리베이터', '베란다'],
    isLiked: false,
    updatedAt: '1시간 전',
    views: 234,
    description: '깔끔하게 리모델링된 아파트입니다. 남향으로 채광이 좋고 교통이 편리합니다.',
  },
  {
    id: 2,
    title: '서초구 서초동 오피스텔',
    price: '전세 3억 2천만원',
    monthlyPrice: '월세 300/80만원',
    maintenanceFee: '관리비 7만원',
    area: '45㎡ (13평)',
    floor: '8층/12층',
    type: '오피스텔',
    location: '서울시 서초구 서초동',
    distance: '서초역 도보 3분',
    images: ['/modern-officetel-room.jpg'],
    features: ['주차가능', '보안시설', '24시간 관리'],
    isLiked: true,
    updatedAt: '2시간 전',
    views: 189,
    description: '신축 오피스텔로 최신 시설을 갖추고 있습니다. 업무와 주거가 모두 가능합니다.',
  },
  {
    id: 3,
    title: '마포구 홍대입구 원룸',
    price: '전세 1억 8천만원',
    monthlyPrice: '월세 100/45만원',
    maintenanceFee: '관리비 3만원',
    area: '20㎡ (6평)',
    floor: '3층/5층',
    type: '원룸',
    location: '서울시 마포구 서교동',
    distance: '홍대입구역 도보 7분',
    images: ['/cozy-studio-apartment.png'],
    features: ['풀옵션', '분리형원룸', '베란다'],
    isLiked: false,
    updatedAt: '3시간 전',
    views: 156,
    description: '홍대 근처 깔끔한 원룸입니다. 풀옵션으로 바로 입주 가능합니다.',
  },
  {
    id: 4,
    title: '용산구 이태원동 빌라',
    price: '전세 4억 1천만원',
    monthlyPrice: '월세 400/120만원',
    maintenanceFee: '관리비 9만원',
    area: '95㎡ (28평)',
    floor: '2층/4층',
    type: '빌라/투룸+',
    location: '서울시 용산구 이태원동',
    distance: '이태원역 도보 10분',
    images: ['/villa-townhouse-interior.jpg'],
    features: ['주차가능', '테라스', '펜트하우스'],
    isLiked: false,
    updatedAt: '4시간 전',
    views: 98,
    description: '넓은 테라스가 있는 빌라입니다. 조용한 주거환경을 원하시는 분께 추천합니다.',
  },
];

export function usePropertyData() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);

  const fetchNextPage = useCallback(async () => {
    if (isLoading || !hasNextPage) return;

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate new properties with different IDs
    const newProperties = mockProperties.map((property, index) => ({
      ...property,
      id: property.id + page * mockProperties.length,
      title: `${property.title} ${page + 1}`,
      updatedAt: `${page + 1}시간 전`,
      views: Math.floor(Math.random() * 300) + 50,
    }));

    setProperties(prev => [...prev, ...newProperties]);
    setPage(prev => prev + 1);

    // Simulate ending after 5 pages
    if (page >= 4) {
      setHasNextPage(false);
    }

    setIsLoading(false);
  }, [isLoading, hasNextPage, page]);

  const toggleLike = useCallback((id: number) => {
    setProperties(prev => prev.map(property => (property.id === id ? { ...property, isLiked: !property.isLiked } : property)));
  }, []);

  const sortProperties = useCallback((sortBy: 'latest' | 'price' | 'area') => {
    setProperties(prev =>
      [...prev].sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return Number.parseInt(a.price.replace(/[^0-9]/g, '')) - Number.parseInt(b.price.replace(/[^0-9]/g, ''));
          case 'area':
            return Number.parseInt(a.area.replace(/[^0-9]/g, '')) - Number.parseInt(b.area.replace(/[^0-9]/g, ''));
          default:
            return 0;
        }
      })
    );
  }, []);

  return {
    properties,
    isLoading,
    hasNextPage,
    fetchNextPage,
    toggleLike,
    sortProperties,
  };
}
