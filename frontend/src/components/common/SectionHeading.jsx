function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <span className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-100 dark:bg-brand-500/10 dark:text-brand-200 dark:ring-brand-500/20">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="section-title mt-2">{title}</h2>
        {description ? <p className="section-copy mt-3">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export default SectionHeading;
