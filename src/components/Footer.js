import React from "react";
import tewoLogo from "../assets/tewo-logo.png";
import callIcon from "../assets/call.svg";
import emailIcon from "../assets/email.svg";
import linkedinIcon from "../assets/linkedin-white.svg";
import twitterIcon from "../assets/twitterx-white.svg";
import instagramIcon from "../assets/instagram-white.svg";

const Footer = () => {
  return (
    <footer className="bg-[#071d3d] text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start px-4">
        {/* Logo and Copyright */}
        <div className="mb-6 md:mb-0 md:ml-[80px]"> {/* Added margin-left for more spacing */}
          <img src={tewoLogo} alt="EquiBloc Logo" className="mb-2 ml-[-18px]" width={250} />
          <p>Tewo Republic Copyright © 2024</p>
          <p>Tewo Republic - All rights Reserved.</p>
        </div>

        {/* Contact Information */}
        <div className="mb-6 md:mb-0">
          <h3 className="font-bold mb-[30px]">Reach us</h3>
          <div className="flex items-center mb-2">
            <img src={callIcon} alt="Call Icon" className="mr-2" />
            <span>+234 XXX XXX XXX</span>
          </div>
          <div className="flex items-center">
            <img src={emailIcon} alt="Email Icon" className="mr-2" />
            <span>mail@gmail.com</span>
          </div>
        </div>

        {/* Legal Information */}
        <div className="mb-6 md:mb-0">
          <h3 className="font-bold mb-[30px]">Legal</h3>
          <ul className="space-y-1">
            <li>Privacy Policy</li>
            <li>Terms and Conditions</li>
            <li>Return Policy</li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="md:mr-[100px]"> {/* Added margin-right for more spacing */}
          <h3 className="font-bold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <img src={linkedinIcon} alt="LinkedIn Icon" className="w-6 h-6" />
            <img src={twitterIcon} alt="Twitter Icon" className="w-6 h-6" />
            <img src={instagramIcon} alt="Instagram Icon" className="w-6 h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
