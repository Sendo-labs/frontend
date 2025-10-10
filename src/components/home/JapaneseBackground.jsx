import React, { useEffect, useState, useRef } from "react";

export default function JapaneseBackground() {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Désactiver sur mobile pour les performances
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (isMobile) return; // Ne pas exécuter sur mobile
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const hiragana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
    const numbers = '0123456789';
    const chars = (katakana + hiragana + numbers).split('');
    
    const fontSize = 18;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    const speeds = Array(columns).fill(0).map(() => 0.4 + Math.random() * 0.8);
    
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `bold ${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        
        const gradient = ctx.createLinearGradient(0, drops[i] * fontSize, 0, (drops[i] + 1) * fontSize);
        gradient.addColorStop(0, '#FF6B2B');
        gradient.addColorStop(1, '#FF3333');
        ctx.fillStyle = gradient;
        
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FF5C1A';
        
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        ctx.shadowBlur = 0;
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i] += speeds[i];
      }
    }
    
    const interval = setInterval(draw, 45);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isMobile]);
  
  if (isMobile) return null;
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-40"
      style={{ zIndex: 0 }}
    />
  );
}