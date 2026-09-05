type IconButtonProps = {
  label: string;
  children: string;
  onClick?: () => void;
};

export default function IconButton({
  label,
  children,
  onClick,
}: IconButtonProps) {
  return (
    <button
      className="paddle-icon-button"
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
