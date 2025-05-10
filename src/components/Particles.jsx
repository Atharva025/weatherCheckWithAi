import { useEffect, useRef } from 'react';

function Particles({ weatherCondition, isDay }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        // Set canvas size
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // Determine particle type based on weather
        const condition = weatherCondition?.toLowerCase() || '';
        const particleType = getParticleType(condition, isDay);

        // Create particles
        const particleCount = getParticleCount(particleType);
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle(particleType, canvas.width, canvas.height));
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                updateParticle(particle, particleType, canvas.width, canvas.height);
                drawParticle(ctx, particle, particleType);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [weatherCondition, isDay]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0"
        />
    );
}

// Helper functions
function getParticleType(condition, isDay) {
    if (condition.includes('rain') || condition.includes('drizzle')) return 'rain';
    if (condition.includes('snow')) return 'snow';
    if (condition.includes('fog') || condition.includes('mist')) return 'fog';
    if (isDay && (condition.includes('sunny') || condition.includes('clear'))) return 'sun';
    if (!isDay && condition.includes('clear')) return 'stars';
    return 'default';
}

function getParticleCount(type) {
    switch (type) {
        case 'rain': return 200;
        case 'snow': return 150;
        case 'fog': return 100;
        case 'sun': return 50;
        case 'stars': return 200;
        default: return 50;
    }
}

function createParticle(type, width, height) {
    const baseParticle = {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 1
    };

    switch (type) {
        case 'rain':
            return {
                ...baseParticle,
                speed: Math.random() * 5 + 10,
                opacity: Math.random() * 0.3 + 0.3
            };
        case 'snow':
            return {
                ...baseParticle,
                speed: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.5,
                angle: Math.random() * Math.PI * 2
            };
        case 'fog':
            return {
                ...baseParticle,
                size: Math.random() * 50 + 30,
                speed: Math.random() * 0.2,
                opacity: Math.random() * 0.1 + 0.05
            };
        case 'sun':
            return {
                ...baseParticle,
                size: Math.random() * 4 + 1,
                opacity: Math.random() * 0.4 + 0.1,
                speed: Math.random() * 0.5 + 0.2
            };
        case 'stars':
            return {
                ...baseParticle,
                size: Math.random() * 3 + 0.5,
                opacity: Math.random() * 0.5 + 0.3,
                twinkle: Math.random() * 0.01 + 0.005,
                twinkleDir: Math.random() > 0.5 ? 1 : -1
            };
        default:
            return {
                ...baseParticle,
                speed: Math.random() * 1 + 0.5,
                opacity: Math.random() * 0.3 + 0.2
            };
    }
}

function updateParticle(particle, type, width, height) {
    switch (type) {
        case 'rain':
            particle.y += particle.speed;
            particle.x -= particle.speed / 2;
            if (particle.y > height) {
                particle.y = -20;
                particle.x = Math.random() * width;
            }
            break;
        case 'snow':
            particle.y += particle.speed;
            particle.x += Math.sin(particle.angle) * 1.5;
            particle.angle += 0.01;
            if (particle.y > height) {
                particle.y = -20;
                particle.x = Math.random() * width;
            }
            break;
        case 'fog':
            particle.x += particle.speed;
            if (particle.x > width) {
                particle.x = -100;
                particle.y = Math.random() * height;
            }
            break;
        case 'sun':
            particle.y -= particle.speed;
            if (particle.y < -20) {
                particle.y = height + 20;
                particle.x = Math.random() * width;
            }
            break;
        case 'stars':
            particle.opacity += particle.twinkle * particle.twinkleDir;
            if (particle.opacity > 0.9 || particle.opacity < 0.3) {
                particle.twinkleDir *= -1;
            }
            break;
        default:
            particle.y += particle.speed;
            if (particle.y > height) {
                particle.y = -20;
                particle.x = Math.random() * width;
            }
            break;
    }
}

function drawParticle(ctx, particle, type) {
    ctx.beginPath();

    switch (type) {
        case 'rain':
            ctx.strokeStyle = `rgba(200, 230, 255, ${particle.opacity})`;
            ctx.lineWidth = particle.size / 3;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle.x + particle.speed / 2, particle.y + particle.speed * 1.5);
            ctx.stroke();
            break;
        case 'snow':
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'fog':
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'sun':
            ctx.fillStyle = `rgba(255, 235, 150, ${particle.opacity})`;
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'stars':
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;
        default:
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;
    }
}

export default Particles;