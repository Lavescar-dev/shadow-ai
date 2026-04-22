export const PRODUCT_NAME = "Shadow AI";

export const INTERNAL_ROUTER_MODEL = "shadow-router";
export const LEGACY_INTERNAL_ROUTER_MODEL = "nexus-router";

export function isInternalRouterModel(value: unknown): value is string {
  return (
    value === INTERNAL_ROUTER_MODEL || value === LEGACY_INTERNAL_ROUTER_MODEL
  );
}

export const CANVAS_PREVIEW_SOURCE = "shadow-canvas-preview";
export const LEGACY_CANVAS_PREVIEW_SOURCE = "nexus-canvas-preview";

export function isCanvasPreviewSource(value: unknown): value is string {
  return (
    value === CANVAS_PREVIEW_SOURCE || value === LEGACY_CANVAS_PREVIEW_SOURCE
  );
}
