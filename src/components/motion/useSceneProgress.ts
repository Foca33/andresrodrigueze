"use client";

import type { RefObject } from "react";
import { useScroll, useTransform, type MotionValue } from "motion/react";

type Offset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

/**
 * Scroll progress (0..1) of a target element, as a plain JS-driven MotionValue.
 *
 * Why the identity mapper: Motion can hand `useTransform(scrollProgress, range, output)` to the
 * browser as a native scroll-linked WAAPI animation. When `range` doesn't span 0..1 that path
 * appends an implicit final keyframe that snaps back to the element's base style, so scenes
 * "un-fade" after they finish. Routing through a function mapper keeps every derived value in
 * Motion's frame loop, where clamping behaves exactly as written.
 */
export function useSceneProgress(target: RefObject<HTMLElement | null>, offset: Offset): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target, offset });
  return useTransform(scrollYProgress, (v) => v);
}
