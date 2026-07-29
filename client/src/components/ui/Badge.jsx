const Badge = ({
  children,
}) => {
  return (
    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
      {children}
    </span>
  );
};

export default Badge;