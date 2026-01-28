"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ComponentProps, MouseEventHandler, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  children({ isActive }: { isActive: boolean }): React.ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}
export default function NavLink({
  href,
  children,
  onClick,
  ...linkProps
}: Omit<ComponentProps<typeof Link>, "children"> & Props) {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // check if pathname starts with the href
    if (pathname.startsWith(href)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [href, pathname]);

  return (
    <Link onClick={(e) => onClick?.(e)} href={href} {...linkProps}>
      {children({ isActive })}
    </Link>
  );
}
