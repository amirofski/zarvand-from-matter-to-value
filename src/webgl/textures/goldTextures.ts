import * as THREE from 'three';

/**
 * Procedural High-Fidelity PBR Texture Generator for Realistic Gold
 * Generates Albedo, Normal (with height debossing/embossing), and Roughness maps.
 */

// Generate realistic Ingot Albedo Texture with authentic assayer stamps
export function createIngotAlbedoTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Base 24K Gold Gradient with subtle longitudinal flow
  const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
  baseGrad.addColorStop(0.0, '#FFDB78'); // Highlight honey gold
  baseGrad.addColorStop(0.25, '#F5C452'); // Rich pure 24K gold
  baseGrad.addColorStop(0.5, '#E5B036'); // Deep golden body
  baseGrad.addColorStop(0.75, '#F8CE5D'); // Secondary luster
  baseGrad.addColorStop(1.0, '#DFA222'); // Warm molten amber undertone
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Fine Hairline Longitudinal Brushing & Micro-Pores
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Add subtle vertical brush lines along ingot length
  for (let y = 0; y < height; y++) {
    const rowBrush = Math.sin(y * 0.4) * 4 + (Math.sin(y * 1.8) * 3);
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const noise = (Math.random() - 0.5) * 6 + rowBrush;
      data[idx] = Math.min(255, Math.max(0, data[idx] + noise * 1.1));     // R
      data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + noise * 0.9)); // G
      data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + noise * 0.4)); // B
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // 3. Stamped Hallmarks on the Central Plaque (UV mapped to the top face)
  ctx.save();
  const centerX = width * 0.5;

  // Outer border chamfer line
  ctx.strokeStyle = 'rgba(110, 74, 16, 0.45)';
  ctx.lineWidth = 6;
  ctx.strokeRect(width * 0.08, height * 0.05, width * 0.84, height * 0.90);

  ctx.strokeStyle = 'rgba(255, 245, 200, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(width * 0.08 + 4, height * 0.05 + 4, width * 0.84 - 8, height * 0.90 - 8);

  // Crest / Emblem at top
  drawIngotCrest(ctx, centerX, height * 0.16, 80);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Primary Stamped Title: ZARVAND
  ctx.font = 'bold 78px "Cinzel", "Times New Roman", serif';
  drawEngravedText(ctx, 'ZARVAND', centerX, height * 0.27);

  // Haute Joaillerie Subtitle
  ctx.font = '600 28px "Cinzel", "Times New Roman", serif';
  drawEngravedText(ctx, 'HAUTE JOAILLERIE • GENÈVE', centerX, height * 0.32);

  // Divider bar
  ctx.fillStyle = 'rgba(110, 74, 16, 0.55)';
  ctx.fillRect(centerX - 180, height * 0.36, 360, 4);

  // Purity & Weight
  ctx.font = 'bold 92px "Cinzel", "Times New Roman", monospace';
  drawEngravedText(ctx, '1000 g', centerX, height * 0.43);

  ctx.font = 'bold 44px "Cinzel", "Times New Roman", sans-serif';
  drawEngravedText(ctx, 'FINE GOLD  999.9', centerX, height * 0.50);

  // Persian Calligraphic Accent
  ctx.font = 'bold 48px "Markazi Text", "Amiri", "Tahoma", serif';
  drawEngravedText(ctx, 'زروند • طلای ناب ۲۴ عیار', centerX, height * 0.58);

  // Secondary Divider bar
  ctx.fillStyle = 'rgba(110, 74, 16, 0.55)';
  ctx.fillRect(centerX - 140, height * 0.64, 280, 3);

  // Assayer Stamp Box
  const boxW = 460;
  const boxH = 130;
  const boxY = height * 0.74;
  ctx.strokeStyle = 'rgba(110, 74, 16, 0.65)';
  ctx.lineWidth = 4;
  ctx.strokeRect(centerX - boxW / 2, boxY - boxH / 2, boxW, boxH);

  ctx.font = 'bold 28px "Cinzel", monospace';
  drawEngravedText(ctx, 'MELTER ASSAYER', centerX, boxY - 20);
  ctx.font = 'bold 36px "Courier New", monospace';
  drawEngravedText(ctx, '№ 894021', centerX, boxY + 22);

  // Swiss Precious Metals footer
  ctx.font = '600 24px "Cinzel", sans-serif';
  drawEngravedText(ctx, 'SWISS PRECIOUS METALS', centerX, height * 0.88);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// Generate Normal Map for Ingot with Real 3D Stamped Relief and Brushed Metal
export function createIngotNormalTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 1024;

  // 1. Draw heightmap first (greyscale where 128 = flat, >128 = raised, <128 = recessed)
  const hCanvas = document.createElement('canvas');
  hCanvas.width = width;
  hCanvas.height = height;
  const hCtx = hCanvas.getContext('2d')!;

  hCtx.fillStyle = '#808080';
  hCtx.fillRect(0, 0, width, height);

  // Recessed engraving is darker (<128)
  const centerX = width * 0.5;

  // Recessed border
  hCtx.strokeStyle = '#555555';
  hCtx.lineWidth = 4;
  hCtx.strokeRect(width * 0.08, height * 0.05, width * 0.84, height * 0.90);

  // Crest
  drawIngotCrest(hCtx, centerX, height * 0.16, 40, true);

  // Engraved texts
  hCtx.textAlign = 'center';
  hCtx.textBaseline = 'middle';
  hCtx.fillStyle = '#404040';

  hCtx.font = 'bold 39px "Cinzel", serif';
  hCtx.fillText('ZARVAND', centerX, height * 0.27);

  hCtx.font = '600 14px "Cinzel", serif';
  hCtx.fillText('HAUTE JOAILLERIE • GENÈVE', centerX, height * 0.32);

  hCtx.fillRect(centerX - 90, height * 0.36, 180, 2);

  hCtx.font = 'bold 46px "Cinzel", monospace';
  hCtx.fillText('1000 g', centerX, height * 0.43);

  hCtx.font = 'bold 22px "Cinzel", sans-serif';
  hCtx.fillText('FINE GOLD  999.9', centerX, height * 0.50);

  hCtx.font = 'bold 24px "Markazi Text", "Amiri", "Tahoma", serif';
  hCtx.fillText('زروند • طلای ناب ۲۴ عیار', centerX, height * 0.58);

  hCtx.fillRect(centerX - 70, height * 0.64, 140, 2);

  const boxW = 230;
  const boxH = 65;
  const boxY = height * 0.74;
  hCtx.strokeRect(centerX - boxW / 2, boxY - boxH / 2, boxW, boxH);
  hCtx.font = 'bold 14px "Cinzel", monospace';
  hCtx.fillText('MELTER ASSAYER', centerX, boxY - 10);
  hCtx.font = 'bold 18px "Courier New", monospace';
  hCtx.fillText('№ 894021', centerX, boxY + 11);

  hCtx.font = '600 12px "Cinzel", sans-serif';
  hCtx.fillText('SWISS PRECIOUS METALS', centerX, height * 0.88);

  const hData = hCtx.getImageData(0, 0, width, height).data;

  // 2. Sobel filter conversion to Normal Map (RGB vectors)
  const nCanvas = document.createElement('canvas');
  nCanvas.width = width;
  nCanvas.height = height;
  const nCtx = nCanvas.getContext('2d')!;
  const nImg = nCtx.createImageData(width, height);
  const nData = nImg.data;

  const getH = (x: number, y: number) => {
    const px = Math.max(0, Math.min(width - 1, x));
    const py = Math.max(0, Math.min(height - 1, y));
    return hData[(py * width + px) * 4];
  };

  const strength = 1.4;

  for (let y = 0; y < height; y++) {
    const brushNormal = Math.sin(y * 1.5) * 6;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Sobel operator
      const tl = getH(x - 1, y - 1);
      const t  = getH(x,     y - 1);
      const tr = getH(x + 1, y - 1);
      const l  = getH(x - 1, y);
      const r  = getH(x + 1, y);
      const bl = getH(x - 1, y + 1);
      const b  = getH(x,     y + 1);
      const br = getH(x + 1, y + 1);

      const dX = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
      const dY = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr);

      // Normal vector
      let nx = -dX * strength * 0.05 + (Math.random() - 0.5) * 3;
      let ny = -dY * strength * 0.05 + brushNormal;
      let nz = 255.0;

      // Normalize
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx = (nx / len) * 127.5 + 128;
      ny = (ny / len) * 127.5 + 128;
      nz = (nz / len) * 127.5 + 128;

      nData[idx]     = Math.min(255, Math.max(0, nx));
      nData[idx + 1] = Math.min(255, Math.max(0, ny));
      nData[idx + 2] = Math.min(255, Math.max(0, nz));
      nData[idx + 3] = 255;
    }
  }

  nCtx.putImageData(nImg, 0, 0);

  const texture = new THREE.CanvasTexture(nCanvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// Generate Roughness Map for Ingot
export function createIngotRoughnessTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Polished gold mirror surface baseline (dark = smooth/glossy)
  ctx.fillStyle = '#222222'; // ~0.13 roughness
  ctx.fillRect(0, 0, width, height);

  // Stamped area has slightly higher roughness (satin imprint)
  ctx.fillStyle = 'rgba(70, 70, 70, 0.4)';
  ctx.fillRect(width * 0.1, height * 0.08, width * 0.8, height * 0.84);

  // Soft organic crucible cooling variations
  for (let i = 0; i < 24; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const r = 20 + Math.random() * 50;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(60, 55, 45, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// Generate High-Jewelry Mirror Gold Albedo (for rings, prongs, and fine components)
export function createJewelryGoldAlbedoTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Smooth circular jeweler's rouge buffing gradient with warm 18K/24K solid gold tones
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0.0, '#FFE89E'); // Crisp specular highlight
  grad.addColorStop(0.3, '#F7CA54'); // 18K/24K Rich gold core
  grad.addColorStop(0.7, '#E5B134'); // Deep champagne gold
  grad.addColorStop(1.0, '#D49820'); // Warm amber gold contour
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Subtle circular buffing swirl noise and micro-grain of precious metal
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const swirl = Math.sin((x + y) * 0.08) * 3 + Math.sin(x * 0.25) * 2 + (Math.random() - 0.5) * 3.5;
      data[idx]     = Math.min(255, Math.max(0, data[idx] + swirl * 1.1));
      data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + swirl * 0.85));
      data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + swirl * 0.4));
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  texture.needsUpdate = true;
  return texture;
}

// Generate Jewelry Normal Map with Fine Polishing Hairline Lines
export function createJewelryNormalTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  // Ultra-fine micro-hairline jeweler's wheel polish with smooth tangential flow
  for (let y = 0; y < size; y++) {
    const line = Math.sin(y * 1.8) * 6 + Math.sin(y * 4.2) * 3 + (Math.random() - 0.5) * 4;
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      data[idx]     = Math.min(255, Math.max(0, 128 + line));
      data[idx + 1] = Math.min(255, Math.max(0, 128 + (Math.random() - 0.5) * 3));
      data[idx + 2] = 254;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 2);
  texture.needsUpdate = true;
  return texture;
}

// Generate Jewelry Roughness Map (Flawless Mirror Polish)
export function createJewelryRoughnessTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Ultra-smooth mirror (~0.08 - 0.12)
  ctx.fillStyle = '#181818';
  ctx.fillRect(0, 0, size, size);

  // Microscopic buffing touch variations
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 10 + Math.random() * 35;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(40, 40, 40, 0.18)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  texture.needsUpdate = true;
  return texture;
}

// Generate Inner Ring Band Hallmark Stamped Texture
export function createInnerHallmarkTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 128;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Satin brushed warm gold background
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  grad.addColorStop(0, '#E2B246');
  grad.addColorStop(0.5, '#F5C85A');
  grad.addColorStop(1, '#E2B246');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Micro satin brush lines along length
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  for (let i = 0; i < 30; i++) {
    ctx.fillRect(0, Math.random() * height, width, 1.5);
  }

  // Stamped hallmarks inside the ring
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 24px "Cinzel", serif';
  ctx.fillStyle = '#4A3410';
  ctx.fillText('ZARVAND  •  AU 750 (18K)  •  ✦  •  № 7842', width * 0.5, height * 0.5);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

// ---------------------------------------------------------------------------
// Raw Gold Ore / Cosmic Nugget Textures (Chapter 01: Matter)
// ---------------------------------------------------------------------------
export function createRawGoldOreAlbedoTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Warm rich 24K cosmic nugget base with rock crevice gradient
  const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.7);
  grad.addColorStop(0.0, '#FFDF88');
  grad.addColorStop(0.3, '#F5BD40');
  grad.addColorStop(0.65, '#E2A422');
  grad.addColorStop(1.0, '#BD7E12');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Crystalline mineral veins and raw nugget crevices
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const noise = (Math.sin(x * 0.05) + Math.cos(y * 0.05) + Math.sin((x + y) * 0.03)) * 8
        + (Math.random() - 0.5) * 12;
      data[idx]     = Math.min(255, Math.max(0, data[idx] + noise));
      data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + noise * 0.8));
      data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + noise * 0.35));
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;
  return texture;
}

export function createRawGoldOreNormalTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgb(128, 128, 255)';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  // Craggy rocky facets and natural pores
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const bumpX = Math.sin(x * 0.12) * 15 + (Math.random() - 0.5) * 12;
      const bumpY = Math.cos(y * 0.12) * 15 + (Math.random() - 0.5) * 12;
      data[idx]     = Math.min(255, Math.max(0, 128 + bumpX));
      data[idx + 1] = Math.min(255, Math.max(0, 128 + bumpY));
      data[idx + 2] = 245;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;
  return texture;
}

export function createRawGoldOreRoughnessTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Roughness between 0.22 (smooth metallic vein) and 0.45 (rough rocky face)
  ctx.fillStyle = '#484848';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 35; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 10 + Math.random() * 40;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(80, 80, 80, 0.4)');
    grad.addColorStop(1, 'rgba(30, 30, 30, 0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

// Helpers for Ingot Crest & Hallmarks
function drawIngotCrest(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, isMask = false) {
  ctx.save();
  ctx.translate(cx, cy);

  if (isMask) {
    ctx.strokeStyle = '#404040';
    ctx.fillStyle = '#454545';
    ctx.lineWidth = 3;
  } else {
    ctx.strokeStyle = 'rgba(110, 74, 16, 0.7)';
    ctx.fillStyle = 'rgba(110, 74, 16, 0.6)';
    ctx.lineWidth = 4;
  }

  // Double circle outer crest
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
  ctx.stroke();

  // Central 8-pointed royal star / diamond insignia
  const points = 8;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? radius * 0.68 : radius * 0.32;
    const a = (i / (points * 2)) * Math.PI * 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawEngravedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  // Highlight bevel on bottom-right
  ctx.fillStyle = 'rgba(255, 245, 210, 0.4)';
  ctx.fillText(text, x + 1.5, y + 1.5);

  // Deep recessed core
  ctx.fillStyle = '#5A3C0C';
  ctx.fillText(text, x, y);
}
