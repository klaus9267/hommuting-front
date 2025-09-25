import { PropertyMap } from "@/components/property-map"
import { PropertyFilters } from "@/components/property-filters"
import { PropertySidebar } from "@/components/property-sidebar"
import { PropertyProvider } from "@/contexts/property-context"

export default function HomePage() {
  return (
    <PropertyProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">H</span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  <span className="text-muted-foreground">Home + commuting = </span>
                  <span className="text-primary font-bold">Hommuting</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-sm text-muted-foreground hover:text-foreground">로그인</button>
                <button className="text-sm text-muted-foreground hover:text-foreground">회원가입</button>
              </div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <PropertyFilters />

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Map */}
          <div className="flex-1">
            <PropertyMap />
          </div>

          {/* Sidebar */}
          <div className="w-96 border-l border-border">
            <PropertySidebar />
          </div>
        </div>
      </div>
    </PropertyProvider>
  )
}
