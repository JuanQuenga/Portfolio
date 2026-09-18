#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

action="${1:-}"

case "$action" in
  dev)
    pnpm dev --host 127.0.0.1
    ;;
  *)
    echo "Usage: $0 {dev}" >&2
    exit 64
    ;;
esac
