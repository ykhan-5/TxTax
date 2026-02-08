import { HeroSection } from "@/components/landing/HeroSection";
import { ZipCodeInput } from "@/components/landing/ZipCodeInput";
import { QuickCityLinks } from "@/components/landing/QuickCityLinks";
import { GeolocationButton } from "@/components/landing/GeolocationButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-16">
      <div className="w-full max-w-2xl space-y-8">
        <HeroSection />
        <ZipCodeInput />
        <GeolocationButton />
        <QuickCityLinks />
      </div>
    </div>
  );
}
