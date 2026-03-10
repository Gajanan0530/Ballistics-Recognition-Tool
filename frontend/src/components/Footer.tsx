import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 Ballistics Recognition Tool. Research purposes only.</p>
          <div className="flex items-center gap-4">
            <Link to="/dataset" className="hover:text-primary transition-colors">
              Dataset
            </Link>
            <Link to="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <a href="mailto:contact@example.com" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
