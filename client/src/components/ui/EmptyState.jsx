const EmptyState = ({
  title,
  subtitle,
}) => {
  return (
    <div className="py-20 text-center">
      <h3 className="text-3xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-gray-500">
        {subtitle}
      </p>
    </div>
  );
};

export default EmptyState;