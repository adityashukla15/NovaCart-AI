const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}) => {
  const variants = {
    primary:
      "bg-black text-white hover:bg-gray-900",

    outline:
      "border border-gray-300 text-black hover:bg-gray-100",

    secondary:
      "bg-blue-600 text-white hover:bg-blue-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-full px-6 py-3 font-medium transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;