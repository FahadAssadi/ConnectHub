import { HowItWorksSection } from "./(components)/how-it-works-section";
import { PlatformFeaturesSection } from "./(components)/platform-features-section";

export default function OnboardingPage() {
  return (
    <main>
      <HowItWorksSection />
      <PlatformFeaturesSection />
    </main>
  );
}