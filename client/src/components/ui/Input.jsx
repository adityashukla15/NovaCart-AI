const Input = ({
  label,
  type = "text",
  placeholder,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        {...props}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
};

export default Input;