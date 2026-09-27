"use client";

import { ArrowUpRight, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const navbar = () => {
  const navItems = [
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Services",
      href: "#services",
    },
    {
      label: "Work",
      href: "#work",
    },
  ];

  return (
    <header className="px-3 pt-3 pb-3 sm:px-5 sm:pt-5">
      <nav className=" flex items-center justify-between rounded-[2rem] border border-black bg-white px-4 py-3 shadow-sm sm:px-6">
        {/* logo here */}
        <Link
          href={"/"}
          className="flex items-center gap-2 text-xl font-black tracking-tight sm:text-2xl"
        >
          <span className="text-2xl text-pink-500">✦</span>
          ARIF
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 rounded-full bg-neutral-100 p-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:shadow-sm"
            >
              {item.label}
            </Link>
          ))}

          <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:shadow-sm">
            More
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="outline"
            className="rounded-full border-2 border-black px-5 font-semibold"
          >
            Free Consultation
          </Button>

          <Button
            size="icon"
            className="h-11 w-11 rounded-full border-2 border-black bg-white text-black hover:bg-black hover:text-white"
          >
            <ArrowUpRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          {/* <SheetTrigger>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger> */}
          <SheetTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black md:hidden">
            <Menu className="h-5 w-5" />
          </SheetTrigger>

          <SheetContent>
            <SheetHeader>
              <SheetTitle>BRAND</SheetTitle>
            </SheetHeader>

            <div className="mt-8 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-lg font-medium hover:bg-neutral-100"
                >
                  {item.label}
                </Link>
              ))}

              <button className="flex items-center justify-between rounded-xl px-4 py-3 text-lg font-medium hover:bg-neutral-100">
                More
                <ChevronDown className="h-5 w-5" />
              </button>

              <Button className="mt-4 rounded-full">Free Consultation</Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default navbar;
