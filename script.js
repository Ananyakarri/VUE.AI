// Virtual Try-On Demo Application
class VirtualTryOn {
    constructor() {
        // Get DOM elements for webcam, overlay canvas, demo mode, and clothing grid
        this.webcam = document.getElementById('webcam');
        if (!this.webcam) {
            alert('Webcam element not found!');
            return;
        }
        this.canvas = document.getElementById('overlay-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.demoMode = document.getElementById('demo-mode');
        this.clothingGrid = document.getElementById('clothing-grid');
        
        // State variables
        this.selectedClothing = null; // Currently selected clothing item
        this.isCameraActive = false;  // Whether camera is active
        this.mirrorMode = false;      // Whether mirror mode is enabled
        
        // Define available clothing items (only Example T-Shirt remains)
        this.clothingItems = [
            {
                id: 0,
                name: "Example T-Shirt",
                category: "tops",
                image: this.createClothingIcon("#4CAF50", "shirt"),
                imgSrc: "tshirt.png", // Path to T-shirt image for overlay
                overlay: { x: 0.3, y: 0.25, width: 0.4, height: 0.35 }
            }
        ];
        // Set the only clothing item as selected by default
        this.selectedClothing = this.clothingItems[0];

        // Preload images for clothing items that use an image overlay
        this.loadedImages = {};
        this.clothingItems.forEach(item => {
            if (item.imgSrc) {
                const img = new Image();
                img.src = item.imgSrc;
                this.loadedImages[item.name] = img;
            }
        });

        // Initialize the app (setup listeners, render UI, etc.)
        this.init();
    }

    // Initialize event listeners, render clothing items, setup canvas, and start demo mode
    init() {
        this.setupEventListeners();
        this.renderClothingItems();
        this.setupCanvas();
        this.startDemo();
    }

    // Create a clothing icon as a data URL for use in the UI
    createClothingIcon(color, type) {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = color;
        ctx.strokeStyle = color === "#FFFFFF" ? "#CCCCCC" : "#333333";
        ctx.lineWidth = 2;
        
        // Draw different shapes for each clothing type
        switch(type) {
            case 'shirt':
                // T-shirt shape
                ctx.beginPath();
                ctx.moveTo(20, 25);
                ctx.lineTo(25, 20);
                ctx.lineTo(35, 20);
                ctx.lineTo(40, 15);
                ctx.lineTo(45, 15);
                ctx.lineTo(50, 20);
                ctx.lineTo(60, 20);
                ctx.lineTo(65, 25);
                ctx.lineTo(60, 35);
                ctx.lineTo(60, 65);
                ctx.lineTo(25, 65);
                ctx.lineTo(25, 35);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case 'pants':
                // Pants shape
                ctx.beginPath();
                ctx.moveTo(30, 15);
                ctx.lineTo(55, 15);
                ctx.lineTo(55, 45);
                ctx.lineTo(50, 45);
                ctx.lineTo(50, 70);
                ctx.lineTo(45, 70);
                ctx.lineTo(40, 45);
                ctx.lineTo(35, 70);
                ctx.lineTo(30, 70);
                ctx.lineTo(30, 45);
                ctx.lineTo(25, 45);
                ctx.lineTo(25, 15);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case 'dress':
                // Dress shape
                ctx.beginPath();
                ctx.moveTo(35, 20);
                ctx.lineTo(50, 20);
                ctx.lineTo(50, 30);
                ctx.lineTo(60, 35);
                ctx.lineTo(65, 65);
                ctx.lineTo(20, 65);
                ctx.lineTo(25, 35);
                ctx.lineTo(35, 30);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case 'hoodie':
                // Hoodie with hood
                ctx.beginPath();
                ctx.moveTo(15, 30);
                ctx.lineTo(20, 15);
                ctx.lineTo(35, 10);
                ctx.lineTo(50, 10);
                ctx.lineTo(65, 15);
                ctx.lineTo(70, 30);
                ctx.lineTo(65, 40);
                ctx.lineTo(65, 65);
                ctx.lineTo(20, 65);
                ctx.lineTo(20, 40);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // Hood
                ctx.beginPath();
                ctx.arc(42.5, 20, 15, 0, Math.PI, true);
                ctx.stroke();
                break;
            case 'shoes':
                // Shoes
                ctx.beginPath();
                ctx.ellipse(42.5, 50, 25, 12, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                // Shoe top
                ctx.beginPath();
                ctx.moveTo(25, 45);
                ctx.quadraticCurveTo(35, 35, 50, 35);
                ctx.quadraticCurveTo(60, 35, 65, 45);
                ctx.lineTo(60, 50);
                ctx.lineTo(25, 50);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;
            case 'jacket':
                // Jacket
                ctx.beginPath();
                ctx.moveTo(15, 25);
                ctx.lineTo(20, 20);
                ctx.lineTo(35, 15);
                ctx.lineTo(50, 15);
                ctx.lineTo(65, 20);
                ctx.lineTo(70, 25);
                ctx.lineTo(65, 35);
                ctx.lineTo(65, 60);
                ctx.lineTo(20, 60);
                ctx.lineTo(20, 35);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                // Collar
                ctx.beginPath();
                ctx.moveTo(30, 20);
                ctx.lineTo(35, 15);
                ctx.lineTo(50, 15);
                ctx.lineTo(55, 20);
                ctx.lineTo(50, 25);
                ctx.lineTo(35, 25);
                ctx.closePath();
                ctx.stroke();
                break;
        }
        // Return the icon as a data URL for use in the UI
        return canvas.toDataURL();
    }

    // Setup event listeners for camera controls and category filters
    setupEventListeners() {
        // Camera controls
        document.getElementById('start-camera').addEventListener('click', () => this.startCamera());
        document.getElementById('mirror-toggle').addEventListener('click', () => this.toggleMirror());
        document.getElementById('screenshot').addEventListener('click', () => this.takeScreenshot());
        
        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterByCategory(e.target.dataset.category));
        });
    }

    // Setup the overlay canvas to match the container size and handle resizing
    setupCanvas() {
        const container = this.canvas.parentElement;
        const resizeCanvas = () => {
            this.canvas.width = container.offsetWidth;
            this.canvas.height = container.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    // Start demo mode (shows overlay on a static background)
    startDemo() {
        this.demoMode.style.display = 'flex';
        this.webcam.style.display = 'none';
        // Animate demo overlay
        this.renderDemoOverlay();
        setInterval(() => this.renderDemoOverlay(), 100);
    }

    // Start the user's webcam and begin pose detection
    async startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' }
            });
            this.webcam.srcObject = stream;
            this.webcam.style.display = 'block';
            this.demoMode.style.display = 'none';
            this.isCameraActive = true;
            this.webcam.onloadedmetadata = () => {
                this.webcam.play();
                this.startPoseDetection();
            };
            console.log('Camera started successfully');
        } catch (error) {
            console.error('Camera access failed:', error);
            alert('Camera access failed. Using demo mode instead.');
            this.startDemo();
        }
    }

    // Initialize MediaPipe Pose and process video frames for pose detection
    async startPoseDetection() {
        // Initialize MediaPipe Pose if not already done
        if (!this.pose) {
            this.pose = new window.Pose({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${file}`
            });
            this.pose.setOptions({
                modelComplexity: 0, // You can increase this for higher accuracy
                smoothLandmarks: true,
                enableSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });
            this.pose.onResults((results) => this.onPoseResults(results));
        }

        // Create a hidden canvas for processing video frames
        if (!this.videoFrame) {
            this.videoFrame = document.createElement('canvas');
            this.videoFrame.width = this.webcam.videoWidth || 640;
            this.videoFrame.height = this.webcam.videoHeight || 480;
        }

        // Continuously process frames from the webcam
        const processFrame = async () => {
            if (!this.isCameraActive) return;
            this.videoFrame.width = this.webcam.videoWidth;
            this.videoFrame.height = this.webcam.videoHeight;
            const ctx = this.videoFrame.getContext('2d');
            ctx.drawImage(this.webcam, 0, 0, this.videoFrame.width, this.videoFrame.height);
            await this.pose.send({image: this.videoFrame});
            requestAnimationFrame(processFrame);
        };

        processFrame();
    }

    // Handle pose detection results and draw clothing overlay on the canvas
    onPoseResults(results) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!results.poseLandmarks || !this.selectedClothing) return;

        // Get landmarks for shoulders and hips
        const leftShoulder = results.poseLandmarks[11];
        const rightShoulder = results.poseLandmarks[12];
        const leftHip = results.poseLandmarks[23];
        const rightHip = results.poseLandmarks[24];

        if (leftShoulder && rightShoulder && leftHip && rightHip) {
            // Calculate center between shoulders
            const shoulderCenterX = ((leftShoulder.x + rightShoulder.x) / 2) * this.canvas.width;
            const shoulderCenterY = ((leftShoulder.y + rightShoulder.y) / 2) * this.canvas.height;
            // Calculate center between hips
            const hipCenterX = ((leftHip.x + rightHip.x) / 2) * this.canvas.width;
            const hipCenterY = ((leftHip.y + rightHip.y) / 2) * this.canvas.height;

            // Calculate the center point between shoulders and hips (torso center)
            const torsoCenterX = (shoulderCenterX + hipCenterX) / 2;
            const torsoCenterY = (shoulderCenterY + hipCenterY) / 2;

            // Calculate angle of shoulders
            const angle = Math.atan2(
                (leftShoulder.y - rightShoulder.y) * this.canvas.height,
                (leftShoulder.x - rightShoulder.x) * this.canvas.width
            );

            // Calculate width (distance between shoulders)
            const shirtWidth = Math.hypot(
                (rightShoulder.x - leftShoulder.x) * this.canvas.width,
                (rightShoulder.y - leftShoulder.y) * this.canvas.height
            ) * 1.5;

            // Calculate height (distance from shoulders to hips)
            const shirtHeight = Math.hypot(
                (hipCenterX - shoulderCenterX),
                (hipCenterY - shoulderCenterY)
            ) * 1.3;

            // Draw the T-shirt image or fallback rectangle, centered on the torso
            const img = this.loadedImages[this.selectedClothing.name];
            this.ctx.save();
            this.ctx.translate(torsoCenterX, torsoCenterY);
            this.ctx.rotate(angle);
            if (img && img.complete) {
                this.ctx.globalAlpha = 0.9;
                this.ctx.drawImage(
                    img,
                    -shirtWidth / 2,
                    -shirtHeight / 2,
                    shirtWidth,
                    shirtHeight
                );
                this.ctx.globalAlpha = 1;
            } else {
                this.ctx.globalAlpha = 0.6;
                this.ctx.fillStyle = this.getClothingColor(this.selectedClothing.name);
                this.ctx.fillRect(-shirtWidth / 2, -shirtHeight / 2, shirtWidth, shirtHeight);
                this.ctx.globalAlpha = 1;
            }
            this.ctx.restore();
        }
    }

    // Render overlay for demo mode (static, not pose-based)
    renderDemoOverlay() {
        if (!this.selectedClothing) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const overlay = this.selectedClothing.overlay;
        const x = overlay.x * this.canvas.width;
        const y = overlay.y * this.canvas.height;
        const width = overlay.width * this.canvas.width;
        const height = overlay.height * this.canvas.height;
        
        // Create clothing overlay
        this.ctx.fillStyle = this.getClothingColor(this.selectedClothing.name);
        this.ctx.globalAlpha = 0.7;
        this.ctx.fillRect(x, y, width, height);
        
        // Add border
        this.ctx.globalAlpha = 1;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        
        // Add label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(this.selectedClothing.name, x + 5, y - 5);
    }

    // Return color for each clothing item by name
    getClothingColor(name) {
        const colors = {
            'Black T-Shirt': '#000000',
            'Blue Jeans': '#4169E1',
            'Red Hoodie': '#DC143C',
            'Summer Dress': '#FF69B4',
            'White Sneakers': '#FFFFFF',
            'Green Jacket': '#228B22'
        };
        return colors[name] || '#888888';
    }

    // Render clothing items in the grid, filtered by category if provided
    renderClothingItems(filter = 'all') {
        this.clothingGrid.innerHTML = '';
        const filteredItems = filter === 'all' 
            ? this.clothingItems 
            : this.clothingItems.filter(item => item.category === filter);
        filteredItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'clothing-item';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <div class="category">${item.category}</div>
            `;
            div.addEventListener('click', () => this.selectClothing(item, div));
            this.clothingGrid.appendChild(div);
        });
    }

    // Handle clothing selection and update UI
    selectClothing(item, element) {
        // Remove previous selection
        document.querySelectorAll('.clothing-item').forEach(el => el.classList.remove('selected'));
        // Select new item
        element.classList.add('selected');
        this.selectedClothing = item;
        console.log(`Selected: ${item.name}`);
    }

    // Filter clothing items by category and update UI
    filterByCategory(category) {
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        // Render filtered items
        this.renderClothingItems(category);
    }

    // Toggle mirror mode for webcam and overlay
    toggleMirror() {
        this.mirrorMode = !this.mirrorMode;
        if (this.isCameraActive) {
            this.webcam.style.transform = this.mirrorMode ? 'scaleX(-1)' : 'scaleX(1)';
        }
        this.canvas.style.transform = this.mirrorMode ? 'scaleX(-1)' : 'scaleX(1)';
    }

    // Take a screenshot of the current try-on view (webcam + overlay)
    takeScreenshot() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        // Draw video frame
        if (this.isCameraActive && this.webcam.videoWidth > 0) {
            tempCtx.drawImage(this.webcam, 0, 0, tempCanvas.width, tempCanvas.height);
        } else {
            // Draw demo background if camera is not active
            const gradient = tempCtx.createLinearGradient(0, 0, tempCanvas.width, tempCanvas.height);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(0.5, '#764ba2');
            gradient.addColorStop(1, '#f093fb');
            tempCtx.fillStyle = gradient;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        }
        // Draw overlay
        tempCtx.drawImage(this.canvas, 0, 0);
        // Download image
        const link = document.createElement('a');
        link.download = `virtual-tryon-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL();
        link.click();
        console.log('Screenshot taken!');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VirtualTryOn();
});