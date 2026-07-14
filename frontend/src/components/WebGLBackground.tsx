"use client";

import { useEffect, useRef, useState } from 'react';
import { WebGLBackground } from '../app/scene/scene';

export default function WebGLBackgroundComponent() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        setPrefersReducedMotion(
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
    }, []);

    useEffect(() => {
        if (prefersReducedMotion || !containerRef.current) return;

        const bg = new WebGLBackground(containerRef.current);
        bg.init();

        return () => {
            bg.destroy();
        };
    }, [prefersReducedMotion]);

    if (prefersReducedMotion) {
        return (
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #050508 100%)' }}
                aria-hidden="true"
            />
        );
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    );
}
