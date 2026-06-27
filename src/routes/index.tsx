import { createFileRoute } from "@tanstack/react-router";

import PortfolioExperience from "@/components/portfolio-experience";

export const Route = createFileRoute("/")({
  component: PortfolioExperience,
});
