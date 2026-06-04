export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="project-specific-wrapper">
      {/* Any custom layout for properties goes here */}
      {children}
    </div>
  );
}
