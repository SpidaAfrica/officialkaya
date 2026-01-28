/*import { Logo_light } from "@/assets";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="w-[95%] mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Logo & Navigation *
          <div className="flex-[3] flex flex-col gap-6">
            <Image
              src={Logo_light}
              alt="Kaya Logo"
              className="w-32 h-auto md:w-40 object-contain"
            />

            <ul className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-left">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/socials" className="hover:underline">
                  Our Socials
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* About Kaya *
          <div className="flex-[2] border-t border-blue-400 pt-6 md:border-none md:pt-0">
              <p className="text-left text-base md:text-lg">
                At Kaya, our mission is to simplify parcel delivery by 
                seamlessly connecting individuals and businesses with reliable, 
                affordable, and efficient riders. We are dedicated to not only delivering parcels, 
                but also building trust, enhancing convenience, and providing peace of mind with every delivery experience.
              </p>
          </div>
        </div>

        {/* Bottom Bar *
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-left gap-4">
          <p>© 2024 Kaya. All rights reserved. Deliveries made simple, every time.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:underline">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
*/


import { Logo_light } from "@/assets";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white text-[15px] md:text-sm">
      <div className="w-[95%] mx-auto px-4 py-10">
        {/* Top Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Description */}
          <div className="flex flex-col gap-4">
            <Image
              src={Logo_light}
              alt="Kaya Logo"
              className="w-32 h-auto object-contain"
            />
            <p className="text-left md:text-lg">
              At Kaya, our mission is to simplify parcel delivery by connecting
              individuals and businesses with reliable, affordable, and
              efficient riders. We are committed to delivering not just parcels
              but also trust, convenience, and peace of mind.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-base mb-2">Quick Links</h3>
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/Services" className="hover:underline">Services</Link>
            <Link href="/about" className="hover:underline">About Us</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </div>

          {/* Information */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-base mb-2">Information</h3>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/faq" className="hover:underline">FAQ</Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-base mb-2">Contact Us</h3>
            <p>Lagos, Nigeria</p>
            <p>Email: info@kaya.ng</p>
            <p>Phone: +234 123 456 7990</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p>© 2024 Kaya. All rights reserved. Deliveries made simple, every time.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
