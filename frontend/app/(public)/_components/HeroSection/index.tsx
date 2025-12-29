import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="bg-base-200 min-h-[500px] h-[80vh] py-16">
      <div className="container mx-auto px-4">
        <div className="relative grid grid-cols-9 grid-rows-10">
          <div className="relative col-start-1 col-span-3 row-start-2 row-end-6 z-10 rounded-box overflow-hidden bg-red-300 border-2 border-base-500 h-full"></div>
          <div className="relative col-start-1 col-span-2 row-start-6 row-end-8 z-10 rounded-box overflow-hidden bg-red-300 border-2 border-base-500 h-full">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias
            quae est a? Illum sequi fuga, quisquam dolores culpa, quis laborum
            quia blanditiis doloribus molestias repellendus eaque. Ducimus non
            fugiat itaque.
          </div>
          <div className="relative col-start-3 col-span-7 row-start-1 row-end-8 z-0 rounded-box overflow-hidden bg-base-300 border-2 border-base-800 h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
