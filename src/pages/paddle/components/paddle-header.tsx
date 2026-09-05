import IconButton from "./icon-button";

type PaddleHeaderProps = {
  isTabScreen: boolean;
  title?: string;
  onHome: () => void;
  onNotify: () => void;
};

export default function PaddleHeader({
  isTabScreen,
  title,
  onHome,
  onNotify,
}: PaddleHeaderProps) {
  return (
    <header className="paddle-header">
      {isTabScreen ? (
        <>
          <div
            className="paddle-brand"
            onClick={onHome}
            role="button"
            tabIndex={0}
          >
            <span className="paddle-mark" aria-hidden="true">
              P
            </span>
            <span>Paddle Sport</span>
          </div>
          <IconButton label="Thông báo" onClick={onNotify}>
            ◌
          </IconButton>
        </>
      ) : (
        <>
          <IconButton label="Quay lại" onClick={onHome}>
            ‹
          </IconButton>
          <h1>{title}</h1>
          <span className="paddle-header-space" />
        </>
      )}
    </header>
  );
}
