import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  createIngotAlbedoTexture,
  createIngotNormalTexture,
  createIngotRoughnessTexture,
  createJewelryGoldAlbedoTexture,
  createJewelryNormalTexture,
  createJewelryRoughnessTexture,
  createInnerHallmarkTexture,
  createRawGoldOreAlbedoTexture,
  createRawGoldOreNormalTexture,
  createRawGoldOreRoughnessTexture,
} from '../textures/goldTextures';

/**
 * Generate a luxury studio HDR-like environment map using Three.js RoomEnvironment
 * and returns the processed PMREM texture along with the PMREM generator.
 */
export function generateStudioEnvironmentMap(renderer: THREE.WebGLRenderer): {
  envMap: THREE.Texture;
  pmremGenerator: THREE.PMREMGenerator;
} {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const environment = new RoomEnvironment();
  const envMap = pmremGenerator.fromScene(environment, 0.04).texture;

  return { envMap, pmremGenerator };
}

/**
 * 1. Raw Gold Ore / Cosmic Nugget Material (Chapter 1: Matter)
 * Rich 24K unrefined cosmic gold with natural mineral roughness and crystalline sheen.
 */
export function createRawGoldOreMaterial(envMap?: THREE.Texture): THREE.MeshPhysicalMaterial {
  const albedoMap = createRawGoldOreAlbedoTexture();
  const normalMap = createRawGoldOreNormalTexture();
  const roughnessMap = createRawGoldOreRoughnessTexture();

  const material = new THREE.MeshPhysicalMaterial({
    map: albedoMap,
    color: new THREE.Color('#FFD268'),       // Warm 24K pure gold base
    emissive: new THREE.Color('#321E06'),    // Warm golden self-illumination in rock crevices
    metalness: 0.95,                        // High metallic gold body with unrefined mineral warmth
    roughness: 0.28,                        // Tactile natural nugget finish
    roughnessMap: roughnessMap,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.35, 0.35), // Pronounced craggy depth
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
    reflectivity: 1.0,
    ior: 2.5,
    envMap: envMap || null,
    envMapIntensity: 2.6,
  });

  return material;
}

/**
 * 2. Hyper-Realistic 24K Pure Gold Ingot Material (Chapter 4: Craft Table Sample)
 * Equipped with authentic PBR albedo, 3D stamped hallmark normal displacement, and satin roughness maps.
 */
export function createRealisticGoldIngotMaterial(envMap?: THREE.Texture): THREE.MeshPhysicalMaterial {
  const albedoMap = createIngotAlbedoTexture();
  const normalMap = createIngotNormalTexture();
  const roughnessMap = createIngotRoughnessTexture();

  const material = new THREE.MeshPhysicalMaterial({
    map: albedoMap,
    color: new THREE.Color('#FFDF7E'),       // Base color modulated by high-res 24K gold albedo texture
    emissive: new THREE.Color('#38220A'),    // Warm golden self-illumination in ambient crevices
    metalness: 0.98,                        // 100% metallic pure bullion
    roughness: 0.16,                        // Tactile cast bullion mirror-satin finish
    roughnessMap: roughnessMap,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.35, 0.35), // Pronounced 3D stamped depth on hallmarks & hairline brush
    clearcoat: 0.45,                        // High-end assay bar protective sheen
    clearcoatRoughness: 0.12,
    reflectivity: 1.0,
    ior: 2.55,
    envMap: envMap || null,
    envMapIntensity: 2.8,
  });

  return material;
}

/**
 * 3. High-Jewelry 18K/24K Solid Gold Material (Ring Shank, Prongs, Cathedral Setting)
 * Mirror-polished with jeweler's wheel micro-striations and warm champagne highlights.
 */
export function createLuxuryGoldMaterial(envMap?: THREE.Texture): THREE.MeshPhysicalMaterial {
  const albedoMap = createJewelryGoldAlbedoTexture();
  const normalMap = createJewelryNormalTexture();
  const roughnessMap = createJewelryRoughnessTexture();

  const material = new THREE.MeshPhysicalMaterial({
    map: albedoMap,
    color: new THREE.Color('#FFD76A'),       // Authentic 18K/24K jeweler's gold specular baseline
    emissive: new THREE.Color('#2C1B06'),    // Warm undertone preventing complete darkness
    metalness: 0.96,                        // Ultra-high metallic reflection with authentic warm specular
    roughness: 0.11,                        // Mirror-grade jeweler's polish
    roughnessMap: roughnessMap,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.06, 0.06), // Precision satin hairline brush
    clearcoat: 0.80,                        // Mirror luster
    clearcoatRoughness: 0.05,
    reflectivity: 1.0,
    ior: 2.55,
    envMap: envMap || null,
    envMapIntensity: 3.0,
  });

  return material;
}

/**
 * 4. Satin Brushed Comfort Sleeve Material (Ring Inner Band & Hallmark Inscription)
 */
export function createSatinGoldMaterial(envMap?: THREE.Texture): THREE.MeshPhysicalMaterial {
  const albedoMap = createInnerHallmarkTexture();
  const normalMap = createJewelryNormalTexture();
  const roughnessMap = createJewelryRoughnessTexture();

  return new THREE.MeshPhysicalMaterial({
    map: albedoMap,
    color: new THREE.Color('#FFDC78'),
    emissive: new THREE.Color('#221405'),
    metalness: 0.94,
    roughness: 0.35,                         // Satin brushed interior for comfort
    roughnessMap: roughnessMap,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.06, 0.06),
    clearcoat: 0.3,
    clearcoatRoughness: 0.18,
    reflectivity: 0.95,
    ior: 2.4,
    envMap: envMap || null,
    envMapIntensity: 2.2,
  });
}

/**
 * 5. Brilliant Solitaire Diamond Gemstone Material
 */
export function createDiamondMaterial(envMap?: THREE.Texture): THREE.MeshPhysicalMaterial {
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#FFFFFF'),
    metalness: 0.0,
    roughness: 0.0,
    transmission: 0.96,                     // High crystal light transmission
    ior: 2.417,                             // Genuine diamond refractive index
    thickness: 1.6,
    specularIntensity: 1.0,
    specularColor: new THREE.Color('#FFFFFF'),
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    envMap: envMap || null,
    envMapIntensity: 3.4,
    attenuationColor: new THREE.Color('#F2F8FF'), // Subtle cool crystal tint
    attenuationDistance: 1.2,
    transparent: true,
    opacity: 0.98,
  });

  return material;
}
