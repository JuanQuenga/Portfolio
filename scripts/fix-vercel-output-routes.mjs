import { readFile, writeFile } from "node:fs/promises";

const configPath = ".vercel/output/config.json";

let config;

try {
  config = JSON.parse(await readFile(configPath, "utf8"));
} catch (error) {
  if (error?.code === "ENOENT") {
    process.exit(0);
  }
  throw error;
}

if (Array.isArray(config.routes)) {
  config.routes = config.routes.map((route) =>
    route &&
    route.headers &&
    !route.dest &&
    !route.handle &&
    !route.status &&
    route.continue !== true
      ? { ...route, continue: true }
      : route,
  );

  const filesystemRoute = config.routes.find(
    (route) => route && route.handle === "filesystem",
  );
  const serverRoute = config.routes.find(
    (route) => route && route.dest === "/__server",
  );

  if (filesystemRoute && serverRoute) {
    const withoutFilesystem = config.routes.filter(
      (route) => route !== filesystemRoute && route !== serverRoute,
    );
    const firstFallbackIndex = withoutFilesystem.findIndex(
      (route) =>
        route &&
        (route.handle === "error" ||
          route.status === 404),
    );
    const insertIndex =
      firstFallbackIndex === -1 ? withoutFilesystem.length : firstFallbackIndex;

    config.routes = [
      ...withoutFilesystem.slice(0, insertIndex),
      filesystemRoute,
      serverRoute,
      ...withoutFilesystem.slice(insertIndex),
    ];

    await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
    console.log("Moved Vercel filesystem and server routes before error fallbacks.");
  }
}
