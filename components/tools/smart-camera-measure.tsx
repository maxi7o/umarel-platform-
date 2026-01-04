'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, Ruler, ScanLine, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SmartCameraMeasureProps {
    onCapture: (blob: Blob) => void;
    onClose: () => void;
}

export function SmartCameraMeasure({ onCapture, onClose }: SmartCameraMeasureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [aspectRatio, setAspectRatio] = useState<'4:3' | '16:9'>('4:3');
    const [isLevel, setIsLevel] = useState(false);
    const [tiltLR, setTiltLR] = useState(0); // Left-Right (Gamma)
    const [tiltFB, setTiltFB] = useState(0); // Front-Back (Beta)
    const [showGrid, setShowGrid] = useState(true);

    // Initialize Camera
    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment', // Rear camera preferred
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    }
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Camera Access Error:", err);
                toast.error("Could not access camera. Please allow permissions.");
                onClose();
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Device Orientation for Leveler
    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.gamma && event.beta) {
                setTiltLR(event.gamma); // -90 to 90
                setTiltFB(event.beta);  // -180 to 180

                // Check if roughly level (phone held upright or flat depending on mode)
                // Assuming upright portrait usage for wall photos
                const isStraight = Math.abs(event.gamma) < 5;
                setIsLevel(isStraight);
            }
        };

        window.addEventListener('deviceorientation', handleOrientation);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        toast.success("Photo Captured with Measurement Data");
                        onCapture(blob); // Pass back the image
                    }
                }, 'image/jpeg', 0.95);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
            {/* Close Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white z-50"
                onClick={onClose}
            >
                <X size={32} />
            </Button>

            {/* Viewfinder */}
            <div className="relative w-full max-w-md h-full max-h-[80vh] bg-black overflow-hidden flex items-center justify-center">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />

                {/* Guidelines Overlay */}
                {showGrid && (
                    <div className="absolute inset-0 pointer-events-none opacity-50">
                        {/* Rule of Thirds Grid */}
                        <div className="w-full h-full border border-white/30 flex flex-col">
                            <div className="flex-1 border-b border-white/20 flex">
                                <div className="flex-1 border-r border-white/20" />
                                <div className="flex-1 border-r border-white/20" />
                                <div className="flex-1" />
                            </div>
                            <div className="flex-1 border-b border-white/20 flex">
                                <div className="flex-1 border-r border-white/20" />
                                <div className="flex-1 border-r border-white/20" />
                                <div className="flex-1" />
                            </div>
                            <div className="flex-1 flex">
                                <div className="flex-1 border-r border-white/20" />
                                <div className="flex-1 border-r border-white/20" />
                                <div className="flex-1" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Leveler Indicator */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-white text-sm font-mono flex items-center gap-2 backdrop-blur-md">
                    <span className={isLevel ? "text-green-400" : "text-red-400"}>
                        {Math.round(tiltLR)}°
                    </span>
                    <span className="text-white/50">|</span>
                    <span>Align Vertical</span>
                </div>

                {/* Center Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 border-2 border-white/80 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                    </div>
                </div>

                {/* Simulated AR Measurement Prompt */}
                <div className="absolute bottom-32 bg-blue-600/90 text-white text-sm px-6 py-2 rounded-lg animate-pulse">
                    <ScanLine className="inline-block w-4 h-4 mr-2" />
                    Scanning for surfaces...
                </div>

                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 w-full h-32 bg-black/80 flex items-center justify-around pb-8 px-8">

                <Button
                    variant="ghost"
                    className="text-white flex-col gap-1 h-auto"
                    onClick={() => setShowGrid(!showGrid)}
                >
                    <Ruler className={cn("w-6 h-6", showGrid ? "text-orange-500" : "text-white")} />
                    <span className="text-[10px]">Grid</span>
                </Button>

                {/* Capture Button */}
                <button
                    onClick={capturePhoto}
                    className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 active:bg-white/50 transition-all"
                >
                    <div className="w-12 h-12 bg-white rounded-full" />
                </button>

                <Button variant="ghost" className="text-white flex-col gap-1 h-auto">
                    <RefreshCw className="w-6 h-6" />
                    <span className="text-[10px]">Flip</span>
                </Button>
            </div>
        </div>
    );
}
