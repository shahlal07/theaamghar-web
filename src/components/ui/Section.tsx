import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";

// Every landing-page section shares the same vertical rhythm (120px top/
// bottom) so the page reads as one consistent system rather than
// individually-spaced blocks -- per the design system's spacing rule.
export function Section({
  children,
  className,
  containerClassName,
  id,
  "aria-label": ariaLabel,
  container = true,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  "aria-label"?: string;
  container?: boolean;
}) {
  return (
    <section id={id} aria-label={ariaLabel} className={cn("py-20 lg:py-[120px]", className)}>
      {container ? <Container className={containerClassName}>{children}</Container> : children}
    </section>
  );
}
