export class TextPressure {
    constructor(containerId, options = {}) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
  
      this.options = {
        text: options.text || "Compressa",
        fontFamily: options.fontFamily || "Compressa VF",
        fontUrl: options.fontUrl || "https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2",
        width: options.width !== undefined ? options.width : true,
        weight: options.weight !== undefined ? options.weight : true,
        italic: options.italic !== undefined ? options.italic : true,
        alpha: options.alpha !== undefined ? options.alpha : false,
        flex: options.flex !== undefined ? options.flex : true,
        stroke: options.stroke !== undefined ? options.stroke : false,
        scale: options.scale !== undefined ? options.scale : false,
        textColor: options.textColor || "#FFFFFF",
        strokeColor: options.strokeColor || "#FF0000",
        strokeWidth: options.strokeWidth || 2,
        minFontSize: options.minFontSize || 24,
      };
      
      this.mouse = { x: 0, y: 0 };
      this.cursor = { x: 0, y: 0 };
      this.spans = [];
      this.rafId = null;
      
      this.init();
    }
  
    init() {
      // Load Font
      const style = document.createElement("style");
      style.textContent = `
        @font-face {
          font-family: '${this.options.fontFamily}';
          src: url('${this.options.fontUrl}');
          font-style: normal;
        }
        .text-pressure-title span {
            display: inline-block;
            cursor: default;
        }
      `;
      document.head.appendChild(style);
  
      // Build DOM
      this.container.style.position = 'relative';
      // this.container.style.overflow = 'hidden'; // Removed to prevent clipping
      // this.container.style.width = '100%'; 
      // this.container.style.height = '100%';
  
      const h1 = document.createElement('h1');
      h1.className = `text-pressure-title ${this.options.flex ? 'flex justify-between' : ''} uppercase text-center`;
      h1.style.fontFamily = this.options.fontFamily;
      h1.style.fontWeight = '100';
      h1.style.margin = '0';
      h1.style.color = this.options.stroke ? 'transparent' : this.options.textColor;
      h1.style.transformOrigin = 'center top';
      h1.style.width = '100%'; // Ensure it fills container
  
      if (this.options.stroke) {
         h1.style.webkitTextStroke = `${this.options.strokeWidth}px ${this.options.strokeColor}`;
      }
  
      const chars = this.options.text.split("");
      chars.forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.dataset.char = char;
        
        if (this.options.stroke) {
            // CSS for stroke fallback if needed, generally handled by parent color being transparent + webkit-text-stroke
            // But if we want inner fill transparent and stroke visible
        }
  
        h1.appendChild(span);
        this.spans.push(span);
      });
  
      this.container.innerHTML = '';
      this.container.appendChild(h1);
      this.title = h1;
  
      // Events
      this.boundMouseMove = this.handleMouseMove.bind(this);
      this.boundTouchMove = this.handleTouchMove.bind(this);
      this.boundResize = this.setSize.bind(this);
  
      window.addEventListener("mousemove", this.boundMouseMove);
      window.addEventListener("touchmove", this.boundTouchMove, { passive: false });
      window.addEventListener("resize", this.boundResize);
  
      // Initial Sizing
      this.setSize();
  
      // Start Loop
      this.animate();
    }
  
    handleMouseMove(e) {
      this.cursor.x = e.clientX;
      this.cursor.y = e.clientY;
    }
  
    handleTouchMove(e) {
      const t = e.touches[0];
      this.cursor.x = t.clientX;
      this.cursor.y = t.clientY;
    }
  
    setSize() {
      if (!this.container || !this.title) return;
      const { width: containerW, height: containerH } = this.container.getBoundingClientRect();
      const rect = this.container.getBoundingClientRect();
      
      // Initialize mouse pos to center of container if not moved yet
      if (this.mouse.x === 0 && this.mouse.y === 0) {
          this.mouse.x = rect.left + rect.width / 2;
          this.mouse.y = rect.top + rect.height / 2;
          this.cursor.x = this.mouse.x;
          this.cursor.y = this.mouse.y;
      }
  
      const chars = this.options.text.split("");
      let newFontSize = containerW / (chars.length / 2); // logic from original component
      newFontSize = Math.max(newFontSize, this.options.minFontSize);
  
      this.title.style.fontSize = `${newFontSize}px`;
      
      // Scaling logic
      if (this.options.scale) {
          const textRect = this.title.getBoundingClientRect();
          if (textRect.height > 0) {
              const yRatio = containerH / textRect.height;
              this.title.style.transform = `scale(1, ${yRatio})`;
              this.title.style.lineHeight = yRatio; // Sync line-height with scale
          }
      }
    }
  
    dist(a, b) {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    animate() {
      this.mouse.x += (this.cursor.x - this.mouse.x) / 15;
      this.mouse.y += (this.cursor.y - this.mouse.y) / 15;
  
      if (this.title) {
        const titleRect = this.title.getBoundingClientRect();
        const maxDist = titleRect.width / 2;
  
        this.spans.forEach(span => {
          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
          };
  
          const d = this.dist(this.mouse, charCenter);
  
          const getAttr = (distance, minVal, maxVal) => {
            const val = maxVal - Math.abs((maxVal * distance) / maxDist);
            return Math.max(minVal, val + minVal);
          };
  
          const wdth = this.options.width ? Math.floor(getAttr(d, 5, 200)) : 100;
          const wght = this.options.weight ? Math.floor(getAttr(d, 100, 900)) : 400;
          const italVal = this.options.italic ? getAttr(d, 0, 1).toFixed(2) : "0";
          const alphaVal = this.options.alpha ? getAttr(d, 0, 1).toFixed(2) : "1";
  
          span.style.opacity = alphaVal;
          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
        });
      }
  
      this.rafId = requestAnimationFrame(this.animate.bind(this));
    }
  
    destroy() {
       window.removeEventListener("mousemove", this.boundMouseMove);
       window.removeEventListener("touchmove", this.boundTouchMove);
       window.removeEventListener("resize", this.boundResize);
       if (this.rafId) cancelAnimationFrame(this.rafId);
    }
  }
