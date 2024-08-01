"use client";
import ComboBox from "./ComboBox";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { IoSunnyOutline } from "react-icons/io5";
import { RxMoon } from "react-icons/rx";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const NavLink = ({ href, children }: { href: string; children: string }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <span className={isActive ? "font-bold" : ""}>{children}</span>
    </Link>
  );
};

const Navbar = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [position, setPosition] = useState<string>("dark");
  return (
    <div className="flex justify-between h-[55px] items-center mx-2">
      <div>
        <ComboBox />
      </div>
      <div className="flex gap-3 text-sm">
        <NavLink href="/">Overview</NavLink>
        <NavLink href="/billboards">Billboards</NavLink>
        <NavLink href="/categories">Categories</NavLink>
        <NavLink href="/sizes">Sizes</NavLink>
        <NavLink href="/colors">Colors</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">Orders</NavLink>
      </div>
      <div className="flex gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-none">
              {resolvedTheme === "light" ? (
                <IoSunnyOutline className="h-5 w-5" />
              ) : (
                <RxMoon className="h-[20px] w-[20px]" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem onClick={() => setTheme('light')} value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem onClick={() => setTheme('dark')} value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem onClick={() => setTheme('system')} value="system">
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
