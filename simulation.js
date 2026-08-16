const canvas = document.getElementById('oscillatorCanvas');
const ctx = canvas.getContext('2d');

// Element links
const massInput = document.getElementById('mass');
const kInput = document.getElementById('springK');
const dampingInput = document.getElementById('damping');
const resetBtn = document.getElementById('resetBtn');

// Simulation Variables
let t = 0;
const dt = 0.05; // Progression speed loop
let amplitude = 120; // Structural pixel offset bound

function draw() {
    // Extract real-time inputs
    const m = parseFloat(massInput.value);
    const k = parseFloat(kInput.value);
    const b = parseFloat(dampingInput.value);

    // Live update UI panel labels
    document.getElementById('mass-val').innerText = m;
    document.getElementById('k-val').innerText = k;
    document.getElementById('damping-val').innerText = b;

    // Direct physics calculations
    const omega0 = Math.sqrt(k / m);
    const gamma = b / (2 * m);
    
    // Check for real numbers if heavily overdamped
    const radical = (omega0 * omega0) - (gamma * gamma);
    const omega = radical > 0 ? Math.sqrt(radical) : 0;

    // Display updates
    document.getElementById('omega-val').innerText = omega.toFixed(2);
    document.getElementById('period-val').innerText = omega > 0 ? (2 * Math.PI / omega).toFixed(2) : "∞";

    // Clear frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const originX = 50;

    // Compute exact displacement based on Damped Wave equations
    const currentX = originX + 250 + (amplitude * Math.exp(-gamma * t) * Math.cos(omega * t));

    // 1. Draw Ceiling/Anchor Plate
    ctx.fillStyle = '#475569';
    ctx.fillRect(originX, centerY - 40, 20, 80);

    // 2. Draw Spring Coils
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(originX + 20, centerY);
    
    const coils = 30;
    const springLength = currentX - (originX + 20);
    for (let i = 0; i <= coils; i++) {
        const px = (originX + 20) + (springLength * (i / coils));
        const py = centerY + (i % 2 === 0 ? -15 : 15) * (i === 0 || i === coils ? 0 : 1);
        ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 3. Draw Weight Mass Box
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(currentX, centerY - 25, 50, 50);

    t += dt;
    requestAnimationFrame(draw);
}

resetBtn.addEventListener('click', () => { t = 0; });

// Initialize loop execution
draw();
