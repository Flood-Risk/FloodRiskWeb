import { FooterArea } from "@/components/footer-area";
import { HeaderArea } from "@/components/header-area";
import { MapArea } from "@/components/map-area";
import { SideBar } from "@/components/side-bar";
import type { ReactElement } from "react";

const HomePage = (): ReactElement => {
  return (
    <>
      <HeaderArea />
      <main className="flex">
        <SideBar />
        <MapArea />
      </main>
      <FooterArea />
    </>
  );
};

export default HomePage;
