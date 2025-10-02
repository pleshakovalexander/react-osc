import { useRef } from "react";

export type Position = {
  x: number;
  y: number;
};

interface Props {
  positionChanged: (position: Position | null) => void;
}

export const MouseTracker = ({ positionChanged }: Props) => {
  const isAllowEmitMove = useRef<boolean>(false);

  const updatePosition = (
    clientX: number,
    clientY: number,
    rect: DOMRect
  ): void => {
    const data: Position = {
      x: Math.max(0, Math.min(clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(clientY - rect.top, rect.height)),
    };

    if (isAllowEmitMove.current) {
      positionChanged(data);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();

    updatePosition(e.clientX, e.clientY, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const t = e.touches[0];
    if (t) {
      updatePosition(t.clientX, t.clientY, rect);
    }
  };

  const handleMouseLeave = (): void => {
    if (isAllowEmitMove.current) {
      positionChanged(null);
    }
  };

  const handleTouchEnd = (): void => {
    if (isAllowEmitMove.current) {
      positionChanged(null);
    }
  };

  const handleClick = (): void => {
    isAllowEmitMove.current = true;
  };

  return (
    <div className="mx-auto w-[420px] max-w-full p-4">
      <div className="rounded-3xl border-2 border-neutral-800 bg-neutral-900 p-3 shadow">
        <div
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseLeave={handleMouseLeave}
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
          className="
            relative h-[300px] w-full select-none rounded-2xl border border-neutral-300/70 bg-white
            touch-none overflow-hidden
            bg-[radial-gradient(theme(colors.neutral.300)_1px,transparent_1px)]
            [background-size:16px_16px]
          "
          aria-label="Wacom-like input surface"
        ></div>
      </div>
    </div>
  );
};
