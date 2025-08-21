const Logo = ({ className = "h-8 w-auto", textClassName = "text-xl font-bold text-gray-900" }) => {
  return (
    <div className="flex items-center space-x-2">
      <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="8" fill="#2563eb"/>
        <path d="M12 16h16v2H12v-2zm0 4h16v2H12v-2zm0 4h12v2H12v-2z" fill="white"/>
        <circle cx="30" cy="12" r="3" fill="#60a5fa"/>
      </svg>
      <span className={textClassName}>ReserveEase</span>
    </div>
  );
};

export default Logo;