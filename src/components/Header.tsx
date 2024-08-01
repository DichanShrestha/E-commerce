import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const Header = ({
  name,
  stocks,
  isEnabled = true,
  desc,
  route,
}: {
  name: string;
  stocks?: number;
  isEnabled?: boolean;
  desc: string;
  route?: string;
}) => {
  return (
    <header className={`mx-10 my-3`}>
      <div className="flex justify-between">
        <div>
          <h1 className="font-bold text-xl">
            {name}({stocks})
          </h1>
          <p className="text-xs dark:text-gray-400 text-gray-600">
            {desc}
          </p>
        </div>
        {isEnabled && (
          <Link href={route!}>
            <Button variant="outline">+ Add new</Button>
          </Link>
        )}
      </div>
      <hr className="mt-4" />
    </header>
  );
};

export default Header;
