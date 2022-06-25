import Link from "next/link";
import { SearchIcon, BellIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`${isScrolled && "bg-[#141414]"}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <img
          src="https://rb.gy/ulxxee"
          width={100}
          height={100}
          className="cursor-pointer object-contain"
        />

        <ul className="hidden space-x-4 md:flex">
          <li className="headerStyles md:text-base lg:text-lg font-normal">
            Home
          </li>
          <li className="headerStyles md:text-base lg:text-lg font-normal">
            TV Shows
          </li>
          <li className="headerStyles md:text-base lg:text-lg font-normal">
            Movies
          </li>
          <li className="headerStyles md:text-base lg:text-lg font-normal">
            New & Popular
          </li>
          <li className="headerStyles md:text-base lg:text-lg font-normal">
            My List
          </li>
        </ul>
      </div>

      <div className="flex items-center space-x-4 test-sm font-light">
        <SearchIcon className="hidden sm:inline h-6 w-6" />
        <p className="hidden lg:inline">Kids</p>
        <BellIcon className="h-6 w-6" />
        <div className="cursor-pointer rounded-full w-8 h-8">
          <Image
            src={session.user.image}
            height={30}
            width={30}
            className="cursor-pointer rounded-full w-8 h-8"
            onClick={signOut}
            title={`${session.user.name} | Sign Out`}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
