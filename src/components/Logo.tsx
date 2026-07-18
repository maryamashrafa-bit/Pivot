import Link from "next/link";

export default function Logo({ href = "/dashboard" }: { href?: string }) {
  return (
    <div className="logo">
      <Link href={href}>
        <div className="lm">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <path d="M11 3L11 11L18 11" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M11 11L4 18" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="11" cy="11" r="2.5" fill="#fff" />
          </svg>
        </div>
        <div>
          <span className="lt">Pivot</span>
          <span className="ltag"> — your thinking partner</span>
        </div>
      </Link>
    </div>
  );
}
