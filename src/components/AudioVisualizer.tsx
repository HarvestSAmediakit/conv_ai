import React, { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  stream?: MediaStream | null;
  analyser?: AnalyserNode | null;
  isActive: boolean;
  color?: string;
  glow?: boolean;
  shape?: "bars" | "orb";
}

export default function AudioVisualizer({
  stream,
  analyser: analyserProp,
  isActive,
  color = "#3b82f6",
  glow = false,
  shape = "bars"
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        return;
    }

    let analyser: AnalyserNode | null = null;
    let localAudioContext: AudioContext | null = null;

    if (analyserProp) {
      analyser = analyserProp;
    } else if (stream) {
      localAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 44100
      });
      const source = localAudioContext.createMediaStreamSource(stream);
      analyser = localAudioContext.createAnalyser();
      
      analyser.fftSize = 64;
      source.connect(analyser);
    } else {
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      analyser!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      if (shape === "orb") {
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avgVolume = sum / bufferLength;
        const normalizedVolume = avgVolume / 255; // 0 to 1

        const centerX = width / 2;
        const centerY = height / 2;
        
        // Base radius + volume-dependent pulsation radius
        const minRadius = Math.min(width, height) * 0.15;
        const pulseRadius = minRadius + (normalizedVolume * Math.min(width, height) * 0.35);

        if (glow) {
          ctx.shadowBlur = 30 + normalizedVolume * 40;
          ctx.shadowColor = color;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          centerX, centerY, pulseRadius * 0.2,
          centerX, centerY, pulseRadius
        );
        // Make the core whiter, and the outer part the main color
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.3, color);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
        ctx.fill();
        
      } else {
        const barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * height;

          // Use a gradient or a solid color with varying alpha
          ctx.fillStyle = color;
          
          if (glow) {
            ctx.shadowBlur = 12;
            ctx.shadowColor = color;
          } else {
            ctx.shadowBlur = 0;
          }
          
          // Draw a rounded-ish bar
          const roundedHeight = Math.max(4, barHeight);
          ctx.beginPath();
          const centerX = x + barWidth / 2;
          const centerY = height / 2;
          
          ctx.roundRect(
              x + 2, 
              centerY - roundedHeight / 2, 
              barWidth - 4, 
              roundedHeight, 
              4
          );
          ctx.fill();

          x += barWidth;
        }
      }

      ctx.shadowBlur = 0; // reset
      requestRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (localAudioContext && localAudioContext.state !== 'closed') {
        localAudioContext.close();
      }
    };
  }, [stream, analyserProp, isActive, color, glow]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={80}
      className="w-full h-full opacity-80"
    />
  );
}
