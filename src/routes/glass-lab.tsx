import { createFileRoute } from "@tanstack/react-router";

import GlassTuningLab from "@/components/glass-tuning-lab";

export const Route = createFileRoute("/glass-lab")({
  component: GlassTuningLab,
});
