import * as THREE from 'three';
import {
  createRawGoldNuggetGeometry,
  createRealisticGoldIngotGeometry,
  createRingAssembly,
  RingAssemblyMeshes,
} from './geometries/luxuryGeometries';
import {
  createRawGoldOreMaterial,
  createRealisticGoldIngotMaterial,
  createLuxuryGoldMaterial,
  createSatinGoldMaterial,
  createDiamondMaterial,
  generateStudioEnvironmentMap,
} from './materials/luxuryMaterials';
import { MoltenGoldShader } from './shaders/moltenShader';
import { LuxuryLightingRig } from './lighting/LightingRig';
import { LuxuryParticleSystem } from './particles/LuxuryParticleSystem';

export class SceneManager {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private lightingRig: LuxuryLightingRig;
  private particleSystem: LuxuryParticleSystem;
  private pmremGenerator: THREE.PMREMGenerator | null = null;

  // 3D Objects
  private rawOreMesh: THREE.Mesh;
  private moltenMesh: THREE.Mesh;
  private ringAssembly: RingAssemblyMeshes;
  private ingotMesh: THREE.Mesh;
  private moltenMaterial: THREE.ShaderMaterial;

  // State
  private scrollProgress = 0;
  private mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  private clock = new THREE.Clock();
  private isDestroyed = false;
  private reqId: number | null = null;
  private weightGrams = 3.4;
  private diamondWorldPos = new THREE.Vector3();

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Initialize Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#080808');

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 5.0);

    // 2. Renderer with color management & tone mapping
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

    // 3. Studio HDR Environment Map for Realistic Gold Reflections
    const { envMap, pmremGenerator } = generateStudioEnvironmentMap(this.renderer);
    this.pmremGenerator = pmremGenerator;
    this.scene.environment = envMap;

    // 4. Lighting Rig
    this.lightingRig = new LuxuryLightingRig();
    this.scene.add(this.lightingRig.group);

    // 5. Materials with photorealistic gold PBR textures
    const rawOreMaterial = createRawGoldOreMaterial(envMap);
    const ingotMaterial = createRealisticGoldIngotMaterial(envMap);
    const goldMaterial = createLuxuryGoldMaterial(envMap);
    const innerBandMaterial = createSatinGoldMaterial(envMap);
    const diamondMaterial = createDiamondMaterial(envMap);

    // 6. Section 01: Raw Gold Ore / Cosmic Nugget (تکه سنگ طلای خام کیهانی)
    const rawOreGeom = createRawGoldNuggetGeometry(1.35, 24);
    this.rawOreMesh = new THREE.Mesh(rawOreGeom, rawOreMaterial);
    this.rawOreMesh.position.set(0, 0, 0);
    this.rawOreMesh.castShadow = true;
    this.rawOreMesh.receiveShadow = true;
    this.scene.add(this.rawOreMesh);

    // 7. Section 02: Molten Gold Core Shader
    this.moltenMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(MoltenGoldShader.uniforms),
      vertexShader: MoltenGoldShader.vertexShader,
      fragmentShader: MoltenGoldShader.fragmentShader,
    });
    const moltenGeom = new THREE.IcosahedronGeometry(1.3, 5);
    this.moltenMesh = new THREE.Mesh(moltenGeom, this.moltenMaterial);
    this.moltenMesh.visible = false;
    this.scene.add(this.moltenMesh);

    // 8. Section 03-08: Ring Assembly with real gold textures and inner hallmark sleeve
    this.ringAssembly = createRingAssembly(goldMaterial, diamondMaterial, innerBandMaterial);
    this.ringAssembly.group.position.set(0, 0, 0);
    this.ringAssembly.group.visible = false;
    this.scene.add(this.ringAssembly.group);

    // 9. Craft Table Ingot Sample (Section 04: Craft)
    const ingotGeom = createRealisticGoldIngotGeometry(1.25, 2.4, 0.48, 0.055);
    this.ingotMesh = new THREE.Mesh(ingotGeom, ingotMaterial);
    this.ingotMesh.position.set(-1.8, -0.45, 0.2);
    this.ingotMesh.rotation.y = 0.35;
    this.ingotMesh.scale.setScalar(0.75);
    this.ingotMesh.visible = false;
    this.scene.add(this.ingotMesh);

    // 10. Multi-Layer Luxury Particle System (Stardust, Fire Embers, Diamond Flares)
    this.particleSystem = new LuxuryParticleSystem();
    this.scene.add(this.particleSystem.group);

    // 11. Event Listeners
    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointerMove);

    // 12. Start RAF Loop
    this.animate();
  }

  private onResize = () => {
    if (!this.container || this.isDestroyed) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
  };

  private onPointerMove = (e: MouseEvent) => {
    // Normalized mouse [-1, 1]
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.mouse.targetX = x * 0.35;
    this.mouse.targetY = y * 0.25;
  };

  public setScrollProgress(progress: number) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
  }

  public setWeight(grams: number) {
    this.weightGrams = grams;
    // Scale factor benchmarked at 3.4g = 1.0
    const scaleFactor = Math.max(0.6, Math.min(1.6, grams / 3.4));
    this.ringAssembly.updateWeightScale(scaleFactor);
  }

  public setLightingMode(mode: 'atelier' | 'noir' | 'glint') {
    this.lightingRig.setMode(mode);
  }

  private animate = () => {
    if (this.isDestroyed) return;
    this.reqId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Update molten shader time
    if (this.moltenMaterial) {
      this.moltenMaterial.uniforms.uTime.value = elapsedTime;
    }

    const p = this.scrollProgress;

    // Update dynamic multi-light rig with interactive mouse coordinates
    this.lightingRig.update(p, this.scene, this.mouse.x, this.mouse.y, elapsedTime);

    // Track diamond world position for caustic facet sparkles
    if (this.ringAssembly && this.ringAssembly.diamond) {
      this.ringAssembly.diamond.getWorldPosition(this.diamondWorldPos);
    }

    // Update multi-tier particle systems (stardust, embers, diamond flares)
    this.particleSystem.update(delta, elapsedTime, p, this.diamondWorldPos);

    // ==========================================
    // CHOREOGRAPHY OF 8 CHAPTERS
    // ==========================================

    if (p < 0.12) {
      // ------------------------------------------
      // SECTION 01: MATTER (0.00 -> 0.12)
      // Displaying the authentic 24K raw gold ore in cosmic luxury studio
      // ------------------------------------------
      this.rawOreMesh.visible = true;
      this.moltenMesh.visible = false;
      this.ringAssembly.group.visible = false;
      this.ingotMesh.visible = false;

      const sub = p / 0.12; // 0 to 1

      // Majestic organic gold nugget floating in cosmic space
      this.rawOreMesh.position.set(0, 0, 0);
      this.rawOreMesh.rotation.y = elapsedTime * 0.22 + this.mouse.x * 0.45;
      this.rawOreMesh.rotation.x = Math.sin(elapsedTime * 0.18) * 0.15 + this.mouse.y * 0.35;
      this.rawOreMesh.rotation.z = Math.cos(elapsedTime * 0.14) * 0.08;
      this.rawOreMesh.scale.setScalar(1.0 + sub * 0.1);

      const camZ = THREE.MathUtils.lerp(4.4, 3.2, sub);
      this.camera.position.set(this.mouse.x * 0.35, 0.15 + this.mouse.y * 0.25, camZ);
      this.camera.lookAt(0, 0, 0);
    } else if (p < 0.24) {
      // ------------------------------------------
      // SECTION 02: FIRE (0.12 -> 0.24)
      // ------------------------------------------
      const sub = (p - 0.12) / 0.12; // 0 to 1
      this.rawOreMesh.visible = sub < 0.25;
      if (sub < 0.25) {
        this.rawOreMesh.position.set(0, 0, -sub * 2.0);
        this.rawOreMesh.scale.setScalar(Math.max(0.01, 1.0 - sub * 4.0));
      }
      this.moltenMesh.visible = true;
      this.ringAssembly.group.visible = false;
      this.ingotMesh.visible = false;

      // Molten fluid heat intensity
      const heat = Math.sin(sub * Math.PI) * 1.5 + 0.5;
      this.moltenMaterial.uniforms.uHeat.value = heat;

      const camZ = THREE.MathUtils.lerp(2.2, 4.2, sub);
      const camY = THREE.MathUtils.lerp(-0.2, 0.2, sub);
      this.camera.position.set(this.mouse.x * 0.5, camY + this.mouse.y * 0.3, camZ);
      this.camera.lookAt(0, 0, 0);

      this.moltenMesh.rotation.y = elapsedTime * 0.4 + sub * 3.0;
      this.moltenMesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.3;
      
      // Coalescing volume at end of fire
      const scale = THREE.MathUtils.lerp(1.2, 0.95, sub);
      this.moltenMesh.scale.setScalar(scale);
    } else if (p < 0.36) {
      // ------------------------------------------
      // SECTION 03: FORM (0.24 -> 0.36)
      // ------------------------------------------
      const sub = (p - 0.24) / 0.12; // 0 to 1
      this.rawOreMesh.visible = false;
      this.moltenMesh.visible = false;
      this.ringAssembly.group.visible = true;
      this.ingotMesh.visible = false;

      // Exploded-view factor: peaks around sub = 0.65
      let explodedFactor = 0;
      if (sub < 0.25) {
        explodedFactor = 0;
      } else if (sub < 0.7) {
        explodedFactor = (sub - 0.25) / 0.45;
      } else {
        explodedFactor = 1.0 - (sub - 0.7) / 0.3;
      }
      this.ringAssembly.updateExploded(explodedFactor);

      // Controlled cinematic orbit
      const orbitAngle = sub * Math.PI * 1.5;
      const camDist = THREE.MathUtils.lerp(4.4, 3.4, sub);
      this.camera.position.set(
        Math.sin(orbitAngle) * camDist + this.mouse.x * 0.3,
        1.0 + explodedFactor * 0.5 + this.mouse.y * 0.3,
        Math.cos(orbitAngle) * camDist
      );
      this.camera.lookAt(0, 0.42, 0);

      this.ringAssembly.group.rotation.y = elapsedTime * 0.15;
      this.ringAssembly.group.rotation.x = 0.2;
    } else if (p < 0.50) {
      // ------------------------------------------
      // SECTION 04: CRAFT (0.36 -> 0.50)
      // ------------------------------------------
      const sub = (p - 0.36) / 0.14; // 0 to 1
      this.rawOreMesh.visible = false;
      this.moltenMesh.visible = false;
      this.ringAssembly.group.visible = true;
      this.ingotMesh.visible = true;

      this.ringAssembly.updateExploded(0.0);

      // Camera moves across virtual artisan worktable
      const camX = THREE.MathUtils.lerp(1.8, -1.2, sub);
      const camY = THREE.MathUtils.lerp(2.2, 1.6, sub);
      const camZ = 3.6;

      this.camera.position.set(camX + this.mouse.x * 0.3, camY + this.mouse.y * 0.2, camZ);
      this.camera.lookAt(0, 0.35, 0);

      this.ringAssembly.group.position.set(1.4, -0.2, 0);
      this.ringAssembly.group.rotation.x = Math.PI * 0.35;
      this.ringAssembly.group.rotation.y = elapsedTime * 0.2;

      this.ingotMesh.position.set(-1.6, -0.4, 0.2);
      this.ingotMesh.rotation.set(0.45, 0.35 + Math.sin(elapsedTime * 0.2) * 0.05, 0.04);
    } else if (p < 0.63) {
      // ------------------------------------------
      // SECTION 05: IDENTITY (0.50 -> 0.63)
      // ------------------------------------------
      const sub = (p - 0.50) / 0.13; // 0 to 1
      this.rawOreMesh.visible = false;
      this.moltenMesh.visible = false;
      this.ringAssembly.group.visible = true;
      this.ingotMesh.visible = false;

      this.ringAssembly.updateExploded(0.0);
      this.ringAssembly.group.position.set(0, 0, 0);

      // Serene, high-end contemplative camera
      const camZ = THREE.MathUtils.lerp(4.4, 3.2, sub);
      this.camera.position.set(this.mouse.x * 0.4, 0.4 + this.mouse.y * 0.3, camZ);
      this.camera.lookAt(0, 0.40, 0);

      // Poetic slow rotation
      this.ringAssembly.group.rotation.y = elapsedTime * 0.22;
      this.ringAssembly.group.rotation.x = 0.25;
    } else if (p < 0.76) {
      // ------------------------------------------
      // SECTION 06: VALUE (0.63 -> 0.76)
      // ------------------------------------------
      const sub = (p - 0.63) / 0.13; // 0 to 1
      this.rawOreMesh.visible = false;
      this.moltenMesh.visible = false;
      this.ringAssembly.group.visible = true;
      this.ingotMesh.visible = false;

      this.ringAssembly.updateExploded(0.0);

      const posX = THREE.MathUtils.lerp(-1.2, 0.0, sub);
      this.ringAssembly.group.position.set(posX, 0.1, 0);

      this.camera.position.set(0, 0.4 + this.mouse.y * 0.2, 3.8 + this.mouse.x * 0.2);
      this.camera.lookAt(posX * 0.5, 0.35, 0);

      this.ringAssembly.group.rotation.y = elapsedTime * 0.35;
      this.ringAssembly.group.rotation.x = 0.4;
    } else if (p < 0.90) {
      // ------------------------------------------
      // SECTION 07: COLLECTION (0.76 -> 0.90)
      // ------------------------------------------
      const sub = (p - 0.76) / 0.14; // 0 to 1
      this.rawOreMesh.visible = false;
      this.moltenMesh.visible = false;
      this.ringAssembly.group.visible = true;
      this.ingotMesh.visible = false;

      this.ringAssembly.updateExploded(0.0);
      this.ringAssembly.group.position.set(1.1, 0.1, 0);

      this.camera.position.set(0, 0.5 + this.mouse.y * 0.2, 4.0);
      this.camera.lookAt(0.5, 0.35, 0);

      this.ringAssembly.group.rotation.y = sub * Math.PI * 2.0 + elapsedTime * 0.2;
      this.ringAssembly.group.rotation.x = 0.35;
    } else {
      // ------------------------------------------
      // SECTION 08: OWNERSHIP (0.90 -> 1.00)
      // ------------------------------------------
      const sub = (p - 0.90) / 0.10;
      this.rawOreMesh.visible = false;
      this.moltenMesh.visible = false;
      this.ringAssembly.group.visible = true;
      this.ingotMesh.visible = false;

      this.ringAssembly.updateExploded(0.0);
      this.ringAssembly.group.position.set(0, 0, 0);

      const camZ = THREE.MathUtils.lerp(3.8, 2.7, sub);
      this.camera.position.set(this.mouse.x * 0.3, 0.3 + this.mouse.y * 0.2, camZ);
      this.camera.lookAt(0, 0.38, 0);

      // Final quiet poetic poise
      this.ringAssembly.group.rotation.y = elapsedTime * 0.18;
      this.ringAssembly.group.rotation.x = 0.28;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    this.isDestroyed = true;
    if (this.reqId !== null) {
      cancelAnimationFrame(this.reqId);
    }
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);

    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    if (this.pmremGenerator) {
      this.pmremGenerator.dispose();
      this.pmremGenerator = null;
    }
    this.renderer.dispose();
    this.lightingRig.dispose();
    this.particleSystem.dispose();
    this.rawOreMesh.geometry.dispose();
    this.ingotMesh.geometry.dispose();
    this.scene.clear();
  }
}
