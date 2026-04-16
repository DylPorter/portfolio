export function EducationEntry({ logo, school, degree, date, children }: {
  logo: string;
  school: string;
  degree: string;
  date: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center mb-3">
        <img className="icon mr-4" src={logo} />
        <div className="flex flex-col gap-0.25">
          <p className="font-bold text-base">{school}</p>
          <p className="-mt-0.5">{degree}</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 transition-colors duration-500">{date}</p>
        </div>
      </div>
      {children && <div className="ml-16 pr-4 leading-relaxed">{children}</div>}
    </div>
  );
}
