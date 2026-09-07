// Chuck Norris Runner — canvas-based side-scrolling runner game
// Chuck Norris doesn't run. He advances toward the enemy.

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
const CHUCK_SKIN = '#e8c49a';
const CHUCK_HAIR = '#c8a060';
const CHUCK_BEARD = '#c8a060';
const CHUCK_GI = '#f0f0f0';
const CHUCK_BELT = '#b22222';
const CHUCK_OUTLINE = '#222222';
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
            x: p.x + 2, y: GROUND - 4,
            vx: -1.5 - Math.random() * 2, vy: -1 - Math.random() * 2,
            life: 12 + Math.random() * 8, maxLife: 18,
        });
    }

    state.sparks = state.sparks.filter(s => s.life > 0);
    for (const s of state.sparks) { s.x += s.vx; s.y += s.vy; s.vy += 0.2; s.life--; }

    state.nextObstacle -= state.speed;
    if (state.nextObstacle <= 0) {
        const h = OBSTACLE_MIN_H + Math.random() * (OBSTACLE_MAX_H - OBSTACLE_MIN_H);
        state.obstacles.push({ x: CANVAS_W + 20, h });
        state.nextObstacle = randomGap();
    }
    for (const obs of state.obstacles) obs.x -= state.speed;
    state.obstacles = state.obstacles.filter(o => o.x + OBSTACLE_W > -10);

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
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Scrolling dojo floor lines
    ctx.strokeStyle = COLOR_DOJO_LINE;
    ctx.lineWidth = 1;
    const lineOffset = (state.frame * state.speed * 0.5) % 80;
    for (let x = -lineOffset; x < CANVAS_W; x += 80) {
        ctx.beginPath(); ctx.moveTo(x, GROUND); ctx.lineTo(x, CANVAS_H); ctx.stroke();
    }

    ctx.fillStyle = COLOR_GROUND_FILL;
    ctx.fillRect(0, GROUND, CANVAS_W, CANVAS_H - GROUND);
    ctx.fillStyle = COLOR_GROUND_LINE;
    ctx.fillRect(0, GROUND, CANVAS_W, 3);

    for (const s of state.sparks) {
        const alpha = s.life / s.maxLife;
        ctx.fillStyle = `rgba(255,${100 + Math.floor(alpha * 100)},0,${alpha})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2); ctx.fill();
    }

    for (const obs of state.obstacles) drawNinja(ctx, obs);
    drawChuck(ctx, state.player, state.dead, state.deadFrame);

    ctx.fillStyle = COLOR_SCORE;
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`\uD83E\uDD4B ${Math.floor(state.score)}`, CANVAS_W - 12, 22);
    ctx.textAlign = 'left';

    const lvl = Math.floor((state.speed - INITIAL_SPEED) / 1.5) + 1;
    if (lvl > 1) {
        ctx.fillStyle = '#b22222';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`LVL ${lvl}`, 10, 22);
    }

    if (state.dead) {
        const flashAlpha = Math.max(0, 1 - state.deadFrame / 40);
        ctx.fillStyle = `rgba(178,34,34,${flashAlpha * 0.5})`;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        if (state.deadFrame > 10) {
            const textAlpha = Math.min(1, (state.deadFrame - 10) / 20);
            ctx.fillStyle = `rgba(240,240,240,${textAlpha})`;
            ctx.font = 'bold 22px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('ROUNDHOUSE KICKED!', CANVAS_W / 2, CANVAS_H / 2 - 10);
            ctx.font = '13px sans-serif';
            ctx.fillStyle = `rgba(180,180,180,${textAlpha})`;
            ctx.fillText(`Score: ${Math.floor(state.score)}`, CANVAS_W / 2, CANVAS_H / 2 + 14);
            ctx.textAlign = 'left';
        }
    }
}

function drawNinja(ctx, obs) {
    const ox = obs.x;
    const oy = GROUND - obs.h;
    const cx = ox + OBSTACLE_W / 2;

    ctx.fillStyle = NINJA_BODY;
    ctx.fillRect(ox + 4, oy + 18, OBSTACLE_W - 8, obs.h - 18);
    ctx.beginPath(); ctx.arc(cx, oy + 10, 11, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = NINJA_HEADBAND;
    ctx.fillRect(cx - 11, oy + 6, 22, 5);
    ctx.beginPath();
    ctx.moveTo(cx + 9, oy + 8); ctx.lineTo(cx + 16, oy + 4); ctx.lineTo(cx + 14, oy + 12);
    ctx.fill();

    ctx.fillStyle = NINJA_EYE;
    ctx.fillRect(cx - 7, oy + 8, 5, 2);
    ctx.fillRect(cx + 2, oy + 8, 5, 2);

    ctx.strokeStyle = NINJA_BODY;
    ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, oy + 22); ctx.lineTo(ox - 6, oy + 30);
    ctx.moveTo(cx, oy + 22); ctx.lineTo(ox + OBSTACLE_W + 2, oy + 26);
    ctx.stroke();
}

function drawChuck(ctx, p, dead, deadFrame) {
    const cx = p.x + PLAYER_W / 2;
    const airborne = !p.onGround;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // Ground shadow
    const shadowY = GROUND + 2;
    const shadowScale = airborne ? Math.max(0.3, 1 - (GROUND - p.y - PLAYER_H) / 100) : 1;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(cx, shadowY, 18 * shadowScale, 4 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    if (dead) {
        const tilt = Math.min((deadFrame || 0) * 1.5, 25);
        ctx.save();
        ctx.translate(cx, p.y + PLAYER_H * 0.6);
        ctx.rotate((tilt * Math.PI) / 180);
        ctx.translate(-cx, -(p.y + PLAYER_H * 0.6));
    }

    // Torso / gi
    ctx.fillStyle = CHUCK_GI; ctx.strokeStyle = CHUCK_OUTLINE; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 10, p.y + 20); ctx.lineTo(cx - 10, p.y + 38);
    ctx.lineTo(cx + 10, p.y + 38); ctx.lineTo(cx + 10, p.y + 20);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Gi lapels
    ctx.beginPath();
    ctx.moveTo(cx - 4, p.y + 20); ctx.lineTo(cx, p.y + 30); ctx.lineTo(cx + 4, p.y + 20);
    ctx.stroke();

    // Belt
    ctx.fillStyle = CHUCK_BELT;
    ctx.fillRect(cx - 10, p.y + 34, 20, 4);

    // Neck
    ctx.fillStyle = CHUCK_SKIN;
    ctx.fillRect(cx - 4, p.y + 16, 8, 6);

    // Head
    ctx.beginPath(); ctx.arc(cx, p.y + 10, 11, 0, Math.PI * 2);
    ctx.fillStyle = CHUCK_SKIN; ctx.fill();
    ctx.strokeStyle = CHUCK_OUTLINE; ctx.lineWidth = 1.5; ctx.stroke();

    // Hair
    ctx.fillStyle = CHUCK_HAIR;
    ctx.beginPath(); ctx.arc(cx, p.y + 4, 9, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - 9, p.y + 8, 4, Math.PI * 0.5, Math.PI * 1.5); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 9, p.y + 8, 4, -Math.PI * 0.5, Math.PI * 0.5); ctx.fill();

    // Beard + mustache
    ctx.fillStyle = CHUCK_BEARD;
    ctx.beginPath(); ctx.arc(cx, p.y + 16, 6, 0, Math.PI); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx - 3, p.y + 13, 4, 2, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 3, p.y + 13, 4, 2, 0.3, 0, Math.PI * 2); ctx.fill();

    if (dead) {
        // X eyes
        ctx.strokeStyle = CHUCK_BELT; ctx.lineWidth = 2;
        [cx - 4, cx + 4].forEach(ex => {
            ctx.beginPath();
            ctx.moveTo(ex - 3, p.y + 6); ctx.lineTo(ex + 3, p.y + 12);
            ctx.moveTo(ex + 3, p.y + 6); ctx.lineTo(ex - 3, p.y + 12);
            ctx.stroke();
        });
        ctx.strokeStyle = CHUCK_GI; ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - 10, p.y + 25); ctx.lineTo(cx - 22, p.y + 15);
        ctx.moveTo(cx + 10, p.y + 25); ctx.lineTo(cx + 22, p.y + 15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, p.y + 38); ctx.lineTo(cx - 14, p.y + 52);
        ctx.moveTo(cx, p.y + 38); ctx.lineTo(cx + 14, p.y + 52);
        ctx.stroke();
        ctx.restore();
        return;
    }

    // Eyes
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 4, p.y + 8, 2, 0, Math.PI * 2);
    ctx.arc(cx + 4, p.y + 8, 2, 0, Math.PI * 2);
    ctx.fill();

    // Arms
    ctx.strokeStyle = CHUCK_GI; ctx.lineWidth = 5;
    if (airborne) {
        ctx.beginPath();
        ctx.moveTo(cx - 10, p.y + 25); ctx.lineTo(cx - 22, p.y + 32);
        ctx.moveTo(cx + 10, p.y + 25); ctx.lineTo(cx + 20, p.y + 20);
        ctx.stroke();
    } else {
        const armSwing = p.leg === 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(cx - 10, p.y + 25); ctx.lineTo(cx - 20, p.y + 30 + armSwing * 6);
        ctx.moveTo(cx + 10, p.y + 25); ctx.lineTo(cx + 20, p.y + 30 - armSwing * 6);
        ctx.stroke();
    }

    // Legs
    ctx.strokeStyle = CHUCK_GI; ctx.lineWidth = 5;
    if (airborne) {
        ctx.beginPath();
        ctx.moveTo(cx, p.y + 38); ctx.lineTo(cx + 22, p.y + 28);
        ctx.moveTo(cx, p.y + 38); ctx.lineTo(cx - 14, p.y + 46);
        ctx.stroke();
        // Kick sparks at foot
        ctx.fillStyle = '#ff8800';
        ctx.beginPath(); ctx.arc(cx + 22, p.y + 28, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,180,0,0.6)';
        ctx.beginPath(); ctx.arc(cx + 26, p.y + 25, 2, 0, Math.PI * 2); ctx.fill();
    } else {
        const stride = p.leg === 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(cx, p.y + 38); ctx.lineTo(cx - 12, p.y + 50 + stride * 5);
        ctx.moveTo(cx, p.y + 38); ctx.lineTo(cx + 12, p.y + 50 - stride * 5);
        ctx.stroke();
    }
}

function drawIdle(ctx, state) {
    ctx.fillStyle = COLOR_BG; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = COLOR_GROUND_FILL; ctx.fillRect(0, GROUND, CANVAS_W, CANVAS_H - GROUND);
    ctx.fillStyle = COLOR_GROUND_LINE; ctx.fillRect(0, GROUND, CANVAS_W, 3);
    drawChuck(ctx, state.player, false, 0);
    ctx.fillStyle = COLOR_TEXT;
    ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Chuck Norris is ready.', CANVAS_W / 2, CANVAS_H / 2 - 12);
    ctx.font = '13px sans-serif'; ctx.fillStyle = COLOR_SCORE;
    ctx.fillText('\u2191 / Space / Tap to jump', CANVAS_W / 2, CANVAS_H / 2 + 12);
    ctx.textAlign = 'left';
}