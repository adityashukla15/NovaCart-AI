const SectionHeading = ({
  title,
  subtitle,
}) => {
  return (
    <div className="mb-10">
      <h2 className="text-4xl font-bold">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;