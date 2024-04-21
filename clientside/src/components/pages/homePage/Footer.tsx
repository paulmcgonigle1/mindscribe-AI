import React from "react";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black py-4 text-center">
      <div className="flex justify-center space-x-4">
        <a
          href="#"
          className="text-white hover:text-blue-500 transition duration-300"
        >
          <FaTwitter className="w-6 h-6" />
        </a>
        <a
          href="#"
          className="text-white hover:text-blue-500 transition duration-300"
        >
          <FaFacebook className="w-6 h-6" />
        </a>
        <a
          href="#"
          className="text-white hover:text-blue-500 transition duration-300"
        >
          <FaInstagram className="w-6 h-6" />
        </a>
      </div>
      <p className="text-white mt-2">
        Follow us on social media for updates and more!
      </p>
      <p className="text-white mt-2">
        © {new Date().getFullYear()} MindScribe. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
