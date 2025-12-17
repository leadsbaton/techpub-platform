import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header>
      <div className="container mx-auto">
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />{" "}
                </svg>
              </div>
              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Parent</a>
                  <ul className="p-2">
                    <li>
                      <a>Submenu 1</a>
                    </li>
                    <li>
                      <a>Submenu 2</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a>Item 3</a>
                </li>
              </ul>
            </div>
            <Link href="/">
              <Image
                src="/leads-baton-logo.png"
                alt="Logo"
                width={72}
                height={57}
              />
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-4 items-center">
              <li>
                <Link
                  href="/"
                  className="btn btn-ghost rounded-field px-3 py-1.5 font-normal p-0 border-0 bg-transparent shadow-none"
                >
                  Home
                </Link>
              </li>
              <li className="dropdown dropdown-bottom dropdown-center">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost rounded-field px-3 py-1.5 font-normal p-0 border-0 bg-transparent shadow-none"
                >
                  Insights
                </div>

                <ul className="menu dropdown-content p-2 bg-base-100 w-40 z-1">
                  <li>
                    <a>View All</a>
                  </li>
                  <li>
                    <a>Finance</a>
                  </li>
                  <li>
                    <a>Marketing</a>
                  </li>
                  <li>
                    <a>Technology</a>
                  </li>
                </ul>
              </li>
              <li className="dropdown dropdown-bottom dropdown-center">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost rounded-field px-3 py-1.5 font-normal p-0 border-0 bg-transparent shadow-none"
                >
                  Whitepapers
                </div>

                <ul className="menu dropdown-content p-2 bg-base-100 w-40 z-1">
                  <li>
                    <a>View All</a>
                  </li>
                  <li>
                    <a>Finance</a>
                  </li>
                  <li>
                    <a>Marketing</a>
                  </li>
                  <li>
                    <a>Technology</a>
                  </li>
                </ul>
              </li>
              <li>
                <a className="btn btn-ghost rounded-field px-3 py-1.5 font-normal p-0 border-0 bg-transparent shadow-none">
                  Webinars
                </a>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            <button className="p-0 border-0 bg-transparent cursor-pointer">
              <i className="ri-search-line text-2xl"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
