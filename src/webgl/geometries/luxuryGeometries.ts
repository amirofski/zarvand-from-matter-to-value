import * as THREE from 'three';

/**
 * Hyper-Realistic 3D Gold Ingot / Bullion (شمش طلای ناب ۱ کیلوگرمی)
 * Precision draft angle taper, rounded chamfers, and UV alignment for hallmark stamps.
 */
export function createRealisticGoldIngotGeometry(
  width = 1.25,
  length = 2.4,
  height = 0.48,
  bevel = 0.055
): THREE.BufferGeometry {
  const halfW = width * 0.5;
  const halfL = length * 0.5;
  const cornerR = 0.09;

  const shape = new THREE.Shape();
  shape.moveTo(-halfW + cornerR, -halfL);
  shape.lineTo(halfW - cornerR, -halfL);
  shape.quadraticCurveTo(halfW, -halfL, halfW, -halfL + cornerR);
  shape.lineTo(halfW, halfL - cornerR);
  shape.quadraticCurveTo(halfW, halfL, halfW - cornerR, halfL);
  shape.lineTo(-halfW + cornerR, halfL);
  shape.quadraticCurveTo(-halfW, halfL, -halfW, halfL - cornerR);
  shape.lineTo(-halfW, -halfL + cornerR);
  shape.quadraticCurveTo(-halfW, -halfL, -halfW + cornerR, -halfL);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: height,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 2,
    bevelSize: bevel,
    bevelThickness: bevel,
  };

  const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geom.center();
  geom.rotateX(-Math.PI * 0.5); // Top face at +Y, bottom face at -Y

  const pos = geom.attributes.position;
  const uv = geom.attributes.uv;
  const count = pos.count;

  // Scan extents
  let minY = Infinity, maxY = -Infinity;
  let minX = Infinity, maxX = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (let i = 0; i < count; i++) {
    const y = pos.getY(i);
    const x = pos.getX(i);
    const z = pos.getZ(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  const heightSpan = maxY - minY;
  const topXSpan = maxX - minX;
  const topZSpan = maxZ - minZ;

  // Apply authentic mold draft angle (wider base) and precision hallmark UV mapping
  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const t = (maxY - y) / heightSpan; // 0 at top, 1 at bottom
    const draftScale = 1.0 + t * 0.085; // 8.5% wider at base

    pos.setX(i, x * draftScale);
    pos.setZ(i, z * draftScale);

    // UV mapping: Top face receives the crisp assayer hallmark engraving map
    if (y > maxY - bevel * 1.6) {
      // Left (-X, minX) to Right (+X, maxX) -> u: 0 -> 1
      const u = (x - minX) / topXSpan;
      // Top of bar (-Z, minZ) to Bottom of bar (+Z, maxZ)
      // Top of texture is v=1 (Crest, Brand), Bottom of texture is v=0 (Assayer, Serial)
      const v = (maxZ - z) / topZSpan;
      uv.setXY(i, Math.max(0, Math.min(1, u)), Math.max(0, Math.min(1, v)));
    } else {
      // Flanks & Base: continuous wrap with brushed metal grain
      const angle = Math.atan2(z, x);
      const u = (angle / (Math.PI * 2) + 0.5) * 2.5;
      const v = (y - minY) / heightSpan;
      uv.setXY(i, u, v);
    }
  }

  geom.computeVertexNormals();
  return geom;
}

// Precision Brilliant Cut Solitaire Diamond Geometry
export function createDiamondGeometry(radius = 0.5, height = 0.65): THREE.BufferGeometry {
  const vertices: number[] = [];
  const indices: number[] = [];

  const tableRadius = radius * 0.55;
  const girdleRadius = radius;
  const tableY = height * 0.35;
  const girdleY = 0.0;
  const culetY = -height * 0.65;
  const numFacets = 16;

  // Table center vertex (0)
  vertices.push(0, tableY, 0);

  // Table vertices (1 to numFacets)
  for (let i = 0; i < numFacets; i++) {
    const angle = (i / numFacets) * Math.PI * 2;
    vertices.push(Math.cos(angle) * tableRadius, tableY, Math.sin(angle) * tableRadius);
  }

  // Girdle upper vertices
  const girdleStart = vertices.length / 3;
  for (let i = 0; i < numFacets; i++) {
    const angle = ((i + 0.5) / numFacets) * Math.PI * 2;
    vertices.push(Math.cos(angle) * girdleRadius, girdleY, Math.sin(angle) * girdleRadius);
  }

  // Culet bottom point
  const culetIndex = vertices.length / 3;
  vertices.push(0, culetY, 0);

  // Table fan faces
  for (let i = 0; i < numFacets; i++) {
    const next = ((i + 1) % numFacets) + 1;
    indices.push(0, i + 1, next);
  }

  // Crown facets (table to girdle)
  for (let i = 0; i < numFacets; i++) {
    const t1 = i + 1;
    const t2 = ((i + 1) % numFacets) + 1;
    const g1 = girdleStart + i;
    const g2 = girdleStart + ((i + 1) % numFacets);

    indices.push(t1, g1, t2);
    indices.push(t2, g1, g2);
  }

  // Pavilion facets (girdle to culet)
  for (let i = 0; i < numFacets; i++) {
    const g1 = girdleStart + i;
    const g2 = girdleStart + ((i + 1) % numFacets);
    indices.push(g1, culetIndex, g2);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

// Exploded-View High Jewelry Ring Structure
export interface RingAssemblyMeshes {
  group: THREE.Group;
  shank: THREE.Mesh;
  prongs: THREE.Group;
  diamond: THREE.Mesh;
  innerBand: THREE.Mesh;
  outerBevels: THREE.Group;
  updateExploded: (factor: number) => void;
  updateWeightScale: (scaleFactor: number) => void;
}

export function createRingAssembly(
  goldMaterial: THREE.Material,
  diamondMaterial: THREE.Material,
  innerBandMaterial?: THREE.Material
): RingAssemblyMeshes {
  const group = new THREE.Group();

  // 1. Shank (Main Ring Torus Body) - Standing upright in XY plane
  const shankRadius = 1.1;
  const tubeRadius = 0.16;
  const shankGeom = new THREE.TorusGeometry(shankRadius, tubeRadius, 48, 120);
  const shank = new THREE.Mesh(shankGeom, goldMaterial);
  shank.castShadow = true;
  shank.receiveShadow = true;
  group.add(shank);

  // 2. Inner Hallmark Band (Precision inner sleeve inside finger hole)
  const innerRadius = shankRadius - tubeRadius * 0.88;
  const innerGeom = new THREE.CylinderGeometry(
    innerRadius,
    innerRadius,
    0.28,
    64,
    1,
    true
  );
  const innerMat = innerBandMaterial || (goldMaterial as THREE.MeshPhysicalMaterial).clone();
  const innerBand = new THREE.Mesh(innerGeom, innerMat);
  innerBand.rotation.x = Math.PI / 2; // Orient along Z matching the finger hole
  group.add(innerBand);

  // 3. Crown Base & Cathedral Setting Mount (Solid gold gallery on top of the shank)
  const crownBaseGroup = new THREE.Group();

  // Gallery Collar / Seat ring on top of the band
  const collarGeom = new THREE.CylinderGeometry(0.34, 0.26, 0.12, 24);
  const collar = new THREE.Mesh(collarGeom, goldMaterial);
  collar.position.set(0, shankRadius + tubeRadius * 0.72, 0); // y ≈ 1.215
  collar.castShadow = true;
  crownBaseGroup.add(collar);

  // Left & Right Cathedral Shoulder bridges (connecting shank to the collar)
  const bridgeGeom = new THREE.BoxGeometry(0.08, 0.22, 0.18);
  const bridgeLeft = new THREE.Mesh(bridgeGeom, goldMaterial);
  bridgeLeft.position.set(-0.24, shankRadius + tubeRadius * 0.55, 0);
  bridgeLeft.rotation.z = -0.55;
  crownBaseGroup.add(bridgeLeft);

  const bridgeRight = new THREE.Mesh(bridgeGeom, goldMaterial);
  bridgeRight.position.set(0.24, shankRadius + tubeRadius * 0.55, 0);
  bridgeRight.rotation.z = 0.55;
  crownBaseGroup.add(bridgeRight);

  group.add(crownBaseGroup);

  // 4. Prongs (Crown Setting - 6 Claws gripping the diamond)
  const prongs = new THREE.Group();
  const prongCount = 6;
  const prongRadius = 0.36;
  const prongHeight = 0.46;
  const clawGeom = new THREE.CylinderGeometry(0.022, 0.038, prongHeight, 16);
  clawGeom.translate(0, prongHeight / 2, 0);

  // Small sphere cap on top of each claw for realistic claw bead tip
  const clawTipGeom = new THREE.SphereGeometry(0.032, 12, 12);

  for (let i = 0; i < prongCount; i++) {
    const angle = (i / prongCount) * Math.PI * 2 + Math.PI / 6;
    const clawGroup = new THREE.Group();

    const claw = new THREE.Mesh(clawGeom, goldMaterial);
    claw.castShadow = true;
    clawGroup.add(claw);

    const tip = new THREE.Mesh(clawTipGeom, goldMaterial);
    tip.position.set(0, prongHeight, 0.015);
    clawGroup.add(tip);

    clawGroup.position.set(
      Math.cos(angle) * prongRadius,
      collar.position.y + 0.04,
      Math.sin(angle) * prongRadius
    );
    clawGroup.rotation.z = -Math.cos(angle) * 0.18;
    clawGroup.rotation.x = Math.sin(angle) * 0.18;

    prongs.add(clawGroup);
  }
  group.add(prongs);

  // 5. Diamond Gemstone (Centered in prongs, culet resting in collar seat)
  const diamondGeom = createDiamondGeometry(0.46, 0.60);
  const diamond = new THREE.Mesh(diamondGeom, diamondMaterial);
  const diamondCenterY = collar.position.y + 0.26; // y ≈ 1.47
  diamond.position.set(0, diamondCenterY, 0);
  diamond.castShadow = true;
  group.add(diamond);

  // 6. Outer Architectural Bevels / Accent Shoulders
  const outerBevels = new THREE.Group();
  const ribGeom = new THREE.TorusGeometry(shankRadius * 1.03, 0.03, 16, 32, Math.PI * 0.35);

  const ribLeft = new THREE.Mesh(ribGeom, goldMaterial);
  ribLeft.rotation.z = Math.PI * 0.12;
  ribLeft.position.z = 0.09;

  const ribRight = ribLeft.clone();
  ribRight.position.z = -0.09;

  outerBevels.add(ribLeft);
  outerBevels.add(ribRight);
  group.add(outerBevels);

  // Function to smoothly interpolate exploded view (0.0 = assembled, 1.0 = fully exploded)
  const updateExploded = (factor: number) => {
    const f = Math.max(0, Math.min(1, factor));

    // Shank lowers slightly
    shank.position.y = -f * 0.18;

    // Diamond lifts gracefully upwards
    diamond.position.y = diamondCenterY + f * 1.25;

    // Prongs follow diamond halfway
    prongs.position.y = f * 0.65;

    // Crown base collar floats slightly
    crownBaseGroup.position.y = f * 0.28;

    // Inner hallmark sleeve slides outwards along Z
    innerBand.position.z = f * 0.85;

    // Architectural ribs expand sideways
    ribLeft.position.z = 0.09 + f * 0.45;
    ribRight.position.z = -0.09 - f * 0.45;
  };

  const updateWeightScale = (scaleFactor: number) => {
    shank.scale.set(1.0, 1.0, scaleFactor);
    innerBand.scale.set(1.0, 1.0, scaleFactor);
  };

  return {
    group,
    shank,
    prongs,
    diamond,
    innerBand,
    outerBevels,
    updateExploded,
    updateWeightScale,
  };
}

// Ingot geometry alias mapping directly to the realistic gold bullion
export function createIngotGeometry(width = 1.25, length = 2.4, height = 0.48): THREE.BufferGeometry {
  return createRealisticGoldIngotGeometry(width, length, height);
}

/**
 * Organic Raw Gold Ore / Cosmic Nugget (تکه سنگ طلای خام کیهانی)
 * Sculpted with organic multi-octave crystalline facets, crevices, and natural riverbed shape.
 */
export function createRawGoldNuggetGeometry(
  radius = 1.35,
  detail = 3
): THREE.BufferGeometry {
  const geom = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geom.attributes.position;
  const count = pos.count;

  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    v.fromBufferAttribute(pos, i);

    // Natural nugget elongation and flattened riverbed asymmetry
    v.x *= 1.16;
    v.y *= 0.94;
    v.z *= 0.88;

    const dir = v.clone().normalize();

    // Octave 1: Major rock ridges and deep organic fissures
    const d1 = Math.sin(dir.x * 3.2) * Math.cos(dir.y * 3.0) * Math.sin(dir.z * 3.4) * 0.28;
    // Octave 2: Crystalline quartz-gold vein folds
    const d2 = Math.sin(dir.x * 6.5 + 1.2) * Math.sin(dir.y * 6.0) * 0.12;
    // Octave 3: High-frequency mineral crevice texture
    const d3 = (Math.sin(dir.x * 12.0) * Math.cos(dir.z * 12.0)) * 0.04;

    const displacement = 1.0 + (d1 + d2 + d3);
    v.multiplyScalar(displacement);

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();
  return geom;
}
