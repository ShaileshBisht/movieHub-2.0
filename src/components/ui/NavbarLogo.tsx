import { Film } from "lucide-react";

interface NavbarLogoProps {
  onClick: () => void;
  className?: string;
}

export default function NavbarLogo({ onClick, className = "" }: NavbarLogoProps) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity ${className}`}>
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
        <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-white">
        Movie<span className="text-purple-400">Hub</span>
      </h1>
    </button>
  );
}
