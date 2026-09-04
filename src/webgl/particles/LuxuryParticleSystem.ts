import * as THREE from 'three';

// Procedural high-resolution soft circular particle glow sprite texture
function createParticleSpriteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.2, 'rgba(255, 235, 180, 0.85)');
  gradient.addColorStop(0.5, 'rgba(230, 180, 80, 0.35)');
  gradient.addColorStop(0.8, 'rgba(180, 120, 40, 0.08)');
  gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Procedural 4-point diamond sparkle flare texture
function createSparkleFlareTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 128, 128);

  // Center soft round core
  const radial = ctx.createRadialGradient(64, 64, 0, 64, 64, 40);
  radial.addColorStop(0, 'rgba(255, 255, 255, 1)');
  radial.addColorStop(0.3, 'rgba(255, 240, 200, 0.7)');
  radial.addColorStop(1, 'rgba(255, 200, 100, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 128, 128);

  // Horizontal flare beam
  const gradH = ctx.createLinearGradient(0, 64, 128, 64);
  gradH.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradH.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
  gradH.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradH;
  ctx.fillRect(0, 62, 128, 4);

  // Vertical flare beam
  const gradV = ctx.createLinearGradient(64, 0, 64, 128);
  gradV.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradV.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
  gradV.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradV;
  ctx.fillRect(62, 0, 4, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export class LuxuryParticleSystem {
  public group: THREE.Group;

  // 1. Cosmic Gold Stardust (All chapters, floating ambient motes)
  private stardustPoints: THREE.Points;
  private stardustPositions: Float32Array;
  private stardustBasePos: Float32Array;
  private stardustCount = 650;

  // 2. Rising Fire Embers (Chapter 2: Fire, crucible sparks)
  private emberPoints: THREE.Points;
  private emberPositions: Float32Array;
  private emberVelocities: Float32Array;
  private emberLifetimes: Float32Array;
  private emberColors: Float32Array;
  private emberCount = 500;

  // 3. Diamond Caustic Sparkles (Crown facet light flares)
  private sparkleGroup: THREE.Group;
  private sparkleSprites: THREE.Sprite[] = [];

  constructor() {
    this.group = new THREE.Group();
    const particleTex = createParticleSpriteTexture();
    const sparkleTex = createSparkleFlareTexture();

    // ----------------------------------------------------
    // 1. COSMIC GOLD STARDUST
    // ----------------------------------------------------
    this.stardustPositions = new Float32Array(this.stardustCount * 3);
    this.stardustBasePos = new Float32Array(this.stardustCount * 3);
    const stardustColors = new Float32Array(this.stardustCount * 3);

    for (let i = 0; i < this.stardustCount; i++) {
      const idx = i * 3;
      // Spherical distribution around center stage
      const radius = 0.8 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta) * 0.8;
      const z = radius * Math.cos(phi);

      this.stardustPositions[idx] = x;
      this.stardustPositions[idx + 1] = y;
      this.stardustPositions[idx + 2] = z;

      this.stardustBasePos[idx] = x;
      this.stardustBasePos[idx + 1] = y;
      this.stardustBasePos[idx + 2] = z;

      // Subtle gold hue variations
      const warmth = 0.75 + Math.random() * 0.25;
      stardustColors[idx] = 0.98 * warmth;     // R
      stardustColors[idx + 1] = 0.82 * warmth; // G
      stardustColors[idx + 2] = 0.45 * warmth; // B
    }

    const stardustGeom = new THREE.BufferGeometry();
    stardustGeom.setAttribute('position', new THREE.BufferAttribute(this.stardustPositions, 3));
    stardustGeom.setAttribute('color', new THREE.BufferAttribute(stardustColors, 3));

    const stardustMat = new THREE.PointsMaterial({
      size: 0.075,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.stardustPoints = new THREE.Points(stardustGeom, stardustMat);
    this.group.add(this.stardustPoints);

    // ----------------------------------------------------
    // 2. RISING FIRE EMBERS (Chapter 02 - Fire)
    // ----------------------------------------------------
    this.emberPositions = new Float32Array(this.emberCount * 3);
    this.emberVelocities = new Float32Array(this.emberCount * 3);
    this.emberLifetimes = new Float32Array(this.emberCount);
    this.emberColors = new Float32Array(this.emberCount * 3);

    for (let i = 0; i < this.emberCount; i++) {
      this.resetEmber(i);
      this.emberLifetimes[i] = Math.random(); // staggered startup
    }

    const emberGeom = new THREE.BufferGeometry();
    emberGeom.setAttribute('position', new THREE.BufferAttribute(this.emberPositions, 3));
    emberGeom.setAttribute('color', new THREE.BufferAttribute(this.emberColors, 3));

    const emberMat = new THREE.PointsMaterial({
      size: 0.09,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.0, // controlled by progress in Chapter 02
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.emberPoints = new THREE.Points(emberGeom, emberMat);
    this.group.add(this.emberPoints);

    // ----------------------------------------------------
    // 3. DIAMOND SPARKLE FLARES
    // ----------------------------------------------------
    this.sparkleGroup = new THREE.Group();
    const sparkleMaterial = new THREE.SpriteMaterial({
      map: sparkleTex,
      color: 0xffffff,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // 6 strategic facet glint points around the solitaire diamond crown
    const flareOffsets = [
      new THREE.Vector3(0, 0.98, 0),        // Top table facet
      new THREE.Vector3(0.24, 0.88, 0.24),   // Crown north-east
      new THREE.Vector3(-0.24, 0.88, -0.24), // Crown south-west
      new THREE.Vector3(-0.28, 0.82, 0.18),  // Crown west
      new THREE.Vector3(0.28, 0.82, -0.18),  // Crown east
      new THREE.Vector3(0, 0.75, 0.35),      // Girdle front facet
    ];

    for (let i = 0; i < flareOffsets.length; i++) {
      const sprite = new THREE.Sprite(sparkleMaterial.clone());
      sprite.position.copy(flareOffsets[i]);
      sprite.scale.set(0.65, 0.65, 1.0);
      this.sparkleSprites.push(sprite);
      this.sparkleGroup.add(sprite);
    }
    this.group.add(this.sparkleGroup);
  }

  private resetEmber(index: number) {
    const idx = index * 3;
    // Spawn in a small cylinder around molten core
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.9;
    this.emberPositions[idx] = Math.cos(angle) * r;
    this.emberPositions[idx + 1] = -0.8 + Math.random() * 0.4;
    this.emberPositions[idx + 2] = Math.sin(angle) * r;

    // Upward convection drift with gentle outward dispersion
    this.emberVelocities[idx] = (Math.random() - 0.5) * 0.6;
    this.emberVelocities[idx + 1] = 0.8 + Math.random() * 1.6;
    this.emberVelocities[idx + 2] = (Math.random() - 0.5) * 0.6;

    this.emberLifetimes[index] = 0.0;

    // Incandescent flame color (white-gold to fiery orange)
    const t = Math.random();
    if (t > 0.6) {
      // Hot white-gold
      this.emberColors[idx] = 1.0;
      this.emberColors[idx + 1] = 0.95;
      this.emberColors[idx + 2] = 0.75;
    } else if (t > 0.2) {
      // Bright amber
      this.emberColors[idx] = 1.0;
      this.emberColors[idx + 1] = 0.62;
      this.emberColors[idx + 2] = 0.12;
    } else {
      // Deep ember crimson
      this.emberColors[idx] = 0.95;
      this.emberColors[idx + 1] = 0.24;
      this.emberColors[idx + 2] = 0.04;
    }
  }

  public update(delta: number, elapsedTime: number, progress: number, diamondWorldPos?: THREE.Vector3) {
    // ----------------------------------------------------
    // Update Stardust Motion
    // ----------------------------------------------------
    const posAttr = this.stardustPoints.geometry.attributes.position;
    for (let i = 0; i < this.stardustCount; i++) {
      const idx = i * 3;
      const bx = this.stardustBasePos[idx];
      const by = this.stardustBasePos[idx + 1];
      const bz = this.stardustBasePos[idx + 2];

      // Gentle orbital Brownian drift
      const speed = 0.25;
      const waveX = Math.sin(elapsedTime * speed + by * 1.5) * 0.15;
      const waveY = Math.cos(elapsedTime * speed * 0.8 + bx * 1.2) * 0.15;
      const waveZ = Math.sin(elapsedTime * speed * 0.6 + bz * 1.4) * 0.15;

      this.stardustPositions[idx] = bx + waveX;
      this.stardustPositions[idx + 1] = by + waveY;
      this.stardustPositions[idx + 2] = bz + waveZ;
    }
    posAttr.needsUpdate = true;

    // Adapt stardust intensity across chapters
    const stardustMat = this.stardustPoints.material as THREE.PointsMaterial;
    if (progress < 0.12) {
      // Chapter 1: Deep cosmic gold dust
      stardustMat.opacity = 0.85;
      stardustMat.size = 0.085;
    } else if (progress < 0.24) {
      // Chapter 2: Heat glow dominates
      stardustMat.opacity = 0.35;
      stardustMat.size = 0.06;
    } else {
      // Later chapters: Polished atelier sparkles
      stardustMat.opacity = 0.55;
      stardustMat.size = 0.07;
    }

    // ----------------------------------------------------
    // Update Fire Embers (Active during Chapter 2)
    // ----------------------------------------------------
    const isFireSection = progress >= 0.08 && progress <= 0.28;
    const emberMat = this.emberPoints.material as THREE.PointsMaterial;

    if (isFireSection) {
      // Calculate smooth bell curve opacity for Fire section
      const firePhase = (progress - 0.08) / 0.20; // 0 to 1
      const fireIntensity = Math.sin(firePhase * Math.PI);
      emberMat.opacity = THREE.MathUtils.lerp(0.0, 0.95, fireIntensity);

      const emberPosAttr = this.emberPoints.geometry.attributes.position;
      const emberColAttr = this.emberPoints.geometry.attributes.color;

      for (let i = 0; i < this.emberCount; i++) {
        const idx = i * 3;
        this.emberLifetimes[i] += delta * (0.6 + (i % 5) * 0.1);

        if (this.emberLifetimes[i] >= 1.0) {
          this.resetEmber(i);
        } else {
          const life = this.emberLifetimes[i];
          // Convective swirl
          const swirlAngle = life * 4.0 + i;
          const swirlRadius = life * 0.4;
          this.emberPositions[idx] += this.emberVelocities[idx] * delta + Math.cos(swirlAngle) * swirlRadius * delta;
          this.emberPositions[idx + 1] += this.emberVelocities[idx + 1] * delta;
          this.emberPositions[idx + 2] += this.emberVelocities[idx + 2] * delta + Math.sin(swirlAngle) * swirlRadius * delta;

          // Fade to black/red as it burns out
          const fade = 1.0 - Math.pow(life, 2.0);
          this.emberColors[idx] *= fade;
          this.emberColors[idx + 1] *= Math.pow(fade, 1.5);
          this.emberColors[idx + 2] *= Math.pow(fade, 2.0);
        }
      }
      emberPosAttr.needsUpdate = true;
      emberColAttr.needsUpdate = true;
    } else {
      emberMat.opacity = 0.0;
    }

    // ----------------------------------------------------
    // Update Diamond Sparkle Flares (Chapters 3 - 8)
    // ----------------------------------------------------
    const isJewelrySection = progress >= 0.22;
    if (isJewelrySection && diamondWorldPos) {
      this.sparkleGroup.position.copy(diamondWorldPos);
      this.sparkleGroup.visible = true;

      for (let i = 0; i < this.sparkleSprites.length; i++) {
        const sprite = this.sparkleSprites[i];
        const mat = sprite.material as THREE.SpriteMaterial;

        // Twinkle frequency specific to each facet
        const twinkle = Math.sin(elapsedTime * (3.5 + i * 1.2) + i * 1.8);
        const sparkleIntensity = Math.max(0, Math.pow(twinkle, 3.0));

        // Scale flare dynamically
        const scale = THREE.MathUtils.lerp(0.2, 0.9, sparkleIntensity);
        sprite.scale.set(scale, scale, 1.0);
        mat.opacity = THREE.MathUtils.lerp(0.1, 0.85, sparkleIntensity);
        mat.rotation = elapsedTime * 0.5 + i * 0.4;
      }
    } else {
      this.sparkleGroup.visible = false;
    }
  }

  public dispose() {
    this.stardustPoints.geometry.dispose();
    (this.stardustPoints.material as THREE.Material).dispose();
    this.emberPoints.geometry.dispose();
    (this.emberPoints.material as THREE.Material).dispose();
    this.sparkleSprites.forEach((sprite) => {
      sprite.material.dispose();
    });
    this.group.clear();
  }
}
