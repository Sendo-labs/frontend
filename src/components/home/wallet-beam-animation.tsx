'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Types pour les wallets
interface WalletCard {
	address: string;
	balance: string;
	loss: string;
}

// Génère des adresses de wallet aléatoires pour la démo
function generateWalletAddress(): string {
	const chars = '0123456789ABCDEF';
	let address = '0x';
	for (let i = 0; i < 40; i++) {
		address += chars[Math.floor(Math.random() * chars.length)];
	}
	return address;
}

// Génère du code lié à Sendo au lieu de code générique
function generateSendoCode(width: number, height: number): string {
	const codeChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/"\'`~?';
	const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
	const pick = (arr: string[]) => arr[randInt(0, arr.length - 1)];

	const sendoHeaders = [
		'// SENDO WALLET SCANNER • ANALYZING ON-CHAIN DATA',
		'/* SCAN EFFECT • BURNING WALLET DATA */',
		'const SCAN_WIDTH = 8;',
		'const BURN_INTENSITY = 0.85;',
		'const MAX_PARTICLES = 2500;',
		'const TRANSITION = 0.05;',
	];

	const sendoHelpers = [
		'function analyzeWallet(address) { return scan(address); }',
		'function calculatePain(wallet) { return missedATH(wallet); }',
		'function burnData(data) { return transform(data); }',
		'const sendoScan = () => performance.now();',
	];

	const sendoBlocks = [
		'class WalletScanner {',
		'  constructor(address, balance, loss) {',
		'    this.address = address;',
		'    this.balance = balance;',
		'    this.loss = loss;',
		'  }',
		'  scan() { return this.analyze(); }',
		'  burn() { return this.transform(); }',
		'}',
	];

	const sendoData = [
		'const walletData = {',
		'  address: "0x...",',
		'  totalMissed: "$XXXk",',
		'  painLevel: "SEVERE",',
		'  scanStatus: "BURNING",',
		'};',
	];

	const library: string[] = [];
	sendoHeaders.forEach((l) => library.push(l));
	sendoHelpers.forEach((l) => library.push(l));
	sendoBlocks.forEach((l) => library.push(l));
	sendoData.forEach((l) => library.push(l));

	for (let i = 0; i < 40; i++) {
		const n1 = randInt(1, 9);
		const n2 = randInt(10, 99);
		library.push(`const v${i} = (${n1} + ${n2}) * 0.${randInt(1, 9)};`);
	}

	for (let i = 0; i < 20; i++) {
		library.push(`if (burnIntensity > ${1 + (i % 3)}) { scanner.glow += 0.01; }`);
	}

	let flow = library.join(' ');
	flow = flow.replace(/\s+/g, ' ').trim();
	const totalChars = width * height;
	while (flow.length < totalChars + width) {
		const extra = pick(library).replace(/\s+/g, ' ').trim();
		flow += ' ' + extra;
	}

	let out = '';
	let offset = 0;
	for (let row = 0; row < height; row++) {
		let line = flow.slice(offset, offset + width);
		if (line.length < width) line = line + ' '.repeat(width - line.length);
		out += line + (row < height - 1 ? '\n' : '');
		offset += width;
	}
	return out;
}

export default function WalletBeamAnimation() {
	const containerRef = useRef<HTMLDivElement>(null);
	const cardLineRef = useRef<HTMLDivElement>(null);
	const particleCanvasRef = useRef<HTMLCanvasElement>(null);
	const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
	const animationFrameRef = useRef<number | undefined>(undefined);
	const particleSystemRef = useRef<any>(null);
	const scannerRef = useRef<any>(null);
	const cardControllerRef = useRef<any>(null);
	const [isVisible, setIsVisible] = useState(false);

	// Animation d'apparition synchronisée avec la navbar (après 3 secondes)
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (!containerRef.current || !cardLineRef.current || !particleCanvasRef.current || !scannerCanvasRef.current)
			return;

		// Fonction pour charger Three.js
		const loadThreeJS = (): Promise<any> => {
			return new Promise((resolve) => {
				if (typeof window !== 'undefined' && (window as any).THREE) {
					resolve((window as any).THREE);
					return;
				}

				// Charger Three.js dynamiquement
				const script = document.createElement('script');
				script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
				script.onload = () => {
					resolve((window as any).THREE);
				};
				script.onerror = () => {
					console.error('Failed to load Three.js');
					resolve(null);
				};
				document.head.appendChild(script);
			});
		};

		// Fonction d'initialisation
		const initializeAnimation = (THREE: any) => {
			if (!THREE) {
				console.error('Three.js not available');
				return;
			}

			const container = containerRef.current!;
			const cardLine = cardLineRef.current!;
			const particleCanvas = particleCanvasRef.current!;
			const scannerCanvas = scannerCanvasRef.current!;

			// Card Stream Controller
			class CardStreamController {
				position: number = 0;
				velocity: number = 120;
				direction: number = -1;
				isAnimating: boolean = true;
				containerWidth: number = 0;
				cardLineWidth: number = 0;
				lastTime: number = performance.now();

				constructor() {
					this.populateCardLine();
					this.calculateDimensions();
					this.animate();
					this.startPeriodicUpdates();
					window.addEventListener('resize', () => this.calculateDimensions());
				}

				calculateDimensions() {
					this.containerWidth = container.offsetWidth;
					const cardWidth = 400;
					const cardGap = 60;
					const cardCount = cardLine.children.length;
					this.cardLineWidth = (cardWidth + cardGap) * cardCount;
				}

				createWalletWrapper(index: number) {
					const wrapper = document.createElement('div');
					wrapper.className = 'wallet-wrapper';
					wrapper.style.cssText = `
						position: relative;
						width: 400px;
						height: 250px;
						flex-shrink: 0;
					`;

					// Wallet normal avec gradients et effets visuels
					const normalWallet = document.createElement('div');
					normalWallet.className = 'wallet wallet-normal';

					// Background avec gradient complexe
					const bgGradient = document.createElement('div');
					bgGradient.style.cssText = `
						position: absolute;
						inset: 0;
						background: linear-gradient(135deg, 
							rgba(10, 10, 10, 1) 0%, 
							rgba(18, 18, 18, 1) 25%,
							rgba(25, 25, 25, 1) 50%,
							rgba(18, 18, 18, 1) 75%,
							rgba(10, 10, 10, 1) 100%
						);
						border-radius: 15px;
					`;

					// Overlay gradient pour effet de profondeur
					const overlayGradient = document.createElement('div');
					overlayGradient.style.cssText = `
						position: absolute;
						inset: 0;
						background: 
							linear-gradient(180deg, 
								rgba(255, 50, 40, 0.25) 0%, 
								rgba(255, 40, 50, 0.1) 20%,
								transparent 40%,
								transparent 60%,
								rgba(255, 34, 59, 0.1) 80%,
								rgba(255, 34, 59, 0.25) 100%
							),
							radial-gradient(ellipse at center, 
								rgba(255, 50, 40, 0.15) 0%, 
								transparent 70%
							);
						border-radius: 15px;
						pointer-events: none;
					`;

					// Shine effect
					const shineEffect = document.createElement('div');
					shineEffect.style.cssText = `
						position: absolute;
						top: -50%;
						left: -50%;
						width: 200%;
						height: 200%;
						background: linear-gradient(45deg, 
							transparent 30%, 
							rgba(255, 255, 255, 0.1) 50%, 
							transparent 70%
						);
						animation: shine 3s infinite;
						pointer-events: none;
					`;

					normalWallet.style.cssText = `
						position: absolute;
						top: 0;
						left: 0;
						width: 400px;
						height: 250px;
						border-radius: 15px;
						overflow: hidden;
						border: 2px solid rgba(255, 50, 40, 0.5);
						box-shadow: 
							0 15px 40px rgba(0, 0, 0, 0.8),
							inset 0 0 40px rgba(255, 50, 40, 0.15),
							inset 0 0 60px rgba(255, 34, 59, 0.1),
							0 0 30px rgba(255, 34, 59, 0.3),
							0 0 15px rgba(255, 50, 40, 0.2);
						z-index: 2;
						position: relative;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						padding: 20px;
						color: white;
					`;

					normalWallet.appendChild(bgGradient);
					normalWallet.appendChild(overlayGradient);
					normalWallet.appendChild(shineEffect);

					// Contenu du wallet
					const walletAddress = generateWalletAddress();
					const balance = (Math.random() * 100).toFixed(2);
					const loss = (Math.random() * 500).toFixed(0);

					const contentDiv = document.createElement('div');
					contentDiv.style.cssText =
						'position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column; justify-content: space-between;';
					contentDiv.innerHTML = `
						<div style="display: flex; justify-content: space-between; align-items: start;">
							<div>
								<div style="font-size: 11px; opacity: 0.6; margin-bottom: 8px; letter-spacing: 1px; text-transform: uppercase;">WALLET ADDRESS</div>
								<div style="font-family: 'Courier New', monospace; font-size: 15px; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);">${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}</div>
							</div>
							<div style="display: flex; align-items: center; height: 28px;">
								<img 
									src="/favicon.ico" 
									alt="SENDO" 
									style="height: 28px; width: 28px; filter: drop-shadow(0 0 10px rgba(255, 50, 40, 0.5));"
								/>
							</div>
						</div>
						<div style="margin-top: auto;">
							<div style="font-size: 11px; opacity: 0.6; margin-bottom: 0px; letter-spacing: 1px; text-transform: uppercase;">MISSED ATH</div>
							<div style="font-size: 32px; font-weight: bold; color: #FF223B; text-shadow: 0 0 10px rgba(255, 34, 59, 0.6), 0 2px 8px rgba(0, 0, 0, 0.5);">$${loss}k</div>
						</div>
						<div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px;">
							<div>
								<div style="font-size: 11px; opacity: 0.6; margin-bottom: 0px; letter-spacing: 1px; text-transform: uppercase;">BALANCE</div>
								<div style="font-size: 24px; font-weight: bold; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);">${balance} SOL</div>
							</div>
							<div style="position: relative; width: 45px; height: 32px;">
								<div style="position: absolute; inset: 0; background: linear-gradient(45deg, #FF3A2B, #FF223B); border-radius: 6px; box-shadow: 0 0 15px rgba(255, 50, 40, 0.5);"></div>
								<div style="position: absolute; inset: 2px; background: linear-gradient(45deg, #FF6B1F, #FF2A3F); border-radius: 4px; display: flex; align-items: center; justify-content: center;">
									<div style="width: 8px; height: 8px; background: rgba(255, 255, 255, 0.8); border-radius: 50%; box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);"></div>
								</div>
							</div>
						</div>
					`;
					normalWallet.appendChild(contentDiv);

					// Wallet ASCII (code)
					const asciiWallet = document.createElement('div');
					asciiWallet.className = 'wallet wallet-ascii';
					asciiWallet.style.cssText = `
						position: absolute;
						top: 0;
						left: 0;
						width: 400px;
						height: 250px;
						border-radius: 15px;
						overflow: hidden;
						background: transparent;
						z-index: 1;
					`;

					const asciiContent = document.createElement('div');
					asciiContent.className = 'ascii-content';
					const { width, height, fontSize, lineHeight } = this.calculateCodeDimensions(400, 250);
					asciiContent.style.cssText = `
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						color: rgba(255, 50, 40, 0.6);
						font-family: 'Courier New', monospace;
						font-size: ${fontSize}px;
						line-height: ${lineHeight}px;
						overflow: hidden;
						white-space: pre;
						margin: 0;
						padding: 0;
						text-align: left;
						vertical-align: top;
						box-sizing: border-box;
					`;
					asciiContent.textContent = generateSendoCode(width, height);

					asciiWallet.appendChild(asciiContent);
					wrapper.appendChild(normalWallet);
					wrapper.appendChild(asciiWallet);

					return wrapper;
				}

				calculateCodeDimensions(cardWidth: number, cardHeight: number) {
					const fontSize = 11;
					const lineHeight = 13;
					const charWidth = 6;
					const width = Math.floor(cardWidth / charWidth);
					const height = Math.floor(cardHeight / lineHeight);
					return { width, height, fontSize, lineHeight };
				}

				populateCardLine() {
					cardLine.innerHTML = '';
					const cardsCount = 30;
					for (let i = 0; i < cardsCount; i++) {
						const walletWrapper = this.createWalletWrapper(i);
						cardLine.appendChild(walletWrapper);
					}
				}

				updateCardPosition() {
					const containerWidth = this.containerWidth;
					const cardLineWidth = this.cardLineWidth;

					if (this.position < -cardLineWidth) {
						this.position = containerWidth;
					} else if (this.position > containerWidth) {
						this.position = -cardLineWidth;
					}

					// Mouvement horizontal uniquement
					cardLine.style.transform = `translateX(${this.position}px)`;
					this.updateCardClipping();
				}

				updateCardClipping() {
					const scannerX = document.documentElement.clientWidth / 2;
					const scannerWidth = 8;
					const scannerLeft = scannerX - scannerWidth / 2;
					const scannerRight = scannerX + scannerWidth / 2;
					let anyScanningActive = false;

					document.querySelectorAll('.wallet-wrapper').forEach((wrapper) => {
						const rect = (wrapper as HTMLElement).getBoundingClientRect();
						const cardLeft = rect.left;
						const cardRight = rect.right;
						const cardWidth = rect.width;

						const normalWallet = wrapper.querySelector('.wallet-normal') as HTMLElement;
						const asciiWallet = wrapper.querySelector('.wallet-ascii') as HTMLElement;

						if (cardLeft < scannerRight && cardRight > scannerLeft) {
							anyScanningActive = true;
							const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
							const scannerIntersectRight = Math.min(scannerRight - cardLeft, cardWidth);

							const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
							const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

							normalWallet.style.clipPath = `inset(0 0 0 ${normalClipRight}%)`;
							asciiWallet.style.clipPath = `inset(0 calc(100% - ${asciiClipLeft}%) 0 0)`;

							// Effet de scan + brûlure
							if (!wrapper.hasAttribute('data-scanned') && scannerIntersectLeft > 0) {
								wrapper.setAttribute('data-scanned', 'true');

								// Effet de scan
								const scanEffect = document.createElement('div');
								scanEffect.className = 'scan-effect';
								scanEffect.style.cssText = `
									position: absolute;
									top: 0;
									left: 0;
									width: 100%;
									height: 100%;
									background: linear-gradient(90deg, transparent, rgba(255, 50, 40, 0.4), transparent);
									animation: scanEffect 0.6s ease-out;
									pointer-events: none;
									z-index: 5;
								`;
								wrapper.appendChild(scanEffect);

								// Effet de brûlure (réduit)
								const burnEffect = document.createElement('div');
								burnEffect.className = 'burn-effect';
								burnEffect.style.cssText = `
									position: absolute;
									top: 0;
									left: 0;
									width: 100%;
									height: 100%;
									background: radial-gradient(circle at center, rgba(255, 34, 59, 0.25) 0%, rgba(255, 50, 40, 0.12) 50%, transparent 100%);
									animation: burnEffect 0.8s ease-out;
									pointer-events: none;
									z-index: 4;
									mix-blend-mode: screen;
								`;
								wrapper.appendChild(burnEffect);

								setTimeout(() => {
									if (scanEffect.parentNode) scanEffect.parentNode.removeChild(scanEffect);
									if (burnEffect.parentNode) burnEffect.parentNode.removeChild(burnEffect);
								}, 800);
							}
						} else {
							if (cardRight < scannerLeft) {
								normalWallet.style.clipPath = 'inset(0 0 0 100%)';
								asciiWallet.style.clipPath = 'inset(0 calc(100% - 100%) 0 0)';
							} else if (cardLeft > scannerRight) {
								normalWallet.style.clipPath = 'inset(0 0 0 0%)';
								asciiWallet.style.clipPath = 'inset(0 calc(100% - 0%) 0 0)';
							}
							wrapper.removeAttribute('data-scanned');
						}
					});

					if ((window as any).setScannerScanning) {
						(window as any).setScannerScanning(anyScanningActive);
					}
				}

				animate() {
					const currentTime = performance.now();
					const deltaTime = (currentTime - this.lastTime) / 1000;
					this.lastTime = currentTime;

					if (this.isAnimating) {
						if (this.velocity > 30) {
							this.velocity *= 0.95;
						} else {
							this.velocity = Math.max(30, this.velocity);
						}

						this.position += this.velocity * this.direction * deltaTime;
						this.updateCardPosition();
					}

					animationFrameRef.current = requestAnimationFrame(() => this.animate());
				}

				startPeriodicUpdates() {
					setInterval(() => {
						document.querySelectorAll('.ascii-content').forEach((content) => {
							if (Math.random() < 0.15) {
								const { width, height } = this.calculateCodeDimensions(400, 250);
								(content as HTMLElement).textContent = generateSendoCode(width, height);
							}
						});
					}, 200);

					const updateClipping = () => {
						this.updateCardClipping();
						requestAnimationFrame(updateClipping);
					};
					updateClipping();
				}
			}

			// Particle System avec couleurs Sendo
			class ParticleSystem {
				scene: any;
				camera: any;
				renderer: any;
				particles: any;
				particleCount: number = 400;
				velocities!: Float32Array;
				alphas!: Float32Array;

				constructor() {
					this.scene = new THREE.Scene();
					const width = document.documentElement.clientWidth;
					this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, 135, -125, 1, 1000);
					this.camera.position.z = 100;

					this.renderer = new THREE.WebGLRenderer({
						canvas: particleCanvas,
						alpha: true,
						antialias: true,
					});
					this.renderer.setSize(width, 260);
					this.renderer.setClearColor(0x000000, 0);

					this.createParticles();
					this.animate();
					window.addEventListener('resize', () => this.onWindowResize());
				}

				createParticles() {
					const geometry = new THREE.BufferGeometry();
					const positions = new Float32Array(this.particleCount * 3);
					const colors = new Float32Array(this.particleCount * 3);
					const sizes = new Float32Array(this.particleCount);
					const velocities = new Float32Array(this.particleCount);
					const width = document.documentElement.clientWidth;

					const canvas = document.createElement('canvas');
					canvas.width = 100;
					canvas.height = 100;
					const ctx = canvas.getContext('2d')!;

					const half = canvas.width / 2;
					// Couleurs Sendo : orange/rouge au lieu de violet
					const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
					gradient.addColorStop(0.025, '#fff');
					gradient.addColorStop(0.1, 'rgba(255, 50, 40, 0.8)'); // sendo-red-orange
					gradient.addColorStop(0.25, 'rgba(255, 34, 59, 0.4)'); // sendo-red
					gradient.addColorStop(1, 'transparent');

					ctx.fillStyle = gradient;
					ctx.beginPath();
					ctx.arc(half, half, half, 0, Math.PI * 2);
					ctx.fill();

					const texture = new THREE.CanvasTexture(canvas);

					for (let i = 0; i < this.particleCount; i++) {
						positions[i * 3] = (Math.random() - 0.5) * width * 2;
						positions[i * 3 + 1] = (Math.random() - 0.5) * 260;
						positions[i * 3 + 2] = 0;

						colors[i * 3] = 1;
						colors[i * 3 + 1] = 0.4;
						colors[i * 3 + 2] = 0.1;

						const orbitRadius = Math.random() * 200 + 100;
						sizes[i] = (Math.random() * (orbitRadius - 60) + 60) / 8;

						velocities[i] = Math.random() * 60 + 30;
					}

					geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
					geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
					geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

					this.velocities = velocities;

					const alphas = new Float32Array(this.particleCount);
					for (let i = 0; i < this.particleCount; i++) {
						alphas[i] = (Math.random() * 4 + 1) / 10; // Réduit de 0.2-1.0 à 0.1-0.5
					}
					geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
					this.alphas = alphas;

					const material = new THREE.ShaderMaterial({
						uniforms: {
							pointTexture: { value: texture },
							size: { value: 15.0 },
						},
						vertexShader: `
							attribute float alpha;
							varying float vAlpha;
							varying vec3 vColor;
							uniform float size;
							
							void main() {
								vAlpha = alpha;
								vColor = color;
								vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
								gl_PointSize = size;
								gl_Position = projectionMatrix * mvPosition;
							}
						`,
						fragmentShader: `
							uniform sampler2D pointTexture;
							varying float vAlpha;
							varying vec3 vColor;
							
							void main() {
								gl_FragColor = vec4(vColor, vAlpha) * texture2D(pointTexture, gl_PointCoord);
							}
						`,
						transparent: true,
						blending: THREE.AdditiveBlending,
						depthWrite: false,
						vertexColors: true,
					});

					this.particles = new THREE.Points(geometry, material);
					this.scene.add(this.particles);
				}

				animate() {
					requestAnimationFrame(() => this.animate());

					if (this.particles) {
						const positions = this.particles.geometry.attributes.position.array as Float32Array;
						const alphas = this.particles.geometry.attributes.alpha.array as Float32Array;
						const time = Date.now() * 0.001;
						const width = document.documentElement.clientWidth;

						for (let i = 0; i < this.particleCount; i++) {
							positions[i * 3] += this.velocities[i] * 0.016;

							if (positions[i * 3] > width / 2 + 100) {
								positions[i * 3] = -width / 2 - 100;
								positions[i * 3 + 1] = (Math.random() - 0.5) * 260;
							}

							positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;

							const twinkle = Math.floor(Math.random() * 10);
							if (twinkle === 1 && alphas[i] > 0) {
								alphas[i] -= 0.05;
							} else if (twinkle === 2 && alphas[i] < 1) {
								alphas[i] += 0.05;
							}

							alphas[i] = Math.max(0, Math.min(1, alphas[i]));
						}

						this.particles.geometry.attributes.position.needsUpdate = true;
						this.particles.geometry.attributes.alpha.needsUpdate = true;
					}

					this.renderer.render(this.scene, this.camera);
				}

				onWindowResize() {
					const width = document.documentElement.clientWidth;
					this.camera.left = -width / 2;
					this.camera.right = width / 2;
					this.camera.updateProjectionMatrix();
					this.renderer.setSize(width, 260);
				}
			}

			// Particle Scanner avec couleurs Sendo
			class ParticleScanner {
				canvas: HTMLCanvasElement;
				ctx: CanvasRenderingContext2D;
				animationId: number | null = null;
				w: number;
				h: number = 260;
				particles: any[] = [];
				count: number = 0;
				maxParticles: number = 800;
				intensity: number = 0.8;
				lightBarX: number;
				lightBarWidth: number = 3;
				fadeZone: number = 60;
				scanTargetIntensity: number = 1.8;
				scanTargetParticles: number = 2500;
				scanTargetFadeZone: number = 35;
				scanningActive: boolean = false;
				baseIntensity: number;
				baseMaxParticles: number;
				baseFadeZone: number;
				currentIntensity: number;
				currentMaxParticles: number;
				currentFadeZone: number;
				transitionSpeed: number = 0.05;
				currentGlowIntensity: number = 1;
				gradientCanvas!: HTMLCanvasElement;
				gradientCtx!: CanvasRenderingContext2D;

				constructor() {
					this.canvas = scannerCanvas;
					this.ctx = scannerCanvas.getContext('2d')!;
					this.w = document.documentElement.clientWidth;
					this.lightBarX = this.w / 2;
					this.baseIntensity = this.intensity;
					this.baseMaxParticles = this.maxParticles;
					this.baseFadeZone = this.fadeZone;
					this.currentIntensity = this.intensity;
					this.currentMaxParticles = this.maxParticles;
					this.currentFadeZone = this.fadeZone;

					this.setupCanvas();
					this.createGradientCache();
					this.initParticles();
					this.animate();
					window.addEventListener('resize', () => this.onResize());
				}

				setupCanvas() {
					this.canvas.width = this.w;
					this.canvas.height = this.h;
					this.canvas.style.width = this.w + 'px';
					this.canvas.style.height = this.h + 'px';
					this.ctx.clearRect(0, 0, this.w, this.h);
				}

				onResize() {
					this.w = document.documentElement.clientWidth;
					this.lightBarX = this.w / 2;
					this.setupCanvas();
				}

				createGradientCache() {
					this.gradientCanvas = document.createElement('canvas');
					this.gradientCtx = this.gradientCanvas.getContext('2d')!;
					this.gradientCanvas.width = 16;
					this.gradientCanvas.height = 16;

					const half = this.gradientCanvas.width / 2;
					// Couleurs Sendo : orange/rouge
					const gradient = this.gradientCtx.createRadialGradient(half, half, 0, half, half, half);
					gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
					gradient.addColorStop(0.3, 'rgba(255, 50, 40, 0.8)'); // sendo-red-orange
					gradient.addColorStop(0.7, 'rgba(255, 34, 59, 0.4)'); // sendo-red
					gradient.addColorStop(1, 'transparent');

					this.gradientCtx.fillStyle = gradient;
					this.gradientCtx.beginPath();
					this.gradientCtx.arc(half, half, half, 0, Math.PI * 2);
					this.gradientCtx.fill();
				}

				random(min: number, max?: number): number {
					if (max === undefined) {
						max = min;
						min = 0;
					}
					return Math.floor(Math.random() * (max - min + 1)) + min;
				}

				randomFloat(min: number, max: number): number {
					return Math.random() * (max - min) + min;
				}

				createParticle() {
					const intensityRatio = this.intensity / this.baseIntensity;
					const speedMultiplier = 1 + (intensityRatio - 1) * 1.2;
					const sizeMultiplier = 1 + (intensityRatio - 1) * 0.7;

					return {
						x: this.lightBarX + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2),
						y: this.randomFloat(0, this.h),
						vx: this.randomFloat(0.2, 1.0) * speedMultiplier,
						vy: this.randomFloat(-0.15, 0.15) * speedMultiplier,
						radius: this.randomFloat(0.4, 1) * sizeMultiplier,
						alpha: this.randomFloat(0.3, 0.5), // Réduit de 0.6-1.0 à 0.3-0.5
						decay: this.randomFloat(0.005, 0.025) * (2 - intensityRatio * 0.5),
						originalAlpha: 0,
						life: 1.0,
						time: 0,
						startX: 0,
						twinkleSpeed: this.randomFloat(0.02, 0.08) * speedMultiplier,
						twinkleAmount: this.randomFloat(0.05, 0.15), // Réduit
					};
				}

				initParticles() {
					for (let i = 0; i < this.maxParticles; i++) {
						const particle = this.createParticle();
						particle.originalAlpha = particle.alpha;
						particle.startX = particle.x;
						this.count++;
						this.particles[this.count] = particle;
					}
				}

				updateParticle(particle: any) {
					particle.x += particle.vx;
					particle.y += particle.vy;
					particle.time++;

					particle.alpha =
						particle.originalAlpha * particle.life +
						Math.sin(particle.time * particle.twinkleSpeed) * particle.twinkleAmount;
					particle.life -= particle.decay;

					if (particle.x > this.w + 10 || particle.life <= 0) {
						this.resetParticle(particle);
					}
				}

				resetParticle(particle: any) {
					particle.x = this.lightBarX + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
					particle.y = this.randomFloat(0, this.h);
					particle.vx = this.randomFloat(0.2, 1.0);
					particle.vy = this.randomFloat(-0.15, 0.15);
					particle.alpha = this.randomFloat(0.3, 0.5); // Réduit
					particle.originalAlpha = particle.alpha;
					particle.life = 1.0;
					particle.time = 0;
					particle.startX = particle.x;
				}

				drawParticle(particle: any) {
					if (particle.life <= 0) return;

					let fadeAlpha = 1;
					if (particle.y < this.fadeZone) {
						fadeAlpha = particle.y / this.fadeZone;
					} else if (particle.y > this.h - this.fadeZone) {
						fadeAlpha = (this.h - particle.y) / this.fadeZone;
					}
					fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));

					this.ctx.globalAlpha = particle.alpha * fadeAlpha;
					this.ctx.drawImage(
						this.gradientCanvas,
						particle.x - particle.radius,
						particle.y - particle.radius,
						particle.radius * 2,
						particle.radius * 2,
					);
				}

				drawLightBar() {
					const verticalGradient = this.ctx.createLinearGradient(0, 0, 0, this.h);
					verticalGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
					verticalGradient.addColorStop(this.fadeZone / this.h, 'rgba(255, 255, 255, 1)');
					verticalGradient.addColorStop(1 - this.fadeZone / this.h, 'rgba(255, 255, 255, 1)');
					verticalGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

					this.ctx.globalCompositeOperation = 'lighter';

					const targetGlowIntensity = this.scanningActive ? 3.5 : 1;
					this.currentGlowIntensity += (targetGlowIntensity - this.currentGlowIntensity) * this.transitionSpeed;
					const glowIntensity = this.currentGlowIntensity;
					const lineWidth = this.lightBarWidth;
					const glow1Alpha = this.scanningActive ? 1.0 : 0.8;
					const glow2Alpha = this.scanningActive ? 0.8 : 0.6;
					const glow3Alpha = this.scanningActive ? 0.6 : 0.4;

					// Core gradient - blanc/orange
					const coreGradient = this.ctx.createLinearGradient(
						this.lightBarX - lineWidth / 2,
						0,
						this.lightBarX + lineWidth / 2,
						0,
					);
					coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
					coreGradient.addColorStop(0.3, `rgba(255, 255, 255, ${0.9 * glowIntensity})`);
					coreGradient.addColorStop(0.5, `rgba(255, 255, 255, ${1 * glowIntensity})`);
					coreGradient.addColorStop(0.7, `rgba(255, 255, 255, ${0.9 * glowIntensity})`);
					coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

					this.ctx.globalAlpha = 1;
					this.ctx.fillStyle = coreGradient;
					const radius = 15;
					this.ctx.beginPath();
					(this.ctx as any).roundRect(this.lightBarX - lineWidth / 2, 0, lineWidth, this.h, radius);
					this.ctx.fill();

					// Glow 1 - orange
					const glow1Gradient = this.ctx.createLinearGradient(
						this.lightBarX - lineWidth * 2,
						0,
						this.lightBarX + lineWidth * 2,
						0,
					);
					glow1Gradient.addColorStop(0, 'rgba(255, 34, 59, 0)');
					glow1Gradient.addColorStop(0.5, `rgba(255, 50, 40, ${0.8 * glowIntensity})`);
					glow1Gradient.addColorStop(1, 'rgba(255, 34, 59, 0)');

					this.ctx.globalAlpha = glow1Alpha;
					this.ctx.fillStyle = glow1Gradient;
					const glow1Radius = 25;
					this.ctx.beginPath();
					(this.ctx as any).roundRect(this.lightBarX - lineWidth * 2, 0, lineWidth * 4, this.h, glow1Radius);
					this.ctx.fill();

					// Glow 2 - rouge
					const glow2Gradient = this.ctx.createLinearGradient(
						this.lightBarX - lineWidth * 4,
						0,
						this.lightBarX + lineWidth * 4,
						0,
					);
					glow2Gradient.addColorStop(0, 'rgba(255, 34, 59, 0)');
					glow2Gradient.addColorStop(0.5, `rgba(255, 34, 59, ${0.4 * glowIntensity})`);
					glow2Gradient.addColorStop(1, 'rgba(255, 34, 59, 0)');

					this.ctx.globalAlpha = glow2Alpha;
					this.ctx.fillStyle = glow2Gradient;
					const glow2Radius = 35;
					this.ctx.beginPath();
					(this.ctx as any).roundRect(this.lightBarX - lineWidth * 4, 0, lineWidth * 8, this.h, glow2Radius);
					this.ctx.fill();

					if (this.scanningActive) {
						// Glow 3 - dark red
						const glow3Gradient = this.ctx.createLinearGradient(
							this.lightBarX - lineWidth * 8,
							0,
							this.lightBarX + lineWidth * 8,
							0,
						);
						glow3Gradient.addColorStop(0, 'rgba(74, 12, 19, 0)');
						glow3Gradient.addColorStop(0.5, 'rgba(255, 34, 59, 0.2)');
						glow3Gradient.addColorStop(1, 'rgba(74, 12, 19, 0)');

						this.ctx.globalAlpha = glow3Alpha;
						this.ctx.fillStyle = glow3Gradient;
						const glow3Radius = 45;
						this.ctx.beginPath();
						(this.ctx as any).roundRect(this.lightBarX - lineWidth * 8, 0, lineWidth * 16, this.h, glow3Radius);
						this.ctx.fill();
					}

					this.ctx.globalCompositeOperation = 'destination-in';
					this.ctx.globalAlpha = 1;
					this.ctx.fillStyle = verticalGradient;
					this.ctx.fillRect(0, 0, this.w, this.h);
				}

				render() {
					const targetIntensity = this.scanningActive ? this.scanTargetIntensity : this.baseIntensity;
					const targetMaxParticles = this.scanningActive ? this.scanTargetParticles : this.baseMaxParticles;
					const targetFadeZone = this.scanningActive ? this.scanTargetFadeZone : this.baseFadeZone;

					this.currentIntensity += (targetIntensity - this.currentIntensity) * this.transitionSpeed;
					this.currentMaxParticles += (targetMaxParticles - this.currentMaxParticles) * this.transitionSpeed;
					this.currentFadeZone += (targetFadeZone - this.currentFadeZone) * this.transitionSpeed;

					this.intensity = this.currentIntensity;
					this.maxParticles = Math.floor(this.currentMaxParticles);
					this.fadeZone = this.currentFadeZone;

					this.ctx.globalCompositeOperation = 'source-over';
					this.ctx.clearRect(0, 0, this.w, this.h);

					this.drawLightBar();

					this.ctx.globalCompositeOperation = 'lighter';
					for (let i = 1; i <= this.count; i++) {
						if (this.particles[i]) {
							this.updateParticle(this.particles[i]);
							this.drawParticle(this.particles[i]);
						}
					}

					const currentIntensity = this.intensity;
					const currentMaxParticles = this.maxParticles;

					if (Math.random() < currentIntensity && this.count < currentMaxParticles) {
						const particle = this.createParticle();
						particle.originalAlpha = particle.alpha;
						particle.startX = particle.x;
						this.count++;
						this.particles[this.count] = particle;
					}

					const intensityRatio = this.intensity / this.baseIntensity;
					if (intensityRatio > 1.1 && Math.random() < (intensityRatio - 1.0) * 1.2) {
						const particle = this.createParticle();
						particle.originalAlpha = particle.alpha;
						particle.startX = particle.x;
						this.count++;
						this.particles[this.count] = particle;
					}
				}

				animate() {
					this.render();
					this.animationId = requestAnimationFrame(() => this.animate());
				}

				setScanningActive(active: boolean) {
					this.scanningActive = active;
				}
			}

			// Initialiser les systèmes
			cardControllerRef.current = new CardStreamController();
			particleSystemRef.current = new ParticleSystem();
			scannerRef.current = new ParticleScanner();

			(window as any).setScannerScanning = (active: boolean) => {
				if (scannerRef.current) {
					scannerRef.current.setScanningActive(active);
				}
			};

			// Ajouter les styles CSS dynamiquement
			const style = document.createElement('style');
			style.textContent = `
				@keyframes scanEffect {
					0% {
						transform: translateX(-100%);
						opacity: 0;
					}
					50% {
						opacity: 1;
					}
					100% {
						transform: translateX(100%);
						opacity: 0;
					}
				}
				@keyframes burnEffect {
					0% {
						opacity: 0;
						transform: scale(0.8);
					}
					50% {
						opacity: 0.6;
						transform: scale(1.1);
					}
					100% {
						opacity: 0;
						transform: scale(1);
					}
				}
				@keyframes shine {
					0% {
						transform: translateX(-100%) translateY(-100%) rotate(45deg);
					}
					100% {
						transform: translateX(100%) translateY(100%) rotate(45deg);
					}
				}
			`;
			document.head.appendChild(style);
		};

		// Charger Three.js puis initialiser
		loadThreeJS().then((THREE) => {
			if (THREE) {
				initializeAnimation(THREE);
			}
		});

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
			if (particleSystemRef.current) {
				// Cleanup particle system
				if (particleSystemRef.current.renderer) {
					particleSystemRef.current.renderer.dispose();
				}
			}
			if (scannerRef.current && scannerRef.current.animationId) {
				cancelAnimationFrame(scannerRef.current.animationId);
			}
		};
	}, []);

	return (
		<motion.div
			ref={containerRef}
			className='wallet-beam-container'
			initial={{ opacity: 0, y: 50 }}
			animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
			transition={{
				duration: 0.8,
				ease: [0.25, 0.1, 0.25, 1],
				delay: 0.2, // Légèrement après la navbar pour un effet en cascade
			}}
			style={{
				position: 'absolute',
				bottom: '0px',
				left: 0,
				width: '100%',
				height: '270px',
				overflow: 'visible',
				zIndex: 50,
				willChange: 'opacity, transform',
				transform: 'translateZ(0)',
			}}
		>
			<canvas
				ref={particleCanvasRef}
				id='particleCanvas'
				style={{
					position: 'absolute',
					top: '50%',
					left: 0,
					transform: 'translateY(-50%)',
					width: '100%',
					height: '260px',
					zIndex: 0,
					pointerEvents: 'none',
				}}
			/>
			<canvas
				ref={scannerCanvasRef}
				id='scannerCanvas'
				style={{
					position: 'absolute',
					top: '70%',
					left: 0,
					transform: 'translateY(-50%)',
					width: '100%',
					height: '300px',
					zIndex: 15,
					pointerEvents: 'none',
				}}
			/>
			{/* Container des cartes - transform géré par JS vanilla */}
			<div
				ref={cardLineRef}
				className='wallet-line'
				style={{
					position: 'absolute',
					width: '100%',
					height: '250px',
					display: 'flex',
					alignItems: 'center',
					overflow: 'visible',
					top: '35%',
					transform: 'translateY(-50%)',
					gap: '60px',
					whiteSpace: 'nowrap',
					cursor: 'grab',
					userSelect: 'none',
					willChange: 'transform',
				}}
			/>
		</motion.div>
	);
}
