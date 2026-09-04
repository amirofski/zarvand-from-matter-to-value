import * as THREE from 'three';

// Procedural soft radial gradient texture for 3D studio backdrop halo
function createBackdropHaloTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.35, 'rgba(255, 240, 210, 0.65)');
  gradient.addColorStop(0.65, 'rgba(210, 160, 80, 0.2)');
  gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export type LightingMode = 'atelier' | 'noir' | 'glint';

export class LuxuryLightingRig {
  public group: THREE.Group;
  public keyLight: THREE.DirectionalLight;
  public rimLight: THREE.DirectionalLight;
  public fillLight: THREE.DirectionalLight;
  public accentSpot: THREE.SpotLight;
  public ambientLight: THREE.AmbientLight;
  public mouseLight: THREE.PointLight;
  public coreFireLight: THREE.PointLight;
  public haloMesh: THREE.Mesh;
  public lightingMode: LightingMode = 'atelier';
  private haloMaterial: THREE.MeshBasicMaterial;

  public setMode(mode: LightingMode) {
    this.lightingMode = mode;
  }

  constructor() {
    this.group = new THREE.Group();

    // 1. Studio Key Light (Sculptural warm illumination)
    this.keyLight = new THREE.DirectionalLight(0xfff3db, 4.2);
    this.keyLight.position.set(4, 5, 4.5);
    this.group.add(this.keyLight);

    // 2. Razor-Sharp Golden Rim Light (Silhouetting metallic contours)
    this.rimLight = new THREE.DirectionalLight(0xffd57a, 5.2);
    this.rimLight.position.set(-5, 2.5, -3.5);
    this.group.add(this.rimLight);

    // 3. Fill / Under-bounce Light (Atelier mahogany warm bounce)
    this.fillLight = new THREE.DirectionalLight(0xedd3a8, 2.0);
    this.fillLight.position.set(0, -3.5, 3.0);
    this.group.add(this.fillLight);

    // 4. Accent Focus Spotlight (Precision jewelry glint)
    this.accentSpot = new THREE.SpotLight(0xfffaf0, 4.5);
    this.accentSpot.position.set(1.5, 6, 2.5);
    this.accentSpot.angle = Math.PI / 5;
    this.accentSpot.penumbra = 0.85;
    this.group.add(this.accentSpot);

    // 5. Interactive Cursor Follow Light (Dynamic glints)
    this.mouseLight = new THREE.PointLight(0xffe6b0, 2.2, 12, 1.2);
    this.mouseLight.position.set(0, 0, 3.2);
    this.group.add(this.mouseLight);

    // 6. Molten Core Interior Light (Chapter 2: Fire)
    this.coreFireLight = new THREE.PointLight(0xff6e1a, 0.0, 8, 1.5);
    this.coreFireLight.position.set(0, 0, 0);
    this.group.add(this.coreFireLight);

    // 7. Ambient Light (Rich baseline, never pitch-black)
    this.ambientLight = new THREE.AmbientLight(0x282018, 1.2);
    this.group.add(this.ambientLight);

    // 8. 3D Studio Backdrop Vignette / Halo Mesh
    const haloTex = createBackdropHaloTexture();
    this.haloMaterial = new THREE.MeshBasicMaterial({
      map: haloTex,
      color: new THREE.Color('#946b38'),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.haloMesh = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), this.haloMaterial);
    this.haloMesh.position.set(0, 0, -2.2);
    this.group.add(this.haloMesh);
  }

  // Update dynamic lights based on scroll progress and pointer coordinates
  public update(progress: number, scene: THREE.Scene, mouseX: number, mouseY: number, elapsedTime: number) {
    // Dynamic interactive light tracks mouse smoothly
    this.mouseLight.position.set(mouseX * 3.2, mouseY * 2.2 + 0.3, 3.2);

    // Baseline intensities for current frame (reset freshly every frame)
    let baseKey = 4.2;
    let baseRim = 5.2;
    let baseFill = 2.0;
    let baseAmbient = 1.3;
    let baseAccent = 4.0;
    let baseMouse = 2.2;
    let baseHaloOpacity = 0.35;
    let baseHaloScale = 1.0;

    let keyColor = '#FFF2D4';
    let rimColor = '#FFD478';
    let fillColor = '#E2BC7A';
    let mouseColor = '#FFE6B0';
    let haloColor = '#A4753A';

    if (progress < 0.12) {
      // ----------------------------------------------------
      // 01: MATTER — Cosmic raw gold ore in luxury studio
      // ----------------------------------------------------
      scene.background = new THREE.Color('#080808');
      baseKey = 4.4;
      baseRim = 5.6;
      baseFill = 2.2;
      baseAmbient = 1.4;
      baseAccent = 4.2;
      this.coreFireLight.intensity = 0.0;

      haloColor = '#A4753A';
      baseHaloOpacity = 0.38;
      this.haloMesh.position.set(0, 0, -2.0);
      baseHaloScale = 1.0;
    } else if (progress < 0.24) {
      // ----------------------------------------------------
      // 02: FIRE — Incandescent furnace embers
      // ----------------------------------------------------
      const firePhase = (progress - 0.12) / 0.12;
      const fireCurve = Math.sin(firePhase * Math.PI);
      const bgCol = new THREE.Color('#080808').lerp(new THREE.Color('#220B04'), fireCurve);
      scene.background = bgCol;

      baseKey = 5.0 + Math.sin(elapsedTime * 8) * 0.4;
      keyColor = '#FFA840';
      baseRim = 6.2 + Math.cos(elapsedTime * 9) * 0.6;
      rimColor = '#FF5510';
      baseFill = 2.8;
      fillColor = '#FF8220';
      baseAmbient = 1.6;
      baseAccent = 3.5;

      // Internal flame light pulsing
      this.coreFireLight.intensity = (4.5 + Math.sin(elapsedTime * 12) * 1.5) * fireCurve;
      this.coreFireLight.color.set('#FF7018');

      // Radiant flame halo
      haloColor = '#C4400E';
      baseHaloOpacity = 0.55 * fireCurve;
      baseHaloScale = 1.0 + Math.sin(elapsedTime * 4) * 0.1;
    } else if (progress < 0.36) {
      // ----------------------------------------------------
      // 03: FORM — Precision engineering atelier
      // ----------------------------------------------------
      scene.background = new THREE.Color('#0b0a09');
      baseKey = 4.0;
      keyColor = '#FFF7EA';
      baseRim = 4.8;
      rimColor = '#F0CA7A';
      baseFill = 2.0;
      baseAmbient = 1.25;
      baseAccent = 4.0;
      this.coreFireLight.intensity = 0.0;

      haloColor = '#7C5E33';
      baseHaloOpacity = 0.26;
      baseHaloScale = 1.1;
    } else if (progress < 0.50) {
      // ----------------------------------------------------
      // 04: CRAFT — Warm ivory atelier worktable
      // ----------------------------------------------------
      const craftPhase = Math.min(1, Math.max(0, (progress - 0.36) / 0.06));
      const bgCol = new THREE.Color('#0b0a09').lerp(new THREE.Color('#14100c'), craftPhase);
      scene.background = bgCol;

      baseKey = 4.0;
      baseRim = 4.5;
      baseFill = 2.4;
      baseAmbient = 1.4;
      baseAccent = 4.2;
      this.coreFireLight.intensity = 0.0;

      haloColor = '#8E6B3B';
      baseHaloOpacity = 0.28;
    } else if (progress < 0.63) {
      // ----------------------------------------------------
      // 05: IDENTITY — Contemplative luxury serenity
      // ----------------------------------------------------
      scene.background = new THREE.Color('#0a0908');
      baseKey = 4.2;
      baseRim = 5.0;
      rimColor = '#FFD884';
      baseFill = 2.0;
      baseAmbient = 1.3;
      baseAccent = 4.0;
      this.coreFireLight.intensity = 0.0;

      haloColor = '#9A743D';
      baseHaloOpacity = 0.32;
    } else if (progress < 0.76) {
      // ----------------------------------------------------
      // 06: VALUE — Technical analytical jewelry studio
      // ----------------------------------------------------
      scene.background = new THREE.Color('#080808');
      baseKey = 4.4;
      baseRim = 4.8;
      baseFill = 2.2;
      baseAmbient = 1.25;
      baseAccent = 4.5;
      this.coreFireLight.intensity = 0.0;

      haloColor = '#8B6936';
      baseHaloOpacity = 0.30;
    } else if (progress < 0.90) {
      // ----------------------------------------------------
      // 07: COLLECTION — Exhibition gallery focus
      // ----------------------------------------------------
      scene.background = new THREE.Color('#090909');
      baseKey = 4.2;
      baseRim = 4.8;
      baseFill = 2.0;
      baseAmbient = 1.25;
      baseAccent = 4.2;
      this.coreFireLight.intensity = 0.0;

      haloColor = '#946F39';
      baseHaloOpacity = 0.30;
    } else {
      // ----------------------------------------------------
      // 08: OWNERSHIP — Final transcendent gold warmth
      // ----------------------------------------------------
      scene.background = new THREE.Color('#070707');
      baseKey = 4.5;
      baseRim = 5.4;
      rimColor = '#FFDA85';
      baseFill = 2.2;
      baseAmbient = 1.4;
      baseAccent = 4.5;
      this.coreFireLight.intensity = 0.0;

      haloColor = '#A88044';
      baseHaloOpacity = 0.36;
    }

    // Apply interactive studio lighting mode (DIRECT factor, NEVER cumulative *=)
    let keyMult = 1.0;
    let rimMult = 1.0;
    let fillMult = 1.0;
    let ambientMult = 1.0;
    let accentMult = 1.0;
    let mouseMult = 1.0;
    let haloMult = 1.0;

    if (this.lightingMode === 'noir') {
      // High dramatic side contrast; deep shadows but never pitch-black
      keyMult = 0.65;
      rimMult = 1.40;
      fillMult = 0.70;
      ambientMult = 0.85; // Guaranteed visible ambient foundation
      accentMult = 1.35;
      mouseMult = 0.90;
      haloMult = 0.70;
    } else if (this.lightingMode === 'glint') {
      // Brilliant jewelry sparkle mode
      keyMult = 1.20;
      rimMult = 1.25;
      fillMult = 1.15;
      ambientMult = 1.25;
      accentMult = 1.80;
      mouseMult = 1.50;
      haloMult = 1.20;
      mouseColor = '#FFF9EE';
    }

    // Direct bounded assignment prevents any NaN, Infinity, or blackout
    this.keyLight.intensity = Math.max(0.6, Math.min(10.0, baseKey * keyMult));
    this.keyLight.color.set(keyColor);

    this.rimLight.intensity = Math.max(0.6, Math.min(12.0, baseRim * rimMult));
    this.rimLight.color.set(rimColor);

    this.fillLight.intensity = Math.max(0.4, Math.min(6.0, baseFill * fillMult));
    this.fillLight.color.set(fillColor);

    this.ambientLight.intensity = Math.max(0.6, Math.min(3.5, baseAmbient * ambientMult));

    this.accentSpot.intensity = Math.max(0.6, Math.min(12.0, baseAccent * accentMult));

    this.mouseLight.intensity = Math.max(0.5, Math.min(6.0, baseMouse * mouseMult));
    this.mouseLight.color.set(mouseColor);

    this.haloMaterial.color.set(haloColor);
    this.haloMaterial.opacity = Math.max(0.06, Math.min(0.75, baseHaloOpacity * haloMult));
    this.haloMesh.scale.set(baseHaloScale, baseHaloScale, 1.0);
  }

  public dispose() {
    this.haloMaterial.dispose();
    this.haloMesh.geometry.dispose();
    this.group.clear();
  }
}
