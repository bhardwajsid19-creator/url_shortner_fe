import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LinkOutlined,
  GithubOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", to: "/features" },
    { label: "Pricing", to: "/pricing" },
  ],
  Company: [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  Legal: [
    { label: "Privacy", to: "/privacy" },
    { label: "Terms", to: "/terms" },
  ],
};

export default function AppFooter() {
  return (
    <footer className="relative bg-gray-950 text-gray-400 overflow-hidden">
      {/* Subtle orange gradient glow at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2 no-underline mb-4 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-400 text-white shadow-lg shadow-orange-900/30 transition-transform group-hover:scale-105">
                <LinkOutlined className="text-sm" />
              </div>
              <span className="text-white font-bold text-lg">
                To<span className="text-primary">Short</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 max-w-[180px]">
              Fast, reliable URL shortening for everyone.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-gray-300 font-semibold text-xs mb-4 uppercase tracking-widest">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-500 hover:text-white text-sm transition-colors no-underline hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} ToShort. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            {[
              {
                href: "#",
                icon: <GithubOutlined className="text-lg" />,
                label: "GitHub",
              },
              {
                href: "#",
                icon: <TwitterOutlined className="text-lg" />,
                label: "Twitter",
              },
            ].map(({ href, icon, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
