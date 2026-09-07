// Chuck Norris Runner — canvas-based side-scrolling runner game
// Chuck Norris doesn't run. He advances toward the enemy.

const CANVAS_W = 480;
const CANVAS_H = 200;
const GROUND = CANVAS_H - 40;
const PLAYER_W = 36;
const PLAYER_H = 48;
const PLAYER_X = 60;
const OBSTACLE_W = 24;
const OBSTACLE_MIN_H = 24;
const OBSTACLE_MAX_H = 52;
const GRAVITY = 0.55;
const JUMP_FORCE = -13;
const INITIAL_SPEED = 4.5;
const SPEED_INCREMENT = 0.0008;
const OBSTACLE_MIN_GAP = 280;
const OBSTACLE_MAX_GAP = 520;

const COLOR_BG = '#111111';
const COLOR_GROUND = '#2a2a2a';
const COLOR_GROUND_LINE = '#b22222';
const COLOR_PLAYER = '#f0f0f0';
const COLOR_PLAYER_ACCENT = '#b22222';
const COLOR_OBSTACLE = '#b22222';
const COLOR_SCORE = '#888888';
const COLOR_TEXT = '#f0f0f0';

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
