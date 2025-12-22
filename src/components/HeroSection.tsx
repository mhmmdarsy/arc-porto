import { HeroTitle } from './HeroTitle';
import { HeroDescription } from './HeroDescription';

export function HeroSection() {
  return (
    <section className="min-h-screen pt-24 px-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start">
          <HeroTitle />
        </div>
        <div className="mt-12 max-w-3xl">
          <HeroDescription />
        </div>
      </div>
    </section>
  );
}
