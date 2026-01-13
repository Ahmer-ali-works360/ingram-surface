import Hero from "./components/Hero";
import ProductSections from "./components/ProductSections";
import HowItWorks from "./components/HowItWorks";


export default function Home() {
  return (
    <>
      <main className="w-full min-h-screen">
        <Hero />
        <ProductSections />
        <HowItWorks />
      </main>
    </>
  );
}
