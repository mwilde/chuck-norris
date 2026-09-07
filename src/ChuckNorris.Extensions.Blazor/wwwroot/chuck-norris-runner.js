// Chuck Norris Runner — canvas-based side-scrolling runner game
// Chuck Norris doesn't run. He advances toward the enemy.

const CANVAS_W = 480;
const CANVAS_H = 200;
const GROUND = CANVAS_H - 40;
const PLAYER_W = 40;
const PLAYER_H = 52;
const PLAYER_X = 60;
const OBSTACLE_W = 28;
const OBSTACLE_MIN_H = 32;
const OBSTACLE_MAX_H = 56;
const GRAVITY = 0.55;
const JUMP_FORCE = -13;
const INITIAL_SPEED = 4.5;
const SPEED_INCREMENT = 0.0008;
const OBSTACLE_MIN_GAP = 280;
const OBSTACLE_MAX_GAP = 520;

const COLOR_BG = '#0d0d0d';
const COLOR_BG2 = '#161616';
const COLOR_GROUND = '#1e1e1e';
const COLOR_GROUND_LINE = '#b22222';
const COLOR_DOJO_LINE = '#2a2a2a';
const COLOR_PLAYER = '#f0f0f0';
const COLOR_BEARD = '#c8a97a';
const COLOR_BOOT = '#8b5c2a';
const COLOR_BELT = '#b22222';
const COLOR_NINJA = '#222222';
const COLOR_NINJA_ACCENT = '#b22222';
const COLOR_SCORE = '#666666';
const COLOR_TEXT = '#f0f0f0';
const COLOR_FLASH = 'rgba(178,34,34,0.55)';

let instances = {};

export function init(canvasId, dotnetRef) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    const state = {
        dotnetRef,
        running: false,
        dead: false,
        score: 0,
        speed: INITIAL_SPEED,
        frame: 0,
        bgOffset: 0,
        deathFlash: 0,
        particles: [],
        player: { x: PLAYER_X, y: GROUND - PLAYER_H, vy: 0, onGround: true, leg: 0 },
        obstacles: [],
        nextObstacle: randomGap(),
        animId: null,
    };

    const onKey = (e) => {
        if (['ArrowUp', 'ArrowDown', 'Space', ' '].includes(e.key)) e.preventDefault();
        if ((e.key === 'ArrowUp' || e.key === ' ') && state.running && !state.dead) jump(state);
    };
    document.addEventListener('keydown', onKey);
    canvas.addEventListener('touchstart', () => { if (state.running && !state.dead) jump(state); }, { passive: true });

    instances[canvasId] = { state, ctx, canvas, onKey };
    drawIdle(ctx, state);
}

export function startGame(canvasId) {
    const inst = instances[canvasId];
    if (!inst) return;
    const { state } = inst;
    state.running = true;
    state.dead = false;
    state.score = 0;
    state.speed = INITIAL_SPEED;
    state.frame = 0;
    state.bgOffset = 0;
    state.deathFlash = 0;
    state.particles = [];
    state.player = { x: PLAYER_X, y: GROUND - PLAYER_H, vy: 0, onGround: true, leg: 0 };
    state.obstacles = [];
    state.nextObstacle = randomGap();
    if (state.animId) cancelAnimationFrame(state.animId);
    loop(inst);
}

export function dispose(canvasId) {
    const inst = instances[canvasId];
    if (!inst) return;
    if (inst.state.animId) cancelAnimationFrame(inst.state.animId);
    document.removeEventListener('keydown', inst.onKey);
    delete instances[canvasId];
}

function jump(state) {
    if (state.player.onGround) {
        state.player.vy = JUMP_FORCE;
        state.player.onGround = false;
        // Kick particles
        for (let i = 0; i < 6; i++) {
            state.particles.push({
                x: state.player.x + PLAYER_W,
                y: state.player.y + PLAYER_H * 0.6,
                vx: 2 + Math.random() * 3,
                vy: -2 + Math.random() * 4,
                life: 18 + Math.random() * 12,
                maxLife: 30,
                emoji: Math.random() < 0.5,
            });
        }
    }
}

function randomGap() {
    return OBSTACLE_MIN_GAP + Math.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP);
}

function loop(inst) {
    const { state, ctx } = inst;
    update(state);
    draw(ctx, state);
    if (!state.dead || state.deathFlash > 0) {
        state.animId = requestAnimationFrame(() => loop(inst));
    } else {
        state.dotnetRef.invokeMethodAsync('OnGameOver', Math.floor(state.score));
    }
}

function update(state) {
    state.frame++;
    state.score += state.speed * 0.05;
    state.speed += SPEED_INCREMENT * state.speed;
    state.bgOffset = (state.bgOffset + state.speed * 0.3) % 80;

    const p = state.player;
    if (!state.dead) {
        p.vy += GRAVITY;
        p.y += p.vy;
        if (p.y >= GROUND - PLAYER_H) {
            p.y = GROUND - PLAYER_H;
            p.vy = 0;
            p.onGround = true;
        }
        if (p.onGround) p.leg = Math.floor(state.frame / 5) % 2;
    }

    // Obstacles
    if (!state.dead) {
        state.nextObstacle -= state.speed;
        if (state.nextObstacle <= 0) {
            const h = OBSTACLE_MIN_H + Math.random() * (OBSTACLE_MAX_H - OBSTACLE_MIN_H);
            state.obstacles.push({ x: CANVAS_W + 20, h });
            state.nextObstacle = randomGap();
        }
    }
    for (const obs of state.obstacles) obs.x -= state.speed;
    state.obstacles = state.obstacles.filter(o => o.x + OBSTACLE_W > -10);

    // Particles
    for (const pt of state.particles) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.2;
        pt.life--;
    }
    state.particles = state.particles.filter(pt => pt.life > 0);

    // Death flash
    if (state.dead && state.deathFlash > 0) state.deathFlash--;

    // Collision
    if (!state.dead) {
        for (const obs of state.obstacles) {
            if (
                p.x + PLAYER_W - 8 > obs.x + 4 &&
                p.x + 8 < obs.x + OBSTACLE_W - 4 &&
                p.y + PLAYER_H - 4 > GROUND - obs.h
            ) {
                state.dead = true;
                state.running = false;
                state.deathFlash = 10;
            }
        }
    }
}

function draw(ctx, state) {
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, GROUND);
    grad.addColorStop(0, COLOR_BG);
    grad.addColorStop(1, COLOR_BG2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, GROUND);

    // Scrolling dojo floor lines (perspective)
    ctx.strokeStyle = COLOR_DOJO_LINE;
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
        const x = ((i * 80) - state.bgOffset + 80) % (CANVAS_W + 80) - 40;
        ctx.beginPath();
        ctx.moveTo(x, GROUND - 1);
        ctx.lineTo(x + 30, GROUND - 30);
        ctx.stroke();
    }

    // Ground
    ctx.fillStyle = COLOR_GROUND;
    ctx.fillRect(0, GROUND, CANVAS_W, CANVAS_H - GROUND);
    ctx.fillStyle = COLOR_GROUND_LINE;
    ctx.fillRect(0, GROUND, CANVAS_W, 3);

    // Obstacles (ninjas)
    for (const obs of state.obstacles) drawNinja(ctx, obs);

    // Particles
    for (const pt of state.particles) {
        const alpha = pt.life / pt.maxLife;
        ctx.globalAlpha = alpha;
        if (pt.emoji) {
            ctx.font = '14px sans-serif';
            ctx.fillText('🥋', pt.x, pt.y);
        } else {
            ctx.fillStyle = COLOR_BELT;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    // Player
    drawChuck(ctx, state.player, state.dead);

    // Score
    ctx.fillStyle = COLOR_SCORE;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`🥋 ${Math.floor(state.score)}`, CANVAS_W - 10, 22);
    ctx.textAlign = 'left';

    // Death flash overlay
    if (state.deathFlash > 0) {
        ctx.fillStyle = COLOR_FLASH;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
}

function drawChuck(ctx, p, dead) {
    const cx = p.x + PLAYER_W / 2;
    const airborne = !p.onGround;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // === BOOTS ===
    ctx.fillStyle = COLOR_BOOT;
    if (dead) {
        ctx.fillRect(cx - 14, p.y + 44, 12, 8);
        ctx.fillRect(cx + 2, p.y + 44, 12, 8);
    } else if (airborne) {
        // Kick — right boot forward and high
        ctx.fillRect(cx - 12, p.y + 42, 11, 8);
        ctx.fillRect(cx + 6, p.y + 32, 13, 8);
    } else {
        const b = p.leg === 0 ? 4 : -4;
        ctx.fillRect(cx - 12, p.y + 44 - b, 11, 8);
        ctx.fillRect(cx + 1, p.y + 44 + b, 11, 8);
    }

    // === LEGS ===
    ctx.strokeStyle = COLOR_PLAYER;
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (dead) {
        ctx.moveTo(cx, p.y + 36); ctx.lineTo(cx - 12, p.y + 46);
        ctx.moveTo(cx, p.y + 36); ctx.lineTo(cx + 12, p.y + 46);
    } else if (airborne) {
        ctx.moveTo(cx, p.y + 36); ctx.lineTo(cx - 10, p.y + 44);
        ctx.moveTo(cx, p.y + 36); ctx.lineTo(cx + 14, p.y + 34);
    } else {
        const b = p.leg === 0 ? 4 : -4;
        ctx.moveTo(cx, p.y + 36); ctx.lineTo(cx - 10, p.y + 46 - b);
        ctx.moveTo(cx, p.y + 36); ctx.lineTo(cx + 10, p.y + 46 + b);
    }
    ctx.stroke();

    // === BELT ===
    ctx.fillStyle = COLOR_BELT;
    ctx.fillRect(cx - 10, p.y + 34, 20, 4);

    // === BODY (muscular torso) ===
    ctx.fillStyle = COLOR_PLAYER;
    ctx.beginPath();
    ctx.moveTo(cx - 10, p.y + 20);
    ctx.lineTo(cx + 10, p.y + 20);
    ctx.lineTo(cx + 8, p.y + 34);
    ctx.lineTo(cx - 8, p.y + 34);
    ctx.closePath();
    ctx.fill();

    // === ARMS ===
    ctx.strokeStyle = COLOR_PLAYER;
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (dead) {
        ctx.moveTo(cx - 8, p.y + 22); ctx.lineTo(cx - 18, p.y + 14);
        ctx.moveTo(cx + 8, p.y + 22); ctx.lineTo(cx + 18, p.y + 14);
    } else if (airborne) {
        // Flying kick — left arm back, right arm forward punching
        ctx.moveTo(cx - 8, p.y + 22); ctx.lineTo(cx - 20, p.y + 26);
        ctx.moveTo(cx + 8, p.y + 22); ctx.lineTo(cx + 20, p.y + 16);
    } else {
        const a = p.leg === 0 ? -3 : 3;
        ctx.moveTo(cx - 8, p.y + 22); ctx.lineTo(cx - 18, p.y + 28 + a);
        ctx.moveTo(cx + 8, p.y + 22); ctx.lineTo(cx + 18, p.y + 28 - a);
    }
    ctx.stroke();

    // === HEAD ===
    ctx.fillStyle = COLOR_PLAYER;
    ctx.beginPath();
    ctx.ellipse(cx, p.y + 11, 11, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // === HAIR (dark, swept back) ===
    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.ellipse(cx, p.y + 4, 11, 6, 0, Math.PI, 0);
    ctx.fill();

    // === BEARD ===
    ctx.fillStyle = COLOR_BEARD;
    ctx.beginPath();
    ctx.ellipse(cx, p.y + 18, 7, 5, 0, 0, Math.PI);
    ctx.fill();
    // Moustache
    ctx.fillStyle = COLOR_BEARD;
    ctx.beginPath();
    ctx.ellipse(cx - 3, p.y + 14, 4, 2.5, -0.3, 0, Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 3, p.y + 14, 4, 2.5, 0.3, 0, Math.PI);
    ctx.fill();

    // === EYES ===
    if (dead) {
        ctx.strokeStyle = COLOR_BELT;
        ctx.lineWidth = 1.5;
        [[-4], [3]].forEach(([ox]) => {
            ctx.beginPath();
            ctx.moveTo(cx + ox - 2, p.y + 8); ctx.lineTo(cx + ox + 2, p.y + 12);
            ctx.moveTo(cx + ox + 2, p.y + 8); ctx.lineTo(cx + ox - 2, p.y + 12);
            ctx.stroke();
        });
    } else {
        // Determined squinting eyes
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.ellipse(cx - 4, p.y + 9, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + 4, p.y + 9, 2.5, 2, 0, 0, Math.PI * 2); ctx.fill();
        // Eyebrow scowl
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 7, p.y + 5); ctx.lineTo(cx - 1, p.y + 7);
        ctx.moveTo(cx + 7, p.y + 5); ctx.lineTo(cx + 1, p.y + 7);
        ctx.stroke();
    }
}

function drawNinja(ctx, obs) {
    const ox = obs.x;
    const oy = GROUND - obs.h;
    const cx = ox + OBSTACLE_W / 2;

    // Body
    ctx.fillStyle = COLOR_NINJA;
    ctx.fillRect(ox + 2, oy + 20, OBSTACLE_W - 4, obs.h - 20);

    // Head
    ctx.fillStyle = COLOR_NINJA;
    ctx.beginPath();
    ctx.arc(cx, oy + 12, 11, 0, Math.PI * 2);
    ctx.fill();

    // Headband
    ctx.fillStyle = COLOR_NINJA_ACCENT;
    ctx.fillRect(cx - 11, oy + 8, 22, 5);
    // Headband tail
    ctx.beginPath();
    ctx.moveTo(cx + 8, oy + 13);
    ctx.lineTo(cx + 16, oy + 20);
    ctx.lineTo(cx + 12, oy + 20);
    ctx.lineTo(cx + 4, oy + 13);
    ctx.closePath();
    ctx.fill();

    // Eyes (white slits)
    ctx.fillStyle = '#fff';
    ctx.fillRect(cx - 8, oy + 10, 5, 3);
    ctx.fillRect(cx + 3, oy + 10, 5, 3);

    // Sword
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + 10, oy + 14);
    ctx.lineTo(cx + 10, oy - 18);
    ctx.stroke();
    // Guard
    ctx.strokeStyle = COLOR_NINJA_ACCENT;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx + 5, oy + 10);
    ctx.lineTo(cx + 15, oy + 10);
    ctx.stroke();

    // Belt
    ctx.fillStyle = COLOR_NINJA_ACCENT;
    ctx.fillRect(cx - OBSTACLE_W / 2 + 2, oy + 30, OBSTACLE_W - 4, 4);

    // Legs
    ctx.fillStyle = COLOR_NINJA;
    ctx.fillRect(ox + 2, oy + obs.h - 14, 10, 14);
    ctx.fillRect(ox + OBSTACLE_W - 12, oy + obs.h - 14, 10, 14);
}

function drawIdle(ctx, state) {
    const grad = ctx.createLinearGradient(0, 0, 0, GROUND);
    grad.addColorStop(0, COLOR_BG);
    grad.addColorStop(1, COLOR_BG2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, GROUND);
    ctx.fillStyle = COLOR_GROUND;
    ctx.fillRect(0, GROUND, CANVAS_W, CANVAS_H - GROUND);
    ctx.fillStyle = COLOR_GROUND_LINE;
    ctx.fillRect(0, GROUND, CANVAS_W, 3);
    drawChuck(ctx, state.player, false);
    ctx.fillStyle = COLOR_TEXT;
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Press Start — Chuck Norris awaits!', CANVAS_W / 2, GROUND / 2 - 10);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = COLOR_SCORE;
    ctx.fillText('↑ / Space / Tap to jump', CANVAS_W / 2, GROUND / 2 + 14);
    ctx.textAlign = 'left';
}

const CANVAS_W = 480;
const CANVAS_H = 220;
const GROUND = CANVAS_H - 40;
const PLAYER_W = 40;
const PLAYER_H = 52;
const PLAYER_X = 64;
const OBSTACLE_W = 28;
const OBSTACLE_MIN_H = 28;
const OBSTACLE_MAX_H = 56;
const GRAVITY = 0.55;
const JUMP_FORCE = -13.5;
const INITIAL_SPEED = 4.5;
const SPEED_INCREMENT = 0.0008;
const OBSTACLE_MIN_GAP = 280;
const OBSTACLE_MAX_GAP = 520;

const COLOR_BG = '#0d0d0d';
const COLOR_GROUND_FILL = '#1a1a1a';
const COLOR_GROUND_LINE = '#b22222';
const COLOR_DOJO_LINE = '#1f1f1f';
const COLOR_SCORE = '#666666';
const COLOR_TEXT = '#f0f0f0';

// Chuck Norris colors
const CHUCK_SKIN = '#e8c49a';
const CHUCK_HAIR = '#c8a060';
const CHUCK_BEARD = '#c8a060';
const CHUCK_GI = '#f0f0f0';
const CHUCK_BELT = '#b22222';
const CHUCK_OUTLINE = '#222222';

// Ninja colors
const NINJA_BODY = '#222222';
const NINJA_HEADBAND = '#b22222';
const NINJA_EYE = '#cc0000';

let instances = {};

export function init(canvasId, dotnetRef) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    const state = {
        dotnetRef,
        running: false,
        dead: false,
        deadFrame: 0,
        score: 0,
        speed: INITIAL_SPEED,
        frame: 0,
        player: { x: PLAYER_X, y: GROUND - PLAYER_H, vy: 0, onGround: true, leg: 0 },
        obstacles: [],
        sparks: [],
        nextObstacle: randomGap(),
        animId: null,
    };

    const onKey = (e) => {
        if (['ArrowUp', 'ArrowDown', 'Space', ' '].includes(e.key)) e.preventDefault();
        if ((e.key === 'ArrowUp' || e.key === ' ') && state.running && !state.dead) jump(state);
    };
    document.addEventListener('keydown', onKey);
    canvas.addEventListener('touchstart', () => { if (state.running && !state.dead) jump(state); }, { passive: true });

    instances[canvasId] = { state, ctx, canvas, onKey };
    drawIdle(ctx, state);
}

export function startGame(canvasId) {
    const inst = instances[canvasId];
    if (!inst) return;
    const { state, ctx } = inst;

    state.running = true;
    state.dead = false;
    state.deadFrame = 0;
    state.score = 0;
    state.speed = INITIAL_SPEED;
    state.frame = 0;
    state.player = { x: PLAYER_X, y: GROUND - PLAYER_H, vy: 0, onGround: true, leg: 0 };
    state.obstacles = [];
    state.sparks = [];
    state.nextObstacle = randomGap();

    if (state.animId) cancelAnimationFrame(state.animId);
    loop(inst);
}

export function dispose(canvasId) {
    const inst = instances[canvasId];
    if (!inst) return;
    if (inst.state.animId) cancelAnimationFrame(inst.state.animId);
    document.removeEventListener('keydown', inst.onKey);
    delete instances[canvasId];
}

function jump(state) {
    if (state.player.onGround) {
        state.player.vy = JUMP_FORCE;
        state.player.onGround = false;
    }
}

function randomGap() {
    return OBSTACLE_MIN_GAP + Math.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP);
}

function loop(inst) {
    const { state, ctx } = inst;
    update(state);
    draw(ctx, state);
    if (!state.dead || state.deadFrame < 80) {
        state.animId = requestAnimationFrame(() => loop(inst));
    } else {
        state.dotnetRef.invokeMethodAsync('OnGameOver', Math.floor(state.score));
    }
}

function update(state) {
    state.frame++;
    if (state.dead) { state.deadFrame++; return; }

    state.score += state.speed * 0.05;
    state.speed += SPEED_INCREMENT * state.speed;

    const p = state.player;
    p.vy += GRAVITY;
    p.y += p.vy;
    if (p.y >= GROUND - PLAYER_H) {
        p.y = GROUND - PLAYER_H;
        p.vy = 0;
        p.onGround = true;
    }
    if (p.onGround) p.leg = Math.floor(state.frame / 5) % 2;

    // Kick sparks when running fast
    if (p.onGround && state.speed > 7 && state.frame % 4 === 0) {
        state.sparks.push({
            x: p.x + 2,
            y: GROUND - 4,
            vx: -1.5 - Math.random() * 2,
            vy: -1 - Math.random() * 2,
            life: 12 + Math.random() * 8,
            maxLife: 18,
        });
    }

    // Update sparks
    state.sparks = state.sparks.filter(s => s.life > 0);
    for (const s of state.sparks) {
        s.x += s.vx; s.y += s.vy; s.vy += 0.2; s.life--;
    }

    // Obstacles
    state.nextObstacle -= state.speed;
    if (state.nextObstacle <= 0) {
        const h = OBSTACLE_MIN_H + Math.random() * (OBSTACLE_MAX_H - OBSTACLE_MIN_H);
        state.obstacles.push({ x: CANVAS_W + 20, h });
        state.nextObstacle = randomGap();
    }
    for (const obs of state.obstacles) obs.x -= state.speed;
    state.obstacles = state.obstacles.filter(o => o.x + OBSTACLE_W > -10);

    // Collision
    for (const obs of state.obstacles) {
        if (
            p.x + PLAYER_W - 8 > obs.x + 4 &&
            p.x + 8 < obs.x + OBSTACLE_W - 4 &&
            p.y + PLAYER_H - 4 > GROUND - obs.h
        ) {
            state.dead = true;
            state.running = false;
        }
    }
}

function draw(ctx, state) {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Dojo background lines (perspective floor lines)
    ctx.strokeStyle = COLOR_DOJO_LINE;
    ctx.lineWidth = 1;
    const lineOffset = (state.frame * state.speed * 0.5) % 80;
    for (let x = -lineOffset; x < CANVAS_W; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, GROUND);
        ctx.lineTo(x, CANVAS_H);
        ctx.stroke();
    }

    // Ground
    ctx.fillStyle = COLOR_GROUND_FILL;
    ctx.fillRect(0, GROUND, CANVAS_W, CANVAS_H - GROUND);
    ctx.fillStyle = COLOR_GROUND_LINE;
    ctx.fillRect(0, GROUND, CANVAS_W, 3);

    // Sparks
    for (const s of state.sparks) {
        const alpha = s.life / s.maxLife;
        ctx.fillStyle = `rgba(255, ${100 + Math.floor(alpha * 100)}, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Ninjas
    for (const obs of state.obstacles) drawNinja(ctx, obs);

    // Chuck Norris
    drawChuck(ctx, state.player, state.dead, state.deadFrame);

    // Score
    ctx.fillStyle = COLOR_SCORE;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`🥋 ${Math.floor(state.score)}`, CANVAS_W - 12, 22);
    ctx.textAlign = 'left';

    // Speed indicator
    const lvl = Math.floor((state.speed - INITIAL_SPEED) / 1.5) + 1;
    if (lvl > 1) {
        ctx.fillStyle = '#b22222';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`LVL ${lvl}`, 10, 22);
    }

    // Death flash
    if (state.dead) {
        const flashAlpha = Math.max(0, 1 - state.deadFrame / 40);
        ctx.fillStyle = `rgba(178, 34, 34, ${flashAlpha * 0.5})`;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        if (state.deadFrame > 10) {
            const textAlpha = Math.min(1, (state.deadFrame - 10) / 20);
            ctx.fillStyle = `rgba(240, 240, 240, ${textAlpha})`;
            ctx.font = 'bold 22px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('ROUNDHOUSE KICKED!', CANVAS_W / 2, CANVAS_H / 2 - 10);
            ctx.font = '13px sans-serif';
            ctx.fillStyle = `rgba(180, 180, 180, ${textAlpha})`;
            ctx.fillText(`Score: ${Math.floor(state.score)}`, CANVAS_W / 2, CANVAS_H / 2 + 14);
            ctx.textAlign = 'left';
        }
    }
}

function drawNinja(ctx, obs) {
    const ox = obs.x;
    const oy = GROUND - obs.h;
    const cx = ox + OBSTACLE_W / 2;

    // Body
    ctx.fillStyle = NINJA_BODY;
    ctx.fillRect(ox + 4, oy + 18, OBSTACLE_W - 8, obs.h - 18);

    // Head
    ctx.beginPath();
    ctx.arc(cx, oy + 10, 11, 0, Math.PI * 2);
    ctx.fill();

    // Headband
    ctx.fillStyle = NINJA_HEADBAND;
    ctx.fillRect(cx - 11, oy + 6, 22, 5);

    // Headband knot (trailing ribbon)
    ctx.beginPath();
    ctx.moveTo(cx + 9, oy + 8);
    ctx.lineTo(cx + 16, oy + 4);
    ctx.lineTo(cx + 14, oy + 12);
    ctx.fill();

    // Eyes (glowing red slits)
    ctx.fillStyle = NINJA_EYE;
    ctx.fillRect(cx - 7, oy + 8, 5, 2);
    ctx.fillRect(cx + 2, oy + 8, 5, 2);

    // Arms posed for attack
    ctx.strokeStyle = NINJA_BODY;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, oy + 22);
    ctx.lineTo(ox - 6, oy + 30);  // arm reaching toward Chuck
    ctx.moveTo(cx, oy + 22);
    ctx.lineTo(ox + OBSTACLE_W + 2, oy + 26);
    ctx.stroke();
}

function drawChuck(ctx, p, dead, deadFrame) {
    const cx = p.x + PLAYER_W / 2;
    const airborne = !p.onGround;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Shadow on ground
    if (!dead) {
        const shadowY = GROUND + 2;
        const shadowScale = airborne ? Math.max(0.3, 1 - (GROUND - p.y - PLAYER_H) / 100) : 1;
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(cx, shadowY, 18 * shadowScale, 4 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // --- GI (body) ---
    ctx.fillStyle = CHUCK_GI;
    ctx.strokeStyle = CHUCK_OUTLINE;
    ctx.lineWidth = 1.5;

    if (dead) {
        // Slumped pose
        const tilt = Math.min(deadFrame * 1.5, 25);
        ctx.save();
        ctx.translate(cx, p.y + PLAYER_H * 0.6);
        ctx.rotate((tilt * Math.PI) / 180);
        ctx.translate(-cx, -(p.y + PLAYER_H * 0.6));
    }

    // Torso (gi jacket, open V)
    ctx.beginPath();
    ctx.moveTo(cx - 10, p.y + 20);
    ctx.lineTo(cx - 10, p.y + 38);
    ctx.lineTo(cx + 10, p.y + 38);
    ctx.lineTo(cx + 10, p.y + 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Gi lapels (V-neck cross)
    ctx.strokeStyle = CHUCK_OUTLINE;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 4, p.y + 20);
    ctx.lineTo(cx, p.y + 30);
    ctx.lineTo(cx + 4, p.y + 20);
    ctx.stroke();

    // Belt
    ctx.fillStyle = CHUCK_BELT;
    ctx.fillRect(cx - 10, p.y + 34, 20, 4);

    // --- HEAD ---
    // Neck
    ctx.fillStyle = CHUCK_SKIN;
    ctx.fillRect(cx - 4, p.y + 16, 8, 6);

    // Head
    ctx.beginPath();
    ctx.arc(cx, p.y + 10, 11, 0, Math.PI * 2);
    ctx.fillStyle = CHUCK_SKIN;
    ctx.fill();
    ctx.strokeStyle = CHUCK_OUTLINE;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Hair (wavy top)
    ctx.fillStyle = CHUCK_HAIR;
    ctx.beginPath();
    ctx.arc(cx, p.y + 4, 9, Math.PI, 0);
    ctx.fill();
    // Side hair tufts
    ctx.beginPath();
    ctx.arc(cx - 9, p.y + 8, 4, Math.PI * 0.5, Math.PI * 1.5);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 9, p.y + 8, 4, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.fill();

    // Beard/mustache
    ctx.fillStyle = CHUCK_BEARD;
    ctx.beginPath();
    ctx.arc(cx, p.y + 16, 6, 0, Math.PI);
    ctx.fill();
    // Mustache
    ctx.beginPath();
    ctx.ellipse(cx - 3, p.y + 13, 4, 2, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 3, p.y + 13, 4, 2, 0.3, 0, Math.PI * 2);
    ctx.fill();

    if (dead) {
        // X eyes
        ctx.strokeStyle = CHUCK_BELT;
        ctx.lineWidth = 2;
        [cx - 4, cx + 4].forEach(ex => {
            ctx.beginPath();
            ctx.moveTo(ex - 3, p.y + 6); ctx.lineTo(ex + 3, p.y + 12);
            ctx.moveTo(ex + 3, p.y + 6); ctx.lineTo(ex - 3, p.y + 12);
            ctx.stroke();
        });

        // Defeat arms up
        ctx.strokeStyle = CHUCK_GI;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - 10, p.y + 25);
        ctx.lineTo(cx - 22, p.y + 15);
        ctx.moveTo(cx + 10, p.y + 25);
        ctx.lineTo(cx + 22, p.y + 15);
        ctx.stroke();

        // Splayed legs
        ctx.strokeStyle = CHUCK_GI;
        ctx.beginPath();
        ctx.moveTo(cx, p.y + 38);
        ctx.lineTo(cx - 14, p.y + 52);
        ctx.moveTo(cx, p.y + 38);
        ctx.lineTo(cx + 14, p.y + 52);
        ctx.stroke();

        ctx.restore();
        return;
    }

    // Eyes (normal)
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 4, p.y + 8, 2, 0, Math.PI * 2);
    ctx.arc(cx + 4, p.y + 8, 2, 0, Math.PI * 2);
    ctx.fill();

    // --- ARMS ---
    ctx.strokeStyle = CHUCK_GI;
    ctx.lineWidth = 5;
    if (airborne) {
        // Flying kick pose — arms back, body leaning forward
        ctx.beginPath();
        ctx.moveTo(cx - 10, p.y + 25);
        ctx.lineTo(cx - 22, p.y + 32);  // back arm sweeping
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 10, p.y + 25);
        ctx.lineTo(cx + 20, p.y + 20);  // forward punch/block arm
        ctx.stroke();
    } else {
        // Running — arms pump
        const armSwing = p.leg === 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(cx - 10, p.y + 25);
        ctx.lineTo(cx - 20, p.y + 30 + armSwing * 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 10, p.y + 25);
        ctx.lineTo(cx + 20, p.y + 30 - armSwing * 6);
        ctx.stroke();
    }

    // --- LEGS ---
    ctx.strokeStyle = CHUCK_GI;
    ctx.lineWidth = 5;
    if (airborne) {
        // Roundhouse kick — one leg extended forward high, one tucked back
        ctx.beginPath();
        ctx.moveTo(cx, p.y + 38);
        ctx.lineTo(cx + 22, p.y + 28);  // kick leg extended forward-up
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, p.y + 38);
        ctx.lineTo(cx - 14, p.y + 46);  // back leg tucked
        ctx.stroke();

        // Kick sparks at foot tip
        ctx.fillStyle = '#ff8800';
        ctx.beginPath();
        ctx.arc(cx + 22, p.y + 28, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,180,0,0.6)';
        ctx.beginPath();
        ctx.arc(cx + 26, p.y + 25, 2, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // Running stride
        const stride = p.leg === 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(cx, p.y + 38);
        ctx.lineTo(cx - 12, p.y + 50 + stride * 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, p.y + 38);
        ctx.lineTo(cx + 12, p.y + 50 - stride * 5);
        ctx.stroke();
    }
}

function drawIdle(ctx, state) {
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = COLOR_GROUND_FILL;
    ctx.fillRect(0, GROUND, CANVAS_W, CANVAS_H - GROUND);
    ctx.fillStyle = COLOR_GROUND_LINE;
    ctx.fillRect(0, GROUND, CANVAS_W, 3);
    drawChuck(ctx, state.player, false, 0);
    ctx.fillStyle = COLOR_TEXT;
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Chuck Norris is ready.', CANVAS_W / 2, CANVAS_H / 2 - 12);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = COLOR_SCORE;
    ctx.fillText('↑ / Space / Tap to jump', CANVAS_W / 2, CANVAS_H / 2 + 12);
    ctx.textAlign = 'left';
}


let instances = {};

export function init(canvasId, dotnetRef) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;

    const state = {
        dotnetRef,
        running: false,
        dead: false,
        score: 0,
        speed: INITIAL_SPEED,
        frame: 0,
        player: { x: PLAYER_X, y: GROUND - PLAYER_H, vy: 0, onGround: true, leg: 0 },
        obstacles: [],
        nextObstacle: randomGap(),
        animId: null,
        keys: new Set(),
    };

    const onKey = (e) => {
        if (['ArrowUp', 'ArrowDown', 'Space', ' '].includes(e.key)) {
            e.preventDefault();
        }
        if ((e.key === 'ArrowUp' || e.key === ' ') && state.running && !state.dead) {
            jump(state);
        }
        state.keys.add(e.key);
    };
    document.addEventListener('keydown', onKey);
    canvas.addEventListener('touchstart', () => { if (state.running && !state.dead) jump(state); }, { passive: true });

    instances[canvasId] = { state, ctx, canvas, onKey };
    drawIdle(ctx, state);
}

export function startGame(canvasId) {
    const inst = instances[canvasId];
    if (!inst) return;
    const { state, ctx } = inst;

    state.running = true;
    state.dead = false;
    state.score = 0;
    state.speed = INITIAL_SPEED;
    state.frame = 0;
    state.player = { x: PLAYER_X, y: GROUND - PLAYER_H, vy: 0, onGround: true, leg: 0 };
    state.obstacles = [];
    state.nextObstacle = randomGap();

    if (state.animId) cancelAnimationFrame(state.animId);
    loop(inst);
}

export function dispose(canvasId) {
    const inst = instances[canvasId];
    if (!inst) return;
    if (inst.state.animId) cancelAnimationFrame(inst.state.animId);
    document.removeEventListener('keydown', inst.onKey);
    delete instances[canvasId];
}

function jump(state) {
    if (state.player.onGround) {
        state.player.vy = JUMP_FORCE;
        state.player.onGround = false;
    }
}

function randomGap() {
    return OBSTACLE_MIN_GAP + Math.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP);
}

function loop(inst) {
    const { state, ctx } = inst;
    update(state);
    draw(ctx, state);
    if (!state.dead) {
        state.animId = requestAnimationFrame(() => loop(inst));
    } else {
        state.dotnetRef.invokeMethodAsync('OnGameOver', Math.floor(state.score));
    }
}

function update(state) {
    state.frame++;
    state.score += state.speed * 0.05;
    state.speed += SPEED_INCREMENT * state.speed;

    // Player physics
    const p = state.player;
    p.vy += GRAVITY;
    p.y += p.vy;
    if (p.y >= GROUND - PLAYER_H) {
        p.y = GROUND - PLAYER_H;
        p.vy = 0;
        p.onGround = true;
    }
    if (p.onGround) p.leg = Math.floor(state.frame / 6) % 2;

    // Obstacles
    state.nextObstacle -= state.speed;
    if (state.nextObstacle <= 0) {
        const h = OBSTACLE_MIN_H + Math.random() * (OBSTACLE_MAX_H - OBSTACLE_MIN_H);
        state.obstacles.push({ x: CANVAS_W + 20, h });
        state.nextObstacle = randomGap();
    }

    for (const obs of state.obstacles) obs.x -= state.speed;
    state.obstacles = state.obstacles.filter(o => o.x + OBSTACLE_W > -10);

    // Collision
    for (const obs of state.obstacles) {
        if (
            p.x + PLAYER_W - 6 > obs.x + 4 &&
            p.x + 6 < obs.x + OBSTACLE_W - 4 &&
            p.y + PLAYER_H - 4 > GROUND - obs.h
        ) {
            state.dead = true;
            state.running = false;
        }
    }
}

function draw(ctx, state) {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Ground
    ctx.fillStyle = COLOR_GROUND;
    ctx.fillRect(0, GROUND, CANVAS_W, CANVAS_H - GROUND);
    ctx.fillStyle = COLOR_GROUND_LINE;
    ctx.fillRect(0, GROUND, CANVAS_W, 3);

    // Obstacles (ninja silhouette: rect + head circle)
    ctx.fillStyle = COLOR_OBSTACLE;
    for (const obs of state.obstacles) {
        const ox = obs.x;
        const oy = GROUND - obs.h;
        ctx.fillRect(ox, oy, OBSTACLE_W, obs.h);
        ctx.beginPath();
        ctx.arc(ox + OBSTACLE_W / 2, oy - 10, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    // Player (stick figure Chuck Norris)
    drawPlayer(ctx, state.player, state.dead);

    // Score
    ctx.fillStyle = COLOR_SCORE;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`🥋 ${Math.floor(state.score)}`, CANVAS_W - 12, 24);
    ctx.textAlign = 'left';
}

function drawPlayer(ctx, p, dead) {
    const cx = p.x + PLAYER_W / 2;
    ctx.strokeStyle = COLOR_PLAYER;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    // Head
    ctx.beginPath();
    ctx.arc(cx, p.y + 10, 10, 0, Math.PI * 2);
    ctx.strokeStyle = COLOR_PLAYER;
    ctx.stroke();

    // Beard accent
    ctx.fillStyle = COLOR_PLAYER_ACCENT;
    ctx.beginPath();
    ctx.arc(cx, p.y + 14, 5, 0, Math.PI);
    ctx.fill();

    // Body
    ctx.strokeStyle = COLOR_PLAYER;
    ctx.beginPath();
    ctx.moveTo(cx, p.y + 20);
    ctx.lineTo(cx, p.y + 36);
    ctx.stroke();

    if (dead) {
        // X eyes
        ctx.strokeStyle = COLOR_OBSTACLE;
        ctx.lineWidth = 2;
        [[-4, -3], [2, -3]].forEach(([ox]) => {
            ctx.beginPath();
            ctx.moveTo(cx + ox - 3, p.y + 6);
            ctx.lineTo(cx + ox + 3, p.y + 12);
            ctx.moveTo(cx + ox + 3, p.y + 6);
            ctx.lineTo(cx + ox - 3, p.y + 12);
            ctx.stroke();
        });
        // Arms up in defeat
        ctx.strokeStyle = COLOR_PLAYER;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, p.y + 24);
        ctx.lineTo(cx - 14, p.y + 16);
        ctx.moveTo(cx, p.y + 24);
        ctx.lineTo(cx + 14, p.y + 16);
        ctx.stroke();
        // Legs splayed
        ctx.beginPath();
        ctx.moveTo(cx, p.y + 36);
        ctx.lineTo(cx - 12, p.y + 48);
        ctx.moveTo(cx, p.y + 36);
        ctx.lineTo(cx + 12, p.y + 48);
        ctx.stroke();
        return;
    }

    // Arms — kick pose when airborne, run pose otherwise
    ctx.beginPath();
    if (!p.onGround) {
        // Kick pose: one arm back, one leg kicking forward
        ctx.moveTo(cx, p.y + 24);
        ctx.lineTo(cx - 14, p.y + 20);
        ctx.moveTo(cx, p.y + 24);
        ctx.lineTo(cx + 14, p.y + 18);
    } else {
        ctx.moveTo(cx, p.y + 24);
        ctx.lineTo(cx - 12, p.y + 30 + (p.leg === 0 ? -4 : 4));
        ctx.moveTo(cx, p.y + 24);
        ctx.lineTo(cx + 12, p.y + 30 + (p.leg === 0 ? 4 : -4));
    }
    ctx.stroke();

    // Legs
    ctx.beginPath();
    if (!p.onGround) {
        ctx.moveTo(cx, p.y + 36);
        ctx.lineTo(cx - 14, p.y + 44);
        ctx.moveTo(cx, p.y + 36);
        ctx.lineTo(cx + 16, p.y + 30);
    } else {
        ctx.moveTo(cx, p.y + 36);
        ctx.lineTo(cx - 10, p.y + 48 + (p.leg === 0 ? -4 : 4));
        ctx.moveTo(cx, p.y + 36);
        ctx.lineTo(cx + 10, p.y + 48 + (p.leg === 0 ? 4 : -4));
    }
    ctx.stroke();
}

function drawIdle(ctx, state) {
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = COLOR_GROUND;
    ctx.fillRect(0, GROUND, CANVAS_W, CANVAS_H - GROUND);
    ctx.fillStyle = COLOR_GROUND_LINE;
    ctx.fillRect(0, GROUND, CANVAS_W, 3);
    drawPlayer(ctx, state.player, false);
    ctx.fillStyle = COLOR_TEXT;
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Press Start to run!', CANVAS_W / 2, CANVAS_H / 2 - 10);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = COLOR_SCORE;
    ctx.fillText('↑ / Space / Tap to jump', CANVAS_W / 2, CANVAS_H / 2 + 14);
    ctx.textAlign = 'left';
}
