import { ArrowLeft, ArrowDownRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "unsurf · cs-movement",
  description:
    "Counter-Strike / Source-engine movement physics as a TypeScript library. Bhop, surf, air-strafing, ladders, ducking, stamina, and plane-based brush collision.",
};

function SectionTitle({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-6 font-mono text-xs uppercase tracking-widest text-white/50">
      <span className="text-green-400">▌</span>
      <span>{children}</span>
      <span className="flex-1 h-px bg-white/10" />
      {right && (
        <span className="text-white/30 normal-case tracking-normal">
          {right}
        </span>
      )}
    </div>
  );
}

function Code({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="mt-3">
      {title && (
        <span className="text-[11px] text-white/30 uppercase tracking-wider">
          {title}
        </span>
      )}
      <pre className="p-4 bg-white/[0.03] border border-white/5 rounded-lg overflow-x-auto text-[13px] leading-relaxed text-white/70">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-16 mb-4 text-lg font-semibold text-white/90">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-10 mb-3 text-sm font-semibold text-white/80">
      {children}
    </h3>
  );
}

function P({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[13px] leading-relaxed text-white/50 ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 p-4 bg-green-400/[0.04] border border-green-400/10 rounded-lg text-[13px] text-white/60">
      <span className="text-green-400 font-semibold">Note.</span>{" "}
      {children}
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 bg-white/[0.05] border border-white/5 rounded text-[12px] text-green-400/80">
      {children}
    </code>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-white/10">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left py-2 pr-4 text-white/40 font-normal"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-4 text-white/60 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CSMovementPage() {
  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {/* back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          ~/unsurf
        </Link>

        {/* ─── Hero ─── */}
        <header className="mt-10">
          <p className="text-sm text-white/40">
            <span className="text-green-400">visitor</span>
            <span className="text-white/30">@</span>
            <span className="text-blue-300">unsurf</span>
            <span className="text-white/30">:</span>
            <span className="text-violet-300">~</span>
            <span className="text-white/30">$</span> npm info{" "}
            <span className="text-white/70">@unsurf/cs-movement</span>
          </p>

          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            cs-movement
          </h1>
          <p className="mt-2 text-white/60 max-w-xl">
            Counter-Strike / Source-engine movement physics as a standalone
            TypeScript library. Bhop, surf, air-strafing, ladders, ducking,
            stamina, and plane-based brush collision.
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-[11px]">
            <span className="px-2.5 py-1 bg-white/[0.04] border border-white/5 rounded-full text-green-400/80">
              zero runtime deps
            </span>
            <span className="px-2.5 py-1 bg-white/[0.04] border border-white/5 rounded-full text-green-400/80">
              renderer-agnostic
            </span>
            <span className="px-2.5 py-1 bg-white/[0.04] border border-white/5 rounded-full text-green-400/80">
              headless in Node
            </span>
          </div>
        </header>

        {/* ─── Getting Started ─── */}
        <section className="mt-14">
          <SectionTitle>Getting Started</SectionTitle>

          <H3>Install</H3>
          <Code>npm i @unsurf/cs-movement</Code>

          <H3>Browser</H3>
          <Code title="browser">{`import { World, PlayerController, brushFromAABB, vec3, DEFAULT_SETTINGS } from '@unsurf/cs-movement';

// 1. Build collision geometry.
const world = new World();
world.solids.push(brushFromAABB(vec3(-512, -16, -512), vec3(512, 0, 512)));

// 2. Spawn a player.
const player = new PlayerController(world, structuredClone(DEFAULT_SETTINGS), vec3(0, 8, 0));

// 3. Wire up WASD + pointer-lock mouse.
player.bindInput(canvas);

// 4. Step at a fixed tick rate, read state back each frame.
function gameLoop(dt: number) {
  player.tick(dt);
  // player.origin, player.velocity, player.onGround, etc.
}`}</Code>

          <H3>Headless (Node)</H3>
          <Code title="node">{`import { World, PlayerController, brushFromAABB, vec3, DEFAULT_SETTINGS } from '@unsurf/cs-movement';

const world = new World();
world.solids.push(brushFromAABB(vec3(-8192, -64, -8192), vec3(8192, 0, 8192)));

const player = new PlayerController(world, structuredClone(DEFAULT_SETTINGS), vec3(0, 5, 0));
player.input.forward = true;
for (let i = 0; i < 512; i++) player.tick(1 / 128);

console.log(player.horizontalSpeed); // ~250`}</Code>

          <Callout>
            Only <InlineCode>bindInput()</InlineCode> and{" "}
            <InlineCode>loadSettings()</InlineCode> /{" "}
            <InlineCode>saveSettings()</InlineCode> need a browser. Everything
            else runs anywhere — Node, Deno, Bun, Workers.
          </Callout>
        </section>

        {/* ─── Core Concepts ─── */}
        <section className="mt-14">
          <SectionTitle>Core Concepts</SectionTitle>

          {/* World & Brushes */}
          <H2>World &amp; Brushes</H2>
          <P>
            <InlineCode>World</InlineCode> holds the collision geometry: a flat
            list of <InlineCode>solids: Brush[]</InlineCode> and optionally{" "}
            <InlineCode>ladders: LadderVolume[]</InlineCode>. A{" "}
            <InlineCode>Brush</InlineCode> is a convex shape defined by its
            bounding planes — the same scheme as Source engine&apos;s{" "}
            <InlineCode>CM_ClipBoxToBrush</InlineCode>.
          </P>
          <Code>{`import { World, brushFromAABB, brushFromOrientedBox } from '@unsurf/cs-movement';

const world = new World();

// Axis-aligned box — two opposite corners.
world.solids.push(brushFromAABB(vec3(-512, -16, -512), vec3(512, 0, 512)));

// Oriented box — center, half-extents, and a local orthonormal basis.
// Tilt the "up" axis away from world-up and the top face becomes
// a walkable-or-surfable slope, decided purely by its normal.
world.solids.push(brushFromOrientedBox(
  vec3(0, 100, 0),        // center
  vec3(200, 8, 200),      // half-extents
  vec3(1, 0, 0),          // local X (right)
  vec3(0, 0.7, 0.7),      // local Y — tilted = surfable
  vec3(0, -0.7, 0.7),     // local Z
));

// Ladder volume — a Brush with a horizontal "facing" vector.
world.ladders.push({
  ...brushFromAABB(vec3(60, 0, -24), vec3(100, 600, 24)),
  facing: vec3(-1, 0, 0), // climbable face points away from the wall
});`}</Code>
          <P className="mt-3">
            A brush face whose normal is too steep to stand on ({" "}
            <InlineCode>normal.y &lt; STANDABLE_NORMAL</InlineCode>, ~45.57°)
            but not vertical gets clipped with{" "}
            <InlineCode>OVERBOUNCE_SURF</InlineCode> (no speed loss) instead of
            the ordinary default. <InlineCode>player.surfing</InlineCode> goes{" "}
            <InlineCode>true</InlineCode> while a contact plane qualifies.
          </P>

          <P className="mt-3">
            <InlineCode>World</InlineCode> also exposes lower-level queries:
          </P>
          <Code>{`world.trace(start, end, mins, maxs)        // hull sweep → TraceResult
world.isPositionFree(origin, mins, maxs)  // does the hull fit here?
world.ladderAt(origin, mins, maxs)        // which ladder (if any)?`}</Code>

          {/* PlayerController */}
          <H2>PlayerController</H2>
          <P>
            <InlineCode>PlayerController</InlineCode> is the whole simulation.
            One <InlineCode>tick(dt)</InlineCode> call runs the full pipeline
            in order:
          </P>
          <div className="mt-3 p-4 bg-white/[0.03] border border-white/5 rounded-lg text-[13px] text-white/60 font-mono">
            duck → ladder → jump → ground friction / accelerate (or air
            accelerate) → gravity → collision → landing → categorize
          </div>
          <P className="mt-3">
            It mutates the controller&apos;s own fields — no allocation per
            tick. The constructor:
          </P>
          <Code>{`new PlayerController(world: World, settings: Settings, spawn: Vec3, opts?: PlayerOptions)

interface PlayerOptions {
  log?: (msg: string) => void; // anomalies: unstuck pops, velocity kills
}`}</Code>

          <P className="mt-3">Read these each frame to render:</P>
          <Table
            headers={["Field", "Type", "Meaning"]}
            rows={[
              [
                <InlineCode key="0">origin</InlineCode>,
                "Vec3",
                "World-space position (Source units, Y-up)",
              ],
              [
                <InlineCode key="1">velocity</InlineCode>,
                "Vec3",
                "Velocity (Source units/sec)",
              ],
              [
                <InlineCode key="2">yaw</InlineCode>,
                "number",
                "View angle in degrees, 0 looks down -Z",
              ],
              [
                <InlineCode key="3">pitch</InlineCode>,
                "number",
                "Vertical look angle in degrees",
              ],
              [
                <InlineCode key="4">onGround</InlineCode>,
                "boolean",
                "True when grounded",
              ],
              [
                <InlineCode key="5">groundNormal</InlineCode>,
                "Vec3",
                "Normal of the standing surface",
              ],
              [
                <InlineCode key="6">ducked</InlineCode>,
                "boolean",
                "Duck state",
              ],
              [
                <InlineCode key="7">duckFrac</InlineCode>,
                "number",
                "0→1 eye-height lerp progress",
              ],
              [
                <InlineCode key="8">surfing</InlineCode>,
                "boolean",
                "True while riding a surf slope",
              ],
              [
                <InlineCode key="9">onLadder</InlineCode>,
                "LadderVolume | null",
                "Currently gripped ladder, if any",
              ],
              [
                <InlineCode key="10">horizontalSpeed</InlineCode>,
                "number",
                "length2D(velocity) — the HUD number",
              ],
              [
                <InlineCode key="11">eyeHeight</InlineCode>,
                "number",
                "Lerped eye height for duck state",
              ],
              [
                <InlineCode key="12">stamina</InlineCode>,
                "number",
                "Fatigue pool (0..max) when enabled",
              ],
              [
                <InlineCode key="13">lastHopQuality</InlineCode>,
                "'perfect' | 'normal' | null",
                "Quality of the last takeoff",
              ],
              [
                <InlineCode key="14">landingVelocity</InlineCode>,
                "Vec3",
                "Velocity snapshotted at last landing",
              ],
              [
                <InlineCode key="15">prevPos / currPos</InlineCode>,
                "Vec3",
                "Per-tick position snapshots for interpolation",
              ],
              [
                <InlineCode key="16">prevEye / currEye</InlineCode>,
                "number",
                "Per-tick eye-height snapshots",
              ],
              [
                <InlineCode key="17">landPunch</InlineCode>,
                "number",
                "Downward view-punch from hard landing (decays each tick)",
              ],
            ]}
          />

          <P className="mt-3">Other methods:</P>
          <Code>{`player.respawn(): void            // reset to spawn
player.tickHistoryText(): string  // last 384 ticks as text (bug reports)
player.bindInput(target: HTMLElement): void  // browser: WASD + mouse`}</Code>

          {/* Input */}
          <H2>Input</H2>
          <P>
            <InlineCode>bindInput(element)</InlineCode> wires:
          </P>
          <Table
            headers={["Key", "Action"]}
            rows={[
              ["W / A / S / D", "forward / left / back / right"],
              ["Space", "jump (held)"],
              ["Shift", "walk"],
              ["Ctrl / C", "duck"],
              ["R", "reset (respawn)"],
              ["Mouse (pointer lock)", "yaw / pitch"],
              ["Mousewheel", "jump (one-tick pulse per notch)"],
            ]}
          />
          <P className="mt-3">
            Mousewheel bhop: each notch queues a single tick&apos;s worth of{" "}
            <InlineCode>+jump</InlineCode>, matching chasemod wheel-bhop. A
            burst of notches in one frame collapses into one press (Source&apos;s
            per-command-frame batching). A fresh notch after the previous one
            was consumed re-arms a new press.
          </P>
          <P className="mt-3">
            Or drive <InlineCode>player.input</InlineCode> directly for AI,
            replays, or custom input:
          </P>
          <Code>{`player.input.forward = true;
player.input.jump = true;
player.yaw += 2;
player.tick(1 / 128);`}</Code>

          {/* Settings */}
          <H2>Settings</H2>
          <P>
            Every tunable lives on one <InlineCode>Settings</InlineCode> object,
            passed to the constructor and read fresh every tick. Mutate it live
            — the next tick picks it up.
          </P>
          <Code>{`import { DEFAULT_SETTINGS } from '@unsurf/cs-movement';
const settings = structuredClone(DEFAULT_SETTINGS);
settings.autobhop = true;
settings.bhopSpeedClamp = false; // uncapped CS:GO-style bhop
settings.airAccelerate = 100;   // KZ server (CS:GO default is 12)`}</Code>

          <Table
            headers={["Setting", "Default", "Meaning"]}
            rows={[
              [
                <InlineCode key="0">sensitivity</InlineCode>,
                "1.5",
                "Mouse sensitivity multiplier",
              ],
              [
                <InlineCode key="1">mYaw</InlineCode>,
                "0.022",
                "Degrees per mouse count (CS:GO m_yaw)",
              ],
              [
                <InlineCode key="2">fov</InlineCode>,
                "90",
                "Horizontal FOV, CS:GO 4:3 terms (render-only)",
              ],
              [
                <InlineCode key="3">tickRate</InlineCode>,
                "128",
                "Advisory — you choose the dt passed to tick()",
              ],
              [
                <InlineCode key="4">autobhop</InlineCode>,
                "true",
                "Holding jump re-hops every grounded tick",
              ],
              [
                <InlineCode key="5">bhopSpeedClamp</InlineCode>,
                "true",
                "Clamp takeoff to 1.1× maxspeed",
              ],
              [
                <InlineCode key="6">noPrestrafe</InlineCode>,
                "true",
                "Hard ceiling on ground speed (nopre)",
              ],
              [
                <InlineCode key="7">airAccelerate</InlineCode>,
                "100",
                "sv_airaccelerate — CS:GO default is 12",
              ],
              [
                <InlineCode key="8">runSpeed</InlineCode>,
                "250",
                "Max ground speed (units/sec)",
              ],
              [
                <InlineCode key="9">walkSpeed</InlineCode>,
                "130",
                "Max walk speed (units/sec)",
              ],
              [
                <InlineCode key="10">crouchSpeed</InlineCode>,
                "85",
                "Max crouch speed (units/sec)",
              ],
              [
                <InlineCode key="11">viewPunch</InlineCode>,
                "false",
                "Landing view-punch offset",
              ],
              [
                <InlineCode key="12">stamina</InlineCode>,
                "disabled",
                "CS2 fatigue pool (nested object)",
              ],
              [
                <InlineCode key="13">perf</InlineCode>,
                "disabled",
                "Perfect-bhop velocity carry (nested object)",
              ],
            ]}
          />
        </section>

        {/* ─── Features ─── */}
        <section className="mt-14">
          <SectionTitle>Features</SectionTitle>

          <H2>Bunnyhopping</H2>
          <Table
            headers={["autobhop", "bhopSpeedClamp", "Behavior"]}
            rows={[
              [
                "true",
                "true (default)",
                "KZ/HNS — holding jump re-hops, takeoff capped at 1.1× maxspeed",
              ],
              [
                "true",
                "false",
                "Auto-rehop, no clamp — speed compounds without bound",
              ],
              [
                "false",
                "either",
                "Vanilla — jump fires only on fresh +jump press (pogo-stick rule)",
              ],
            ]}
          />
          <P className="mt-3">
            The pogo-stick rule: if <InlineCode>+jump</InlineCode> was already
            held last tick, a new jump doesn&apos;t fire. This is Source
            engine&apos;s actual behavior — holding space doesn&apos;t auto-bhop
            in vanilla CS.
          </P>

          <H2>Surf</H2>
          <P>
            No separate surf mode or flag — it falls directly out of collision.
            Any brush face whose normal is too steep to stand on (
            <InlineCode>normal.y &lt; STANDABLE_NORMAL</InlineCode>, ~45.57°)
            but not vertical gets clipped with{" "}
            <InlineCode>OVERBOUNCE_SURF</InlineCode> (no speed loss) instead of
            the ordinary default, and{" "}
            <InlineCode>player.surfing</InlineCode> goes{" "}
            <InlineCode>true</InlineCode>.
          </P>
          <P className="mt-3">
            Build a surf ramp with{" "}
            <InlineCode>brushFromOrientedBox</InlineCode> and tilt the local Y
            axis into that range. The normal matters, not an explicit angle
            parameter — the library figures out surf/walk from geometry alone.
          </P>

          <H2>Air Strafing</H2>
          <P>
            <InlineCode>sv_airaccelerate</InlineCode> is faithful to CS:GO.
            The asymmetric addspeed/accelspeed behavior — comparing against{" "}
            <InlineCode>dot(velocity, wishdir)</InlineCode> rather than{" "}
            <InlineCode>|velocity|</InlineCode> — is what makes prestrafe and
            air-strafe technique work.
          </P>
          <P className="mt-3">
            The air-speed cap is a soft ceiling via diminishing returns (not a
            hard clamp). Speeds at or below{" "}
            <InlineCode>AIR_SPEED_CAP</InlineCode> (30) are untouched; gains
            shrink the further past it you push. When{" "}
            <InlineCode>perf.enabled</InlineCode>, the ceiling is{" "}
            <InlineCode>perf.maxAirSpeed</InlineCode> (390) instead, approached
            via a diminishing-returns curve every airborne tick.
          </P>

          <H2>Perf — Perfect Bhop</H2>
          <P>
            A skill-timed instant rejump — manual input, the tick right after
            landing — restores your landing velocity exactly, bypassing whatever{" "}
            <InlineCode>bhopSpeedClamp</InlineCode> or friction reduced it to.
          </P>
          <P className="mt-3">
            Nothing else qualifies, ever:
          </P>
          <ul className="mt-2 space-y-1.5 text-[13px] text-white/50 list-disc list-inside">
            <li>
              A rejump even one tick late gets nothing — no partial credit.
            </li>
            <li>
              <InlineCode>autobhop</InlineCode> never gets the carry (held-jump
              always re-fires instantly, defeating the clamp).
            </li>
            <li>
              A landing off a surf ramp never counts — surf speed isn&apos;t
              something you &quot;cash in&quot; as a perfect bhop.
            </li>
            <li>
              The very first jump of a life never carries (gravity settling
              looks like a landing).
            </li>
          </ul>
          <P className="mt-3">
            <InlineCode>player.lastHopQuality</InlineCode> reports{" "}
            <InlineCode>&apos;perfect&apos;</InlineCode>,{" "}
            <InlineCode>&apos;normal&apos;</InlineCode>, or{" "}
            <InlineCode>null</InlineCode> — flash a HUD element off it, drive
            an audio cue, whatever.
          </P>

          <H2>Stamina</H2>
          <P>
            CS2-style fatigue pool. Jumping and landing fill it; it drains back
            to 0 over time; while full-ish both ground speed and jump velocity
            are throttled by up to <InlineCode>maxPenalty</InlineCode>.
          </P>
          <Code>{`interface StaminaSettings {
  enabled: boolean;      // default false
  max: number;           // default 1
  jumpCost: number;      // default 0.08 (fraction of max per jump)
  landCost: number;      // default 0.05 (fraction of max per landing)
  recoveryRate: number;  // default 0.5  (fraction of max per second)
  maxPenalty: number;    // default 0.4  (speed cut at full pool)
}`}</Code>
          <P className="mt-3">
            Disabled by default — every bhop preset plays with this off. Read{" "}
            <InlineCode>player.stamina</InlineCode> (0..max) directly for a HUD
            meter.
          </P>

          <H2>Ducking</H2>
          <P>
            Hold <InlineCode>input.duck</InlineCode>; the hull shrinks from
            32×32×72 standing to 32×32×54 ducked.{" "}
            <InlineCode>duckFrac</InlineCode> (0→1) lerps over{" "}
            <InlineCode>DUCK_LERP_TIME</InlineCode> (0.2s) for smooth eye
            height. Ducking mid-air pulls the feet up so the head stays put —
            duck onto ledges, same as CS.
          </P>

          <H2>Ladders</H2>
          <P>
            Walk into a ladder volume facing it (or touch one mid-air) to grip.
            Climbing uses the full 3D view basis — looking up while holding
            forward climbs, looking down descends. Forward + strafe stacks both
            contributions for CS:GO&apos;s authentic ~1.41× &quot;fastclimb&quot;.
            Press jump to push off in the direction the ladder faces.
          </P>
        </section>

        {/* ─── API Reference ─── */}
        <section className="mt-14">
          <SectionTitle>API Reference</SectionTitle>
          <P>
            Everything is exported from{" "}
            <InlineCode>@unsurf/cs-movement</InlineCode>.
          </P>

          <H3>PlayerController</H3>
          <Table
            headers={["Signature", "Description"]}
            rows={[
              [
                <InlineCode key="0">
                  new PlayerController(world, settings, spawn, opts?)
                </InlineCode>,
                "Main class. opts.log fires on anomalies.",
              ],
              [
                <InlineCode key="1">.tick(dt: number): void</InlineCode>,
                "One simulation step. dt in seconds (1/128 for 128-tick).",
              ],
              [
                <InlineCode key="2">.respawn(): void</InlineCode>,
                "Reset to spawn point.",
              ],
              [
                <InlineCode key="3">.bindInput(el: HTMLElement): void</InlineCode>,
                "Wire keyboard + pointer-lock mouse to an element.",
              ],
              [
                <InlineCode key="4">.tickHistoryText(): string</InlineCode>,
                "Last 384 ticks as newline-joined text.",
              ],
              [
                <InlineCode key="5">.input: InputState</InlineCode>,
                "Mutable — forward, back, left, right, jump, duck, walk, reset.",
              ],
              [
                <InlineCode key="6">.mins / .maxs: Vec3 (getters)</InlineCode>,
                "Current hull extents (stand or duck).",
              ],
              [
                <InlineCode key="7">.horizontalSpeed: number (getter)</InlineCode>,
                "length2D(velocity).",
              ],
              [
                <InlineCode key="8">.eyeHeight: number (getter)</InlineCode>,
                "Lerped eye height.",
              ],
            ]}
          />

          <H3>World</H3>
          <Table
            headers={["Signature", "Description"]}
            rows={[
              [
                <InlineCode key="0">.solids: Brush[]</InlineCode>,
                "Collision geometry (flat list).",
              ],
              [
                <InlineCode key="1">.ladders: LadderVolume[]</InlineCode>,
                "Ladder volumes.",
              ],
              [
                <InlineCode key="2">
                  .trace(start, end, mins, maxs): TraceResult
                </InlineCode>,
                "Hull sweep against all solids.",
              ],
              [
                <InlineCode key="3">
                  .isPositionFree(origin, mins, maxs): boolean
                </InlineCode>,
                "Does the hull fit here?",
              ],
              [
                <InlineCode key="4">
                  .ladderAt(origin, mins, maxs): LadderVolume | null
                </InlineCode>,
                "Which ladder contains this hull?",
              ],
            ]}
          />

          <H3>Collision</H3>
          <Table
            headers={["Signature", "Description"]}
            rows={[
              [
                <InlineCode key="0">
                  brushFromAABB(min: Vec3, max: Vec3): Brush
                </InlineCode>,
                "Axis-aligned box from two corners.",
              ],
              [
                <InlineCode key="1">
                  brushFromOrientedBox(center, halfExtents, ax, ay, az): Brush
                </InlineCode>,
                "Oriented box — for ramps and surf.",
              ],
              [
                <InlineCode key="2">
                  traceBox(start, end, mins, maxs, brushes): TraceResult
                </InlineCode>,
                "Minkowski-expansion hull trace.",
              ],
              [
                <InlineCode key="3">
                  boxInBrush(origin, mins, maxs, brush): boolean
                </InlineCode>,
                "Box containment test.",
              ],
            ]}
          />

          <H3>Collision Types</H3>
          <Code>{`interface Plane {
  normal: Vec3;  // outward-facing unit normal
  dist: number;  // dot(normal, pointOnPlane)
}

interface Brush {
  planes: Plane[];
  min: Vec3;  // AABB broadphase bounds
  max: Vec3;
}

interface LadderVolume extends Brush {
  facing: Vec3;  // direction the climbable face points
}

interface TraceResult {
  fraction: number;    // 0..1 of move completed
  endPos: Vec3;
  normal: Vec3 | null; // hit plane, null if fraction === 1
  startSolid: boolean;
  allSolid: boolean;
}`}</Code>

          <H3>Settings Types</H3>
          <Code>{`interface Settings {
  sensitivity: number;
  mYaw: number;
  fov: number;
  tickRate: number;
  autobhop: boolean;
  bhopSpeedClamp: boolean;
  noPrestrafe: boolean;
  airAccelerate: number;
  runSpeed: number;
  walkSpeed: number;
  crouchSpeed: number;
  showSpeed: boolean;
  showFps: boolean;
  showDebug: boolean;
  viewPunch: boolean;
  crosshair: CrosshairSettings;
  stamina: StaminaSettings;
  perf: PerfSettings;
}

interface CrosshairSettings {
  color: string;
  size: number;
  thickness: number;
  gap: number;
  outline: boolean;
  dot: boolean;
  tStyle: boolean;
}

interface StaminaSettings {
  enabled: boolean;
  max: number;
  jumpCost: number;
  landCost: number;
  recoveryRate: number;
  maxPenalty: number;
}

interface PerfSettings {
  enabled: boolean;
  maxAirSpeed: number; // default 390
}`}</Code>

          <H3>Math</H3>
          <Table
            headers={["Function", "Signature"]}
            rows={[
              [
                <InlineCode key="0">vec3</InlineCode>,
                "vec3(x?, y?, z?): Vec3 — constructor",
              ],
              [
                <InlineCode key="1">copy</InlineCode>,
                "copy(out, a): Vec3 — out = a",
              ],
              [
                <InlineCode key="2">set</InlineCode>,
                "set(out, x, y, z): Vec3",
              ],
              [
                <InlineCode key="3">add</InlineCode>,
                "add(out, a, b): Vec3",
              ],
              [
                <InlineCode key="4">sub</InlineCode>,
                "sub(out, a, b): Vec3",
              ],
              [
                <InlineCode key="5">addScaled</InlineCode>,
                "addScaled(out, a, b, s): Vec3 — a + b*s",
              ],
              [
                <InlineCode key="6">scale</InlineCode>,
                "scale(out, a, s): Vec3",
              ],
              [
                <InlineCode key="7">dot</InlineCode>,
                "dot(a, b): number",
              ],
              [
                <InlineCode key="8">cross</InlineCode>,
                "cross(out, a, b): Vec3",
              ],
              [
                <InlineCode key="9">length</InlineCode>,
                "length(a): number",
              ],
              [
                <InlineCode key="10">length2D</InlineCode>,
                "length2D(a): number — sqrt(x² + z²)",
              ],
              [
                <InlineCode key="11">lengthSq</InlineCode>,
                "lengthSq(a): number",
              ],
              [
                <InlineCode key="12">normalize</InlineCode>,
                "normalize(out, a): Vec3",
              ],
              [
                <InlineCode key="13">clone</InlineCode>,
                "clone(a): Vec3",
              ],
            ]}
          />

          <H3>Physics (pure functions)</H3>
          <Table
            headers={["Function", "Description"]}
            rows={[
              [
                <InlineCode key="0">applyFriction(ctx, dt)</InlineCode>,
                "Ground friction per Source's sv_friction",
              ],
              [
                <InlineCode key="1">accelerate(ctx, wishdir, wishspeed, dt)</InlineCode>,
                "Ground acceleration per sv_accelerate",
              ],
              [
                <InlineCode key="2">airAccelerate(ctx, wishdir, wishspeed, dt)</InlineCode>,
                "Air acceleration per sv_airaccelerate",
              ],
              [
                <InlineCode key="3">clipVelocity(in, normal, out, overbounce)</InlineCode>,
                "Clip velocity against a contact plane",
              ],
              [
                <InlineCode key="4">addStamina(current, cost, max)</InlineCode>,
                "Add fatigue from a jump/landing",
              ],
              [
                <InlineCode key="5">recoverStamina(current, rate, max, dt)</InlineCode>,
                "Drain fatigue over time",
              ],
              [
                <InlineCode key="6">staminaPenaltyMultiplier(stamina, max, maxPenalty)</InlineCode>,
                "Speed multiplier from fatigue",
              ],
              [
                <InlineCode key="7">applyAirSpeedCeiling(speed, maxAirSpeed)</InlineCode>,
                "Diminishing-returns air speed cap",
              ],
            ]}
          />

          <H3>Constants</H3>
          <Table
            headers={["Constant", "Value", "Source engine equivalent"]}
            rows={[
              [
                <InlineCode key="0">GRAVITY</InlineCode>,
                "800",
                "sv_gravity (u/s²)",
              ],
              [
                <InlineCode key="1">RUN_SPEED</InlineCode>,
                "250",
                "knife/no-weapon speed",
              ],
              [
                <InlineCode key="2">WALK_SPEED</InlineCode>,
                "130",
                "+speed (shift)",
              ],
              [
                <InlineCode key="3">CROUCH_SPEED</InlineCode>,
                "85",
                "crouch speed",
              ],
              [
                <InlineCode key="4">STANDABLE_NORMAL</InlineCode>,
                "0.7",
                "ground if normal.y ≥ 0.7 (~45.57°)",
              ],
              [
                <InlineCode key="5">M_YAW</InlineCode>,
                "0.022",
                "m_yaw / m_pitch",
              ],
              [
                <InlineCode key="6">PITCH_CLAMP</InlineCode>,
                "89",
                "max vertical look angle",
              ],
              [
                <InlineCode key="7">AIR_ACCELERATE</InlineCode>,
                "100",
                "sv_airaccelerate (CS:GO default: 12)",
              ],
              [
                <InlineCode key="8">AIR_SPEED_CAP</InlineCode>,
                "30",
                "wishspeed clamp while airborne",
              ],
              [
                <InlineCode key="9">DIST_EPSILON</InlineCode>,
                "0.03125",
                "Source trace epsilon (1/32 unit)",
              ],
              [
                <InlineCode key="10">DEFAULT_TICK_RATE</InlineCode>,
                "128",
                "tick rate advisory",
              ],
              [
                <InlineCode key="11">MAX_FRAME_TIME</InlineCode>,
                "0.1",
                "rAF delta clamp",
              ],
            ]}
          />
        </section>

        {/* ─── Recipes ─── */}
        <section className="mt-14">
          <SectionTitle>Recipes</SectionTitle>

          <H2>Integrate with Three.js</H2>
          <Code>{`// In your render loop:
camera.position.set(
  player.origin.x,
  player.origin.y + player.eyeHeight,
  player.origin.z,
);
camera.rotation.order = "YXZ";
camera.rotation.y = THREE.MathUtils.degToRad(-player.yaw);
camera.rotation.x = THREE.MathUtils.degToRad(player.pitch);

// For smooth interpolation between fixed ticks:
const t = accumulator / dt; // 0..1 blend factor
camera.position.lerpVectors(
  new THREE.Vector3(player.prevPos.x, player.prevPos.y + player.prevEye, player.prevPos.z),
  new THREE.Vector3(player.currPos.x, player.currPos.y + player.currEye, player.currPos.z),
  t,
);`}</Code>

          <H2>Server-Side Replay Validation</H2>
          <Code>{`import { World, PlayerController, brushFromAABB, vec3, DEFAULT_SETTINGS } from '@unsurf/cs-movement';

const world = new World();
world.solids.push(brushFromAABB(vec3(-8192, -64, -8192), vec3(8192, 0, 8192)));

const player = new PlayerController(world, structuredClone(DEFAULT_SETTINGS), vec3(0, 5, 0), {
  log: (msg) => console.warn("[movement]", msg),
});

// Replay recorded inputs:
for (let i = 0; i < recordedInput.length; i++) {
  Object.assign(player.input, recordedInput[i]);
  player.tick(1 / 128);
}

// Dump for audit:
console.log(player.tickHistoryText());`}</Code>

          <H2>Custom Input (AI / Replays)</H2>
          <Code>{`// Skip bindInput entirely — drive the simulation:
player.input.forward = true;
player.input.jump = (tick % 64 < 1); // jump every 64 ticks
player.yaw += 2; // constant turn
player.tick(1 / 128);`}</Code>

          <H2>Fixed Timestep with Interpolation</H2>
          <Code>{`const TICK_DT = 1 / 128;
let accumulator = 0;

function gameLoop(frameDt: number) {
  accumulator += frameDt;

  while (accumulator >= TICK_DT) {
    player.tick(TICK_DT);
    accumulator -= TICK_DT;
  }

  // Blend between prevPos and currPos for smooth rendering:
  const alpha = accumulator / TICK_DT;
  const renderX = player.prevPos.x + (player.currPos.x - player.prevPos.x) * alpha;
  const renderY = player.prevPos.y + (player.currPos.y - player.prevPos.y) * alpha;
  const renderZ = player.prevPos.z + (player.currPos.z - player.prevPos.z) * alpha;
  const renderEye = player.prevEye + (player.currEye - player.prevEye) * alpha;
  // position camera at (renderX, renderY + renderEye, renderZ)
}`}</Code>

          <H2>Build a Surf Map</H2>
          <Code>{`const world = new World();

// Floor
world.solids.push(brushFromAABB(vec3(-2048, -16, -2048), vec3(2048, 0, 2048)));

// Surf ramp — tilt local Y ~30° from vertical
const ramp = brushFromOrientedBox(
  vec3(0, 200, 0),       // center
  vec3(512, 16, 200),    // half-extents
  vec3(1, 0, 0),         // local X
  vec3(0, 0.5, 0.866),   // local Y — tilted ~30° from vertical
  vec3(0, -0.866, 0.5),  // local Z
);
world.solids.push(ramp);

// Staircase
for (let i = 0; i < 10; i++) {
  world.solids.push(brushFromAABB(
    vec3(-100, i * 16, i * 100),
    vec3(100, (i + 1) * 16, (i + 1) * 100),
  ));
}`}</Code>
        </section>

        {/* ─── Troubleshooting ─── */}
        <section className="mt-14">
          <SectionTitle>Troubleshooting</SectionTitle>

          <H3>Player falls through the floor</H3>
          <P>
            The floor&apos;s normal is below{" "}
            <InlineCode>STANDABLE_NORMAL</InlineCode> (0.7, ~45.57°). Check
            your brush normals — the standing face needs{" "}
            <InlineCode>normal.y &gt;= 0.7</InlineCode>. If it&apos;s a ramp,
            it might be a surf slope instead.
          </P>

          <H3>No surf</H3>
          <P>
            The ramp angle is either too flat (normal.y ≥ 0.7 = walkable) or
            perfectly vertical (normal.y ≈ 0 = wall). Surf needs the normal
            between ~0 and ~0.7. Use{" "}
            <InlineCode>brushFromOrientedBox</InlineCode> to tilt precisely.
          </P>

          <H3>Jump doesn&apos;t fire</H3>
          <P>
            With <InlineCode>autobhop: false</InlineCode>, jump only fires on a
            fresh press — if <InlineCode>+jump</InlineCode> was held last tick,
            nothing happens (pogo-stick rule). With{" "}
            <InlineCode>autobhop: true</InlineCode>, holding space should
            auto-rehop every grounded tick.
          </P>

          <H3>Performance</H3>
          <P>
            The simulation is zero-allocation per tick. The bottleneck is{" "}
            <InlineCode>trace()</InlineCode> — brush count matters. Each brush
            has 6+ planes, and the trace tests all of them. For large maps,
            consider spatial partitioning in your own code and only passing
            nearby brushes to{" "}
            <InlineCode>world.trace()</InlineCode>.
          </P>
        </section>

        {/* ─── Links ─── */}
        <section className="mt-14">
          <SectionTitle>Links</SectionTitle>
          <div className="flex flex-col divide-y divide-white/10">
            <a
              href="https://github.com/unsurf/cs-movement"
              target="_blank"
              rel="noreferrer"
              className="group flex items-baseline gap-4 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-white/50 text-sm flex-1">GitHub</span>
              <span className="text-white/30 text-sm">
                github.com/unsurf/cs-movement
              </span>
              <ArrowDownRight
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
            <a
              href="https://www.npmjs.com/package/@unsurf/cs-movement"
              target="_blank"
              rel="noreferrer"
              className="group flex items-baseline gap-4 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-white/50 text-sm flex-1">npm</span>
              <span className="text-white/30 text-sm">
                @unsurf/cs-movement
              </span>
              <ArrowDownRight
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
            <a
              href="https://hns.unsurf.sh"
              target="_blank"
              rel="noreferrer"
              className="group flex items-baseline gap-4 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-white/50 text-sm flex-1">Demo</span>
              <span className="text-white/30 text-sm">hns.unsurf.sh</span>
              <ArrowDownRight
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
            <a
              href="/cs-movement-agent.txt"
              target="_blank"
              rel="noreferrer"
              className="group flex items-baseline gap-4 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-white/50 text-sm flex-1">For Agents</span>
              <span className="text-white/30 text-sm">
                plain-text reference for AI
              </span>
              <ArrowDownRight
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="mt-16 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/30">
          <span>Apache-2.0 · Copyright 2026 unsurf</span>
          <a
            href="https://github.com/unsurf/cs-movement/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            className="hover:text-green-400 transition-colors"
          >
            License →
          </a>
        </footer>
      </div>
    </div>
  );
}
