import {
  ShaderBackdrop,
  type BackdropShaderSettings,
} from "@/components/shader-backdrop";

type PortfolioStageBackgroundProps = {
  settings: BackdropShaderSettings;
};

export function PortfolioStageBackground({
  settings,
}: PortfolioStageBackgroundProps) {
  return (
    <>
      <ShaderBackdrop settings={settings} />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[12] h-32 bg-gradient-to-b from-void to-transparent" />
    </>
  );
}
