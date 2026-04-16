export function ExperienceEntry({ logo, company, role, date, description }: {
  logo: string;
  company: string;
  role: string;
  date: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center mb-3">
        <img className="icon mr-4" src={logo} />
        <div className="flex flex-col gap-0.25">
          <p className="font-bold text-base">{company}</p>
          <p className="-mt-0.5">{role}</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 transition-colors duration-500">{date}</p>
        </div>
      </div>
      <p className="ml-16 pr-4 leading-relaxed">{description}</p>
    </div>
  );
}
