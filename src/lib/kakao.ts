// Kakao Maps JavaScript SDK 동적 로더 (의존성 추가 없이 사용)
// - 중복 로드를 방지하고, SDK 로드 후 kakao.maps.load 콜백까지 보장

let kakaoSdkLoadingPromise: Promise<void> | null = null;

function resolveKakaoKey(): string | undefined {
  const env = import.meta.env as unknown as Record<string, string | undefined>;
  return env.VITE_KAKAO_JAVASCRIPT_KEY;
}

export function loadKakaoMapsSdk(): Promise<void> {
  if (
    typeof window !== "undefined" &&
    (window as unknown as { kakao?: unknown }).kakao
  ) {
    // 이미 로드됨
    return Promise.resolve();
  }

  if (kakaoSdkLoadingPromise) return kakaoSdkLoadingPromise;

  const appKey = resolveKakaoKey();
  if (!appKey) {
    return Promise.reject(
      new Error(
        "Kakao JavaScript Key가 설정되지 않았습니다. VITE_KAKAO_JAVASCRIPT_KEY 또는 KAKAO_JAVASCRIPT_KEY를 .env에 설정하세요."
      )
    );
  }

  kakaoSdkLoadingPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-kakao-sdk]"
    );
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
      appKey
    )}&autoload=false`;
    script.async = true;
    script.defer = true;
    script.dataset.kakaoSdk = "true";
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => {
      kakaoSdkLoadingPromise = null; // 다음 호출에서 재시도 가능
      script.remove();
      reject(new Error("Kakao SDK 로드 실패"));
    });
    document.head.appendChild(script);
  });

  return kakaoSdkLoadingPromise;
}
