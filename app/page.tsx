import Hero from "@/components/home/Hero";
import LatestModels from "@/components/home/LatestModels";
import Bestsellers from "@/components/home/Bestsellers";
import Categories from "@/components/home/Categories";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <LatestModels />
      <Bestsellers />
      <Categories />
    </div>
  );
}
