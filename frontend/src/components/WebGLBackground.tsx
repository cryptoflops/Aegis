"use client";

import { useEffect, useRef } from 'react';
import { WebGLBackground } from '../app/scene/scene';

export default function WebGLBackgroundComponent() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const bg = new WebGLBackground(containerRef.current);
        bg.init();

        return () => {
            bg.destroy();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    );
}
