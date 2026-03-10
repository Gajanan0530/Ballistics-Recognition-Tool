import { Link, useLocation } from "react-router-dom";
import { Crosshair } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dataset", label: "Dataset" },
  { href: "/upload", label: "Upload & Detect" },
  { href: "/results", label: "Results" },
  { href: "/about", label: "About" },
];

export const Header = () => {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Crosshair className="w-7 h-7 text-primary group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              Ballistics Recognition Tool
            </span>
            <span className="text-xl font-bold text-foreground sm:hidden">BRT</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                <span className={location.pathname === link.href ? "text-primary" : "text-muted-foreground"}>
                  {link.label}
                </span>
                {location.pathname === link.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
