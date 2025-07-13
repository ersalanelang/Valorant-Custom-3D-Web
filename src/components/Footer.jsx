import { FaLinkedin, FaGithub, FaInstagram, FaGlobe, FaEnvelope } from "react-icons/fa";

const socialLinks = [
  { href: "https://www.linkedin.com/in/ersalan-kusuma/", icon: <FaLinkedin /> },
  { href: "https://ersalan-portofolio.vercel.app/", icon: <FaGlobe /> },
  { href: "https://github.com/ersalanelang", icon: <FaGithub /> },
  { href: "https://www.instagram.com/ersalanek/", icon: <FaInstagram /> },
  { href: "mailto:ersa.kusuma.ek@gmail.com", icon: <FaEnvelope /> },
];

const Footer = () => {
  return (
    <footer className="w-screen bg-red-50 py-8 text-black">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4">
        {/* Social Links - Di atas */}
        <div className="flex justify-center gap-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black transition-colors duration-500 ease-in-out hover:text-white text-xl"
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* Copyright Text - Di tengah */}
        <p className="text-center text-sm font-light">
          © 2025 Ersalan Elang Kusuma. Design inspired by Zentry.com. Valorant is a trademark of Riot Games,<br /> used here for non‑commercial and educational purposes.
        </p>

        {/* Privacy Policy - Di bawah */}
        <a
          href="#privacy-policy"
          className="text-center text-sm font-light hover:underline"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;