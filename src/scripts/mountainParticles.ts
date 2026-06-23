import * as THREE from "three";

const MOBILE_QUERY = "(max-width: 767px)";
const SAMPLE_WIDTH = 520;
const MAX_PARTICLES = 52000;
const TOUCH_SIZE = 96;
const IMAGE_THRESHOLD = 22;
const PARTICLE_FIELD_DENSITY = 0.46;
const MIN_MOUNTAIN_START = 0.34;
const RIDGE_NEIGHBOR_THRESHOLD = 3;
const SCREEN_HIT_CELL_SIZE = 6;
const SCREEN_HIT_RADIUS = 2;
const INTRO_DURATION = 4400;
const INTRO_STAGGER = 0.78;
const INTRO_DROP_DISTANCE = 430;

type ParticleSource = {
  brightness: number;
  color: [number, number, number];
  seed: number;
  u: number;
  v: number;
};

type ParticleSample = {
  columnTops: Int16Array;
  sampleHeight: number;
  sampleWidth: number;
  sources: ParticleSource[];
};

type CoverFrame = {
  displayHeight: number;
  displayWidth: number;
  left: number;
  top: number;
};

type CoverPosition = {
  x: number;
  y: number;
};

type ScreenHitMap = {
  bottomByColumn: Int32Array;
  cellSize: number;
  cells: Uint8Array;
  height: number;
  topByColumn: Int32Array;
  width: number;
};

const vertexShader = `
  attribute vec3 offset;
  attribute vec3 instanceColor;
  attribute float angle;
  attribute float brightness;
  attribute float pindex;
  attribute float randomSeed;
  attribute vec2 touchUv;

  uniform float uDepth;
  uniform float uDropDistance;
  uniform float uOpacity;
  uniform float uReveal;
  uniform float uScatter;
  uniform float uSize;
  uniform float uTime;
  uniform float uTouchStrength;
  uniform sampler2D uTouch;

  varying float vAlpha;
  varying float vBrightness;
  varying float vTouch;
  varying vec2 vUv;
  varying vec3 vColor;

  float easeOutQuart(float value) {
    float x = clamp(value, 0.0, 1.0);
    return 1.0 - pow(1.0 - x, 4.0);
  }

  float easeOutCubic(float value) {
    float x = clamp(value, 0.0, 1.0);
    return 1.0 - pow(1.0 - x, 3.0);
  }

  float easeInOutCubic(float value) {
    float x = clamp(value, 0.0, 1.0);

    if (x < 0.5) {
      return 4.0 * x * x * x;
    }

    return 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
  }

  void main() {
    float arrival = easeInOutCubic(uReveal - randomSeed * ${INTRO_STAGGER.toFixed(2)});
    float reveal = easeOutCubic(uReveal - randomSeed * ${(INTRO_STAGGER * 0.58).toFixed(2)});
    float touch = max(
      texture2D(uTouch, touchUv).r,
      texture2D(uTouch, vec2(touchUv.x, 1.0 - touchUv.y)).r
    );
    vec3 displaced = offset;

    displaced.x += cos(angle) * (1.0 - arrival) * uScatter * (0.14 + randomSeed * 0.24);
    displaced.y += (1.0 - arrival) * uDropDistance * (0.82 + randomSeed * 0.42);
    displaced.xy += vec2(cos(angle), sin(angle)) * touch * uTouchStrength * (0.3 + randomSeed * 0.32);
    displaced.z += touch * uTouchStrength * (0.22 + randomSeed * 0.24);

    float particleSize = uSize * (0.58 + brightness * 1.82 + touch * 0.62) * mix(0.18, 1.0, arrival);
    vec2 local = position.xy * particleSize;

    vAlpha = uOpacity * reveal * (0.35 + brightness * 0.9 + touch * 0.42);
    vBrightness = brightness;
    vColor = instanceColor;
    vTouch = touch;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced.xy + local, displaced.z, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  varying float vAlpha;
  varying float vBrightness;
  varying float vTouch;
  varying vec2 vUv;
  varying vec3 vColor;

  void main() {
    float dist = distance(vUv, vec2(0.5));
    float circle = smoothstep(0.5, 0.18, dist);
    vec3 highlight = vec3(0.95, 0.72, 0.25);
    vec3 color = mix(vColor, highlight, min(0.78, vTouch * 1.15 + vBrightness * 0.1));
    float alpha = circle * vAlpha;

    if (alpha < 0.01) {
      discard;
    }

    gl_FragColor = vec4(color, alpha);
  }
`;

const randomFrom = (x: number, y: number) => {
  const value = Math.sin((x + 1) * 12.9898 + (y + 1) * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  });

const parsePositionValue = (value: string, fallback: number) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return fallback;
  }

  if (trimmed.endsWith("%")) {
    const parsed = Number.parseFloat(trimmed);
    return Number.isFinite(parsed) ? parsed / 100 : fallback;
  }

  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getMountainPosition = (hero: HTMLElement): CoverPosition => {
  const styles = window.getComputedStyle(hero);

  return {
    x: parsePositionValue(styles.getPropertyValue("--mountain-object-x"), 0.5),
    y: parsePositionValue(styles.getPropertyValue("--mountain-object-y"), 1),
  };
};

const getCoverFrame = (
  width: number,
  height: number,
  imageAspect: number,
  position: CoverPosition,
): CoverFrame => {
  const viewAspect = width / height;

  if (viewAspect > imageAspect) {
    const displayWidth = width;
    const displayHeight = width / imageAspect;

    return {
      displayHeight,
      displayWidth,
      left: 0,
      top: (height - displayHeight) * position.y,
    };
  }

  const displayHeight = height;
  const displayWidth = height * imageAspect;

  return {
    displayHeight,
    displayWidth,
    left: (width - displayWidth) * position.x,
    top: 0,
  };
};

const sampleImage = (image: HTMLImageElement): ParticleSample => {
  const sampleHeight = Math.round(SAMPLE_WIDTH / (image.naturalWidth / image.naturalHeight));
  const sampler = document.createElement("canvas");
  const context = sampler.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return {
      columnTops: new Int16Array(0),
      sampleHeight: 0,
      sampleWidth: 0,
      sources: [],
    };
  }

  sampler.width = SAMPLE_WIDTH;
  sampler.height = sampleHeight;
  context.drawImage(image, 0, 0, SAMPLE_WIDTH, sampleHeight);

  const pixels = context.getImageData(0, 0, SAMPLE_WIDTH, sampleHeight).data;
  const columnTops = new Int16Array(SAMPLE_WIDTH);
  const sources: ParticleSource[] = [];

  columnTops.fill(-1);
  const isVisiblePixel = (x: number, y: number) => {
    if (x < 0 || x >= SAMPLE_WIDTH || y < 0 || y >= sampleHeight) {
      return false;
    }

    const index = (y * SAMPLE_WIDTH + x) * 4;
    const alpha = pixels[index + 3] / 255;

    return alpha >= 0.3 && pixels[index] > IMAGE_THRESHOLD;
  };
  const getBrightness = (x: number, y: number) => {
    const index = (y * SAMPLE_WIDTH + x) * 4;
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];

    return (red * 0.21 + green * 0.72 + blue * 0.07) / 255;
  };
  const findMountainTop = (x: number) => {
    const startY = Math.round(sampleHeight * MIN_MOUNTAIN_START);

    for (let y = startY; y < sampleHeight; y += 1) {
      let visibleNeighbors = 0;

      for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
        for (let offsetY = 0; offsetY <= 2; offsetY += 1) {
          if (isVisiblePixel(x + offsetX, y + offsetY)) {
            visibleNeighbors += 1;
          }
        }
      }

      if (visibleNeighbors >= RIDGE_NEIGHBOR_THRESHOLD) {
        return y;
      }
    }

    return -1;
  };

  for (let x = 0; x < SAMPLE_WIDTH; x += 1) {
    const topY = findMountainTop(x);

    if (topY === -1) {
      continue;
    }

    columnTops[x] = topY;

    for (let y = topY; y < sampleHeight; y += 1) {
      const seed = randomFrom(x, y);

      if (randomFrom(x + 311, y + 607) > PARTICLE_FIELD_DENSITY) {
        continue;
      }

      const jitterX = (randomFrom(x + 47, y + 113) - 0.5) * 4.6;
      const jitterY = (randomFrom(x + 191, y + 29) - 0.5) * 2.4;
      const textureBrightness = getBrightness(x, y);
      const brightness = clamp(0.48 + textureBrightness * 0.18 + seed * 0.08, 0.42, 0.72);

      sources.push({
        brightness,
        color: [
          0.52 + brightness * 0.22,
          0.62 + brightness * 0.18,
          0.54 + brightness * 0.18,
        ],
        seed,
        u: clamp((x + 0.5 + jitterX) / SAMPLE_WIDTH, 0, 1),
        v: clamp((y + 0.5 + jitterY) / sampleHeight, 0, 1),
      });
    }
  }

  if (sources.length <= MAX_PARTICLES) {
    return {
      columnTops,
      sampleHeight,
      sampleWidth: SAMPLE_WIDTH,
      sources,
    };
  }

  const keepProbability = MAX_PARTICLES / sources.length;
  const cappedSources = sources.filter(
    (source, index) => randomFrom(source.seed * 10000, index) < keepProbability,
  );

  return {
    columnTops,
    sampleHeight,
    sampleWidth: SAMPLE_WIDTH,
    sources: cappedSources.slice(0, MAX_PARTICLES),
  };
};

const createScreenHitMap = (width: number, height: number): ScreenHitMap => {
  const mapWidth = Math.ceil(width / SCREEN_HIT_CELL_SIZE);
  const mapHeight = Math.ceil(height / SCREEN_HIT_CELL_SIZE);
  const bottomByColumn = new Int32Array(mapWidth);
  const topByColumn = new Int32Array(mapWidth);

  bottomByColumn.fill(-1);
  topByColumn.fill(mapHeight);

  return {
    bottomByColumn,
    cellSize: SCREEN_HIT_CELL_SIZE,
    cells: new Uint8Array(mapWidth * mapHeight),
    height: mapHeight,
    topByColumn,
    width: mapWidth,
  };
};

const markScreenHit = (map: ScreenHitMap, screenX: number, screenY: number) => {
  const centerX = Math.round(screenX / map.cellSize);
  const centerY = Math.round(screenY / map.cellSize);

  for (let y = centerY - SCREEN_HIT_RADIUS; y <= centerY + SCREEN_HIT_RADIUS; y += 1) {
    if (y < 0 || y >= map.height) {
      continue;
    }

    for (let x = centerX - SCREEN_HIT_RADIUS; x <= centerX + SCREEN_HIT_RADIUS; x += 1) {
      if (x < 0 || x >= map.width) {
        continue;
      }

      map.cells[y * map.width + x] = 1;
      map.topByColumn[x] = Math.min(map.topByColumn[x], y);
      map.bottomByColumn[x] = Math.max(map.bottomByColumn[x], y);
    }
  }
};

const markScreenBand = (map: ScreenHitMap, screenX: number, screenTop: number, screenBottom: number) => {
  const centerX = Math.round(screenX / map.cellSize);
  const top = clamp(Math.floor(screenTop / map.cellSize) - SCREEN_HIT_RADIUS, 0, map.height - 1);
  const bottom = clamp(Math.ceil(screenBottom / map.cellSize) + SCREEN_HIT_RADIUS, 0, map.height - 1);

  for (let x = centerX - SCREEN_HIT_RADIUS; x <= centerX + SCREEN_HIT_RADIUS; x += 1) {
    if (x < 0 || x >= map.width) {
      continue;
    }

    map.topByColumn[x] = Math.min(map.topByColumn[x], top);
    map.bottomByColumn[x] = Math.max(map.bottomByColumn[x], bottom);
  }
};

const markTerrainBand = (map: ScreenHitMap, frame: CoverFrame, sample: ParticleSample, height: number) => {
  if (sample.sampleHeight === 0 || sample.sampleWidth === 0) {
    return;
  }

  const screenBottom = Math.min(height, frame.top + frame.displayHeight);

  for (let x = 0; x < sample.sampleWidth; x += 1) {
    const topY = sample.columnTops[x];

    if (topY < 0) {
      continue;
    }

    const screenX = frame.left + ((x + 0.5) / sample.sampleWidth) * frame.displayWidth;
    const screenTop = frame.top + (topY / sample.sampleHeight) * frame.displayHeight;

    markScreenBand(map, screenX, screenTop, screenBottom);
  }
};

const isScreenParticleHit = (map: ScreenHitMap | undefined, screenX: number, screenY: number) => {
  if (!map) {
    return false;
  }

  const centerX = Math.round(screenX / map.cellSize);
  const centerY = Math.round(screenY / map.cellSize);

  for (let x = centerX - SCREEN_HIT_RADIUS; x <= centerX + SCREEN_HIT_RADIUS; x += 1) {
    if (x < 0 || x >= map.width || map.bottomByColumn[x] < 0) {
      continue;
    }

    if (
      centerY >= map.topByColumn[x] - SCREEN_HIT_RADIUS &&
      centerY <= map.bottomByColumn[x] + SCREEN_HIT_RADIUS
    ) {
      return true;
    }
  }

  for (let y = centerY - SCREEN_HIT_RADIUS; y <= centerY + SCREEN_HIT_RADIUS; y += 1) {
    if (y < 0 || y >= map.height) {
      continue;
    }

    for (let x = centerX - SCREEN_HIT_RADIUS; x <= centerX + SCREEN_HIT_RADIUS; x += 1) {
      if (x < 0 || x >= map.width) {
        continue;
      }

      if (map.cells[y * map.width + x] === 1) {
        return true;
      }
    }
  }

  return false;
};

export const initMountainParticles = () => {
  const canvases = document.querySelectorAll<HTMLCanvasElement>("[data-mountain-webgl]");

  canvases.forEach((canvas) => {
    const hero = canvas.closest<HTMLElement>(".home-hero");
    const image = hero?.querySelector<HTMLImageElement>(".home-hero__mountain-image");

    if (!hero || !image) {
      return;
    }

    const mobileQuery = window.matchMedia(MOBILE_QUERY);
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mobileQuery.matches) {
      hero.dataset.mountainMotion = "disabled";
      canvas.hidden = true;
      return;
    }

    if (reducedMotionQuery.matches) {
      hero.dataset.mountainMotion = "reduced";
      canvas.hidden = true;
      return;
    }

    let animationFrame = 0;
    let camera: THREE.OrthographicCamera;
    let geometry: THREE.InstancedBufferGeometry | undefined;
    let material: THREE.ShaderMaterial;
    let mesh: THREE.Mesh | undefined;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let sourceImage: HTMLImageElement;
    let particleSample: ParticleSample;
    let particleSources: ParticleSource[] = [];
    let screenHitMap: ScreenHitMap | undefined;
    let width = 0;
    let height = 0;
    let frame: CoverFrame;
    let startedAt = performance.now();
    let disposed = false;

    const touchCanvas = document.createElement("canvas");
    const touchContext = touchCanvas.getContext("2d");
    const trail: Array<{ age: number; force: number; u: number; v: number }> = [];

    touchCanvas.width = TOUCH_SIZE;
    touchCanvas.height = TOUCH_SIZE;

    const touchTexture = new THREE.CanvasTexture(touchCanvas);
    touchTexture.minFilter = THREE.LinearFilter;
    touchTexture.magFilter = THREE.LinearFilter;

    const disposeMesh = () => {
      if (mesh) {
        scene.remove(mesh);
        mesh = undefined;
      }

      geometry?.dispose();
      geometry = undefined;
    };

    const buildGeometry = () => {
      disposeMesh();

      const imageAspect = sourceImage.naturalWidth / sourceImage.naturalHeight;
      frame = getCoverFrame(width, height, imageAspect, getMountainPosition(hero));
      const nextScreenHitMap = createScreenHitMap(width, height);
      screenHitMap = nextScreenHitMap;
      markTerrainBand(nextScreenHitMap, frame, particleSample, height);
      geometry = new THREE.InstancedBufferGeometry();

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
          new Float32Array([-0.5, 0.5, 0, 0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0]),
          3,
        ),
      );
      geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]), 2));
      geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

      const offsets = new Float32Array(particleSources.length * 3);
      const colors = new Float32Array(particleSources.length * 3);
      const angles = new Float32Array(particleSources.length);
      const brightnesses = new Float32Array(particleSources.length);
      const indices = new Float32Array(particleSources.length);
      const seeds = new Float32Array(particleSources.length);
      const touchUvs = new Float32Array(particleSources.length * 2);

      particleSources.forEach((particle, index) => {
        const screenX = frame.left + particle.u * frame.displayWidth;
        const screenY = frame.top + particle.v * frame.displayHeight;

        markScreenHit(nextScreenHitMap, screenX, screenY);

        offsets[index * 3] = screenX - width / 2;
        offsets[index * 3 + 1] = height / 2 - screenY;
        offsets[index * 3 + 2] = (particle.seed - 0.5) * 24;

        colors[index * 3] = particle.color[0];
        colors[index * 3 + 1] = particle.color[1];
        colors[index * 3 + 2] = particle.color[2];

        angles[index] = particle.seed * Math.PI * 2;
        brightnesses[index] = particle.brightness;
        indices[index] = index;
        seeds[index] = particle.seed;
        touchUvs[index * 2] = Math.min(1, Math.max(0, screenX / width));
        touchUvs[index * 2 + 1] = Math.min(1, Math.max(0, screenY / height));
      });

      geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3));
      geometry.setAttribute("instanceColor", new THREE.InstancedBufferAttribute(colors, 3));
      geometry.setAttribute("angle", new THREE.InstancedBufferAttribute(angles, 1));
      geometry.setAttribute("brightness", new THREE.InstancedBufferAttribute(brightnesses, 1));
      geometry.setAttribute("pindex", new THREE.InstancedBufferAttribute(indices, 1));
      geometry.setAttribute("randomSeed", new THREE.InstancedBufferAttribute(seeds, 1));
      geometry.setAttribute("touchUv", new THREE.InstancedBufferAttribute(touchUvs, 2));
      geometry.instanceCount = particleSources.length;

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    };

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      width = Math.max(768, Math.round(rect.width));
      height = Math.max(420, Math.round(rect.height));

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);

      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.updateProjectionMatrix();

      buildGeometry();
    };

    const clearTouch = () => {
      if (!touchContext) {
        return;
      }

      touchContext.globalCompositeOperation = "source-over";
      touchContext.fillStyle = "rgba(0, 0, 0, 0.12)";
      touchContext.fillRect(0, 0, TOUCH_SIZE, TOUCH_SIZE);

      for (let index = trail.length - 1; index >= 0; index -= 1) {
        const point = trail[index];
        point.age += 1;

        if (point.age > 14) {
          trail.splice(index, 1);
          continue;
        }

        const life = 1 - point.age / 14;
        const radius = (2.5 + point.force * 4.5) * life;
        const gradient = touchContext.createRadialGradient(
          point.u * TOUCH_SIZE,
          point.v * TOUCH_SIZE,
          0,
          point.u * TOUCH_SIZE,
          point.v * TOUCH_SIZE,
          radius,
        );

        gradient.addColorStop(0, `rgba(255, 255, 255, ${0.48 * life})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        touchContext.globalCompositeOperation = "lighter";
        touchContext.fillStyle = gradient;
        touchContext.beginPath();
        touchContext.arc(point.u * TOUCH_SIZE, point.v * TOUCH_SIZE, radius, 0, Math.PI * 2);
        touchContext.fill();
      }

      touchTexture.needsUpdate = true;
    };

    const getTouchUvFromPointer = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;

      if (pointerX < 0 || pointerX > width || pointerY < 0 || pointerY > height) {
        return null;
      }

      if (!isScreenParticleHit(screenHitMap, pointerX, pointerY)) {
        return null;
      }

      return {
        u: pointerX / width,
        v: pointerY / height,
      };
    };

    const handlePointerMove = (event: PointerEvent) => {
      const uv = getTouchUvFromPointer(event);

      if (!uv) {
        return;
      }

      trail.push({
        age: 0,
        force: event.pointerType === "touch" ? 0.9 : 0.7,
        u: uv.u,
        v: uv.v,
      });

      if (trail.length > 8) {
        trail.shift();
      }
    };

    const render = (time: number) => {
      clearTouch();
      material.uniforms.uTime.value = time;
      material.uniforms.uReveal.value = Math.min(1 + INTRO_STAGGER, (time - startedAt) / INTRO_DURATION);
      renderer.render(scene, camera);

      if (!disposed) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const stop = () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerdown", handlePointerMove);
      disposeMesh();
      material?.dispose();
      touchTexture.dispose();
      renderer?.dispose();
    };

    const start = async () => {
      try {
        sourceImage = await loadImage(image.currentSrc || image.src);
      } catch {
        hero.dataset.mountainMotion = "unavailable";
        canvas.hidden = true;
        return;
      }

      if (disposed) {
        return;
      }

      particleSample = sampleImage(sourceImage);
      particleSources = particleSample.sources;

      if (particleSources.length === 0) {
        hero.dataset.mountainMotion = "unavailable";
        canvas.hidden = true;
        return;
      }

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera();
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        canvas,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);

      material = new THREE.ShaderMaterial({
        blending: THREE.AdditiveBlending,
        depthTest: false,
        fragmentShader,
        transparent: true,
        uniforms: {
          uDepth: { value: 0 },
          uDropDistance: { value: INTRO_DROP_DISTANCE },
          uOpacity: { value: 0.84 },
          uReveal: { value: 0 },
          uScatter: { value: 96 },
          uSize: { value: 2.85 },
          uTime: { value: 0 },
          uTouch: { value: touchTexture },
          uTouchStrength: { value: 14 },
        },
        vertexShader,
      });

      hero.dataset.mountainMotion = "active";
      canvas.hidden = false;
      startedAt = performance.now();
      resize();

      hero.addEventListener("pointermove", handlePointerMove, { passive: true });
      hero.addEventListener("pointerdown", handlePointerMove, { passive: true });
      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("pagehide", stop, { once: true });
      animationFrame = window.requestAnimationFrame(render);
    };

    start();
  });
};
