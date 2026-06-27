import type {
  ComponentProps,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
import type { LiquidGlassHandle } from "liquid-glass-web-react";

export {
  DEFAULT_OPTIONS,
  LiquidGlassEngine,
  computeDisplacementMap,
  renderDisplacementMap,
  type LiquidGlassHandle,
} from "liquid-glass-web-react";

type BaseLiquidGlassProps = ComponentProps<typeof import("liquid-glass-web-react").LiquidGlass>;

export type SquircleLiquidGlassProps = BaseLiquidGlassProps & {
  shape?: "rounded" | "squircle";
  squircleExponent?: number;
  refractionTarget?: ReactNode;
};

export const LiquidGlass: ForwardRefExoticComponent<
  SquircleLiquidGlassProps & RefAttributes<LiquidGlassHandle>
>;
