import { useRef } from "react";

export type Position = {
  x: number;
  y: number;
};

interface Props {
  positionChanged: (position: Position | null) => void;
}

export const MouseTracker = ({ positionChanged }: Props) => {

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

    positionChanged(null);

  };

  const handleTouchEnd = (): void => {

    positionChanged(null);

  };



  return (
    <div className="rounded-3xl border-2 border-neutral-800 bg-neutral-900 shadow">
      <div
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleTouchEnd}
        className="
            relative h-[300px] w-full select-none rounded-2xl border border-neutral-300/70 bg-white
            touch-none overflow-hidden
            bg-[radial-gradient(theme(colors.neutral.300)_1px,transparent_1px)]
            [background-size:16px_16px]
          "
        aria-label="Wacom-like input surface"
      ></div>
    </div>
  );
};
