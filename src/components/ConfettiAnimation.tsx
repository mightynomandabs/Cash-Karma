import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  velocity: {
    x: number;
    y: number;
    rotation: number;
  };
}

const ConfettiAnimation: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    // Create confetti pieces
    const newPieces: ConfettiPiece[] = [];
    const colors = ['#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', '#fb7185'];
    
    for (let i = 0; i < 50; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 8,
          y: Math.random() * 3 + 2,
          rotation: (Math.random() - 0.5) * 10
        }
      });
    }

    setPieces(newPieces);

    // Animate confetti
    const interval = setInterval(() => {
      setPieces(prevPieces => 
        prevPieces.map(piece => ({
          ...piece,
          x: piece.x + piece.velocity.x,
          y: piece.y + piece.velocity.y,
          rotation: piece.rotation + piece.velocity.rotation,
          velocity: {
            ...piece.velocity,
            y: piece.velocity.y + 0.1 // gravity
          }
        })).filter(piece => piece.y < window.innerHeight + 50)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            left: piece.x,
            top: piece.y,
            transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
            backgroundColor: piece.color,
            opacity: piece.y > window.innerHeight - 100 ? 0.3 : 1
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiAnimation; 