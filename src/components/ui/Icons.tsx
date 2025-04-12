import { type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

const defaultProps: Omit<SVGProps<SVGSVGElement>, "children" | "size"> = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function FolderIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function DocumentIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function SpreadsheetIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <rect x="8" y="12" width="8" height="8" />
      <line x1="8" y1="16" x2="16" y2="16" />
      <line x1="12" y1="12" x2="12" y2="20" />
    </svg>
  );
}

export function PDFIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15v-6h6v6H9z" />
    </svg>
  );
}

export function GenericFileIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export function HomeIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function SharedIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function ClockIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function StarIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function TrashIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

export function StorageIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9" />
      <path d="M3 10h18" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    </svg>
  );
}

export function PlusIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <path d="M9 12h6" />
      <path d="M12 9v6" />
    </svg>
  );
}

export function SearchIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function HeartIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export function DotsIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      {...defaultProps}
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}
