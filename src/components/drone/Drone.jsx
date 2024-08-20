import React, { useEffect } from 'react'
import * as settings from '../../helpers/settings';
export function Drone({ canvasWidth, position, setPosition, speed, setSpeed, maxSpeed}) {
    
    const halfWidth = settings.droneWidth / 2;
    const friction = 0.98;
    const points = `
    ${position},${settings.droneHeight}
    ${position - halfWidth},0
    ${position + halfWidth},0
    `;
    

    useEffect(() => {
        const updateDronePosition = () => {
            setPosition(prevPosition => {
                let newPosition = prevPosition + speed;
                newPosition = Math.max(0, Math.min(500, newPosition));
                return newPosition;
            });
        };

        const applyFriction = () => {
            setSpeed(prevSpeed => prevSpeed * friction);
        };

        const handleKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                setSpeed(prevSpeed => Math.max(prevSpeed - 1, -maxSpeed));
            } else if (event.key === 'ArrowRight') {
                setSpeed(prevSpeed => Math.min(prevSpeed + 1, maxSpeed));
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        const animationId = requestAnimationFrame(() => {
            updateDronePosition();
            applyFriction();
        });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            cancelAnimationFrame(animationId);
        };
    }, [speed, position]);

    return (
        <svg
            width={canvasWidth}
            height={settings.droneHeight}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 10,
            }}
        >
            <polygon points={points} fill="green" stroke="black" strokeWidth="2" />
        </svg>
    );
}
