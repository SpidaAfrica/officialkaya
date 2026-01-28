/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
export const dynamic = "force-dynamic";

import { lazy, Suspense } from "react";
import { Skeleton } from "./skeleton";
const LazyLottieComponent = lazy(() => import("lottie-react"));

interface LottieProps {
    animationData: Record<string, unknown>;
    id: string;
    width?: number | string;
    height?: number | string;
    loop?: boolean;
}

export function LazyLottie({ animationData, id, loop, ...props }: LottieProps) {
    if (!animationData)
        return <Skeleton style={{ height: props.height, width: props.width }} />;

    return (
        <Suspense fallback={<Skeleton style={{ height: props.height, width: props.width }} />}>
            <LazyLottieComponent
                animationData={animationData}
                loop={loop}
                {...props}
            />
        </Suspense>
    );
}