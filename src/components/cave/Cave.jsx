import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Drone } from '../drone/Drone';
import GaugeComponent from 'react-gauge-component';
import * as settings from '../../helpers/settings';

export function Cave({ caveData, gameScreenHeight, lastSegment, setGameOver, gameOver, wallsHeight, complexity }) {
  const [dronePosition, setDronePosition] = useState(250);
  const [verticalSpeed, setVerticalSpeed] = useState(0);
  const [verticalOffset, setVerticalOffset] = useState(0);
  const [horizontalSpeed, setHorizontalSpeed] = useState(0);
  const [passedSegments, setPassedSegments] = useState(0);

  const score = useRef(0)
  const canvasRef = useRef(null);

  const drawCave = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    caveData.forEach((pair, index) => {
      const [leftWallPosition, rightWallPosition] = pair;
      const y = (index * wallsHeight) - verticalOffset;
      if (lastSegment !== 0 && y < lastSegment) {
        setGameOver(true, "win", score.current);
      } else {
        const leftX = settings.centerX + Number(leftWallPosition);
        const rightX = settings.centerX + Number(rightWallPosition);
        if (index > 0) {
          const [prevLeftWallPosition, prevRightWallPosition] = caveData[index - 1];
          const prevY = ((index - 1) * wallsHeight) - verticalOffset;

          const prevLeftX = settings.centerX + Number(prevLeftWallPosition)
          const prevRightX = settings.centerX + Number(prevRightWallPosition)

          checkCollision(y);

          // Drawing the left wall
          ctx.beginPath();
          ctx.moveTo(prevLeftX, prevY);
          ctx.lineTo(leftX, y);
          ctx.lineTo(settings.maxLeftXOffset, y);
          ctx.lineTo(settings.maxLeftXOffset, prevY);
          ctx.closePath();
          ctx.fillStyle = "grey";
          ctx.fill();
          ctx.strokeStyle = "grey";
          ctx.stroke();

          // Drawing the right wall
          ctx.beginPath();
          ctx.moveTo(prevRightX, prevY);
          ctx.lineTo(rightX, y);
          ctx.lineTo(settings.maxRightXOffset, y);
          ctx.lineTo(settings.maxRightXOffset, prevY);
          ctx.closePath();
          ctx.fillStyle = "grey";
          ctx.fill();
          ctx.strokeStyle = "grey";
          ctx.stroke();
        }
      }
    })
  }

  const checkCollision = (y) => {
    const wallY = Math.floor(verticalOffset / wallsHeight);
    if (wallY < caveData.length) {
      const [leftWallPosition, rightWallPosition] = caveData[wallY];
      const leftX = 250 + Number(leftWallPosition);
      const rightX = 250 + Number(rightWallPosition);
      const droneLeftX = dronePosition - settings.droneWidth / 2;
      const droneRightX = dronePosition + settings.droneWidth / 2;
      const droneTopX = dronePosition;
      if (
        (droneLeftX <= leftX && y >= 0 && y <= settings.droneHeight) ||

        (droneRightX >= rightX && y >= 0 && y <= settings.droneHeight) ||

        (droneTopX <= leftX && y >= 0 && y <= settings.droneHeight) ||
        (droneTopX >= rightX && y >= 0 && y <= settings.droneHeight)) {
        setGameOver(true, "lost");
      }
    }
  }

  const updateVerticalOffset = useCallback(() => {
    setVerticalOffset(prevOffset => prevOffset + verticalSpeed);
  }, [verticalSpeed]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'ArrowUp') {
      setVerticalSpeed(prevSpeed => Math.min(prevSpeed + 0.5, settings.maxVerticalSpeed));
    } else if (event.key === 'ArrowDown') {
      setVerticalSpeed(prevSpeed => Math.max(prevSpeed - 0.5, 0));
    }
  }, []);


  useEffect(() => {
    if (!gameOver) {
      const newPassedSegments = Math.floor(verticalOffset / wallsHeight);
      if (newPassedSegments > passedSegments) {
        const scoreIncrement = Math.floor(settings.scoreMultiplicator * (verticalSpeed + complexity));
        score.current += scoreIncrement;
        setPassedSegments(newPassedSegments);
      }
    }
  }, [verticalOffset, wallsHeight, verticalSpeed, complexity, passedSegments]);

  useEffect(() => {
    if (!gameOver) {
      drawCave();
    }
    window.addEventListener('keydown', handleKeyDown);
    const animationId = requestAnimationFrame(() => {
      updateVerticalOffset();
    });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationId);
    };
  }, [drawCave, gameOver])




  return (
    <>
      <div className='relative'>
        <h1 className='font-bold uppercase text-black absolute -top-[30px]'>current score : {score.current}</h1>
        <div className='absolute -left-[300px] bg-slate-200'>
          <div>
            <h1 className='font-bold uppercase text-center'>Vertical speed</h1>
            <GaugeComponent id="verticalSpeed" value={verticalSpeed} maxValue={settings.maxVerticalSpeed} arc={{ subArcs: [{ limit: settings.maxVerticalSpeed, color: "green" }] }} />
          </div>
          <div>
            <h1 className='font-bold uppercase text-center'>Horizontal speed</h1>
            <GaugeComponent id="verticalSpeed" value={horizontalSpeed} maxValue={settings.maxHorizontalSpeed} minValue={-settings.maxHorizontalSpeed} arc={{ subArcs: [{ limit: settings.maxHorizontalSpeed, color: "blue" }] }} />
          </div>
        </div>
        <canvas ref={canvasRef} id="caveCanvas" width={500} height={gameScreenHeight}></canvas>
        <Drone canvasWidth={500} position={dronePosition} setPosition={setDronePosition} speed={horizontalSpeed} setSpeed={setHorizontalSpeed} maxSpeed={settings.maxHorizontalSpeed} />
      </div>
    </>
  )
}
