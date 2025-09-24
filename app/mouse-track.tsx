import { useState } from "react";

export type Position = {
  x: number;
  y: number;
};

export const MouseTracker = ({
  positionChanged,
}: {
  positionChanged: (position: Position) => void;
}) => {
  const [position, setPosition] = useState<Position | null>(null);

  const updatePosition = (
    clientX: number,
    clientY: number,
    rect: DOMRect
  ): void => {
    const data: Position = {
      x: Math.max(0, Math.min(clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(clientY - rect.top, rect.height)),
    };

    positionChanged(data);

    setPosition(data);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    // updatePosition(e.clientX, e.clientY, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const t = e.touches[0];
    // if (t) updatePosition(t.clientX, t.clientY, rect);
  };

  const handleMouseLeave = (): void => {
    setPosition(null);
  };

  const handleTouchEnd = (): void => {
    setPosition(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();

    updatePosition(e.clientX, e.clientY, rect);
  };

  return (
    <div className="mx-auto w-[420px] max-w-full p-4">
      {/* Outer tablet frame */}
      <div className="rounded-3xl border-2 border-neutral-800 bg-neutral-900 p-3 shadow">
        {/* Inner work surface */}
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
        >
          {/* Coordinates pill */}
          <div className="absolute left-3 top-3 rounded-full bg-neutral-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {position !== null
              ? `X: ${Math.round(position.x)}  Y: ${Math.round(position.y)}`
              : "Outside"}
          </div>

          {/* Follower dot (only if inside) */}
          {position !== null && (
            <div
              className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-emerald-500 ring-2 ring-white/70 shadow"
              style={{ top: position.y, left: position.x }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
