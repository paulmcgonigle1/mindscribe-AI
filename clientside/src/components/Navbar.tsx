// src/components/Navbar.tsx
const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <a className="text-white text-xl font-bold" href="/">
              My WebApp
            </a>
          </div>
          <div>
            <a className="text-gray-300 hover:text-white px-3" href="/features">
              Features
            </a>
            <a className="text-gray-300 hover:text-white px-3" href="/about">
              About
            </a>
            {/* Add more links as needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
