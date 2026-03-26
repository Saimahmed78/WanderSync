import { Link } from "react-router";

export function CtaButton({ to, className, children }) {
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export default CtaButton;
