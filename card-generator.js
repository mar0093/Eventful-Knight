class CardGenerator {
    constructor() {
        this.canvas = document.getElementById('cardCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cardWidth = 400;
        this.cardHeight = 600;
        this.setupEventListeners();
        this.colorSchemes = {
            classic: {
                red: '#C41E3A',
                black: '#000000',
                background: '#FFFFFF',
                cornerBg: '#F5F5F5',
                textColor: '#000000'
            },
            dark: {
                red: '#DC143C',
                black: '#1a1a1a',
                background: '#2d2d2d',
                cornerBg: '#404040',
                textColor: '#FFFFFF'
            },
            gold: {
                red: '#FF6B35',
                black: '#1B1B1B',
                background: '#FFF8DC',
                cornerBg: '#FFE5B4',
                textColor: '#1B1B1B'
            }
        };
        this.suits = {
            dragon: '🐉',
            knight: '⚔️',
            fairy: '🧚',
            mage: '🧙',
            villager: '👨',
            castle: '🏰'
        };
    }

    setupEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generateCard());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadCard());
        document.getElementById('rankSelect').addEventListener('change', () => this.generateCard());
        document.getElementById('suitSelect').addEventListener('change', () => this.generateCard());
        document.getElementById('borderColor').addEventListener('change', () => this.generateCard());

        // square colour selectors
        ['squareColor1','squareColor2','squareColor3','squareColor4'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.addEventListener('change', () => this.generateCard());
        });
    }

    getColorScheme() {
        return this.colorSchemes.classic;
    }

    getSuitColor(suit) {
        const suitColors = {
            dragon: '#FFD700',  // gold
            knight: '#0066CC',  // blue
            mage: '#CC0000',    // red
            fairy: '#00CC66',   // green
            villager: '#000000', // black
            castle: '#808080'   // grey
        };
        return suitColors[suit] || '#000000';
    }

    generateCard() {
        const rank = document.getElementById('rankSelect').value;
        const suit = document.getElementById('suitSelect').value;
        const colors = this.getColorScheme();
        const suitColor = this.getSuitColor(suit);
        const suitSymbol = this.suits[suit];
        const squareColors = this.getSquareColorArray();
        const borderColorEl = document.getElementById('borderColor');
        const borderColor = borderColorEl ? borderColorEl.value : suitColor;

        // Clear canvas
        this.ctx.fillStyle = colors.background;
        this.ctx.fillRect(0, 0, this.cardWidth, this.cardHeight);

        // Draw border
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(5, 5, this.cardWidth - 10, this.cardHeight - 10);

        // Draw rounded corners decoration (background squares use borderColor)
        this.drawCornerDecorations(suitColor, suitSymbol, colors, squareColors, borderColor);

        // Draw center content
        this.drawCenterContent(rank, suitSymbol, suitColor, colors, squareColors);
    }

    drawCornerDecorations(suitColor, suitSymbol, colors, squareColors, borderColor) {
        const padding = 15;
        const cornerSize = 60;

        // Top-left corner (no background square)
        this.drawCorner(padding, padding, suitSymbol, 0, suitColor, colors, squareColors);

        // Top-right corner (flipped)
        this.ctx.save();
        this.ctx.translate(this.cardWidth, 0);
        this.ctx.scale(-1, 1);
        this.ctx.fillStyle = borderColor;
        this.ctx.fillRect(-padding- cornerSize +5, padding-5, cornerSize, cornerSize);
        this.drawCorner(padding, padding, suitSymbol, 0, suitColor, colors, squareColors);
        this.ctx.restore();

        // Bottom-left corner (flipped)
        this.ctx.save();
        this.ctx.translate(0, this.cardHeight);
        this.ctx.scale(1, -1);
        this.ctx.fillStyle = borderColor;
        this.ctx.fillRect(padding-5, -padding- cornerSize +5, cornerSize, cornerSize);
        this.drawCorner(padding, padding, suitSymbol, 0, suitColor, colors, squareColors);
        this.ctx.restore();

        // Bottom-right corner (flipped)
        this.ctx.save();
        this.ctx.translate(this.cardWidth, this.cardHeight);
        this.ctx.scale(-1, -1);
        this.ctx.fillStyle = borderColor;
        this.ctx.fillRect(-padding- cornerSize +5, -padding- cornerSize +5, cornerSize, cornerSize);
        this.drawCorner(padding, padding, suitSymbol, 0, suitColor, colors, squareColors);
        this.ctx.restore();
    }

    drawCorner(x, y, suitSymbol, rotation, suitColor, colors, squareColors) {
        const rankText = document.getElementById('rankSelect').value;
        this.ctx.font = 'bold 32px Arial, sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';

        if (squareColors && rankText.includes('■')) {
            // draw each square separately with custom colours
            let offsetX = x;
            for (let i = 0; i < rankText.length; i++) {
                const ch = rankText[i];
                const colorForChar = squareColors[i] || suitColor;
                this.ctx.fillStyle = colorForChar;
                this.ctx.fillText(ch, offsetX, y);
                offsetX += this.ctx.measureText(ch).width;
            }
        } else {
            this.ctx.fillStyle = suitColor;
            this.ctx.fillText(rankText, x, y);
        }

        // Draw suit symbol below rank
        this.ctx.font = 'bold 24px Arial, sans-serif';
        this.ctx.fillStyle = suitColor;
        this.ctx.fillText(suitSymbol, x, y + 28);
    }

    drawCenterContent(rank, suitSymbol, suitColor, colors, squareColors) {
        const centerX = this.cardWidth / 2; // slight offset to the right for better visual balance
        const centerY = this.cardHeight / 2;

        if (rank && rank.trim() !== '') {
            // Draw large suit symbols in center (background)
            this.ctx.fillStyle = suitColor;
            this.ctx.font = 'bold 120px Arial, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.globalAlpha = 0.15;
            this.ctx.fillText(suitSymbol, centerX, centerY - 30);
            this.ctx.globalAlpha = 1;

            // Draw rank in center with optional custom square colours
            this.ctx.font = 'bold 80px Arial, sans-serif';
            if (squareColors && rank.includes('■')) {
                // special case: four squares should be arranged 2x2 centered
                if (rank === '■■■■') {
                    const cellW = this.ctx.measureText('■').width;
                    const spacing = 10; // extra space between squares and on sides
                    const totalWidth = cellW * 2 + spacing;
                    const startX = centerX - totalWidth / 2;
                    const startY = centerY - cellW - spacing/2;
                    for (let i = 0; i < 4; i++) {
                        const row = Math.floor(i / 2);
                        const col = i % 2;
                        const colorForChar = squareColors[i] || suitColor;
                        this.ctx.fillStyle = colorForChar;
                        this.ctx.fillText('■', startX + col * (cellW + spacing/2)+cellW/2, startY + row * (cellW + spacing/2));
                    }
                } else if (rank === '■■') {
                    const cellW = this.ctx.measureText('■').width;
                    const spacing = 10; // extra space between squares and on sides
                    const totalWidth =  cellW * 2 + spacing;
                    const startX = centerX - totalWidth / 2;
                    const startY = centerY - spacing/2;
                    for (let i = 0; i < 2; i++) {
                        const row = 0
                        const col = i % 2;
                        const colorForChar = squareColors[i] || suitColor;
                        this.ctx.fillStyle = colorForChar;
                        this.ctx.fillText('■', startX + col * (cellW + spacing/2)+cellW/2, startY + row * (cellW + spacing/2));
                    }
                } else if (rank === '■') {
                    const cellW = this.ctx.measureText('■').width;
                    const spacing = 10; // extra space between squares and on sides
                    const totalWidth =  cellW * 2 + spacing;
                    const startX = centerX - totalWidth / 2;
                    const startY = centerY - cellW - spacing/2;
                    for (let i = 0; i < 4; i++) {
                        const row = 1
                        const col = 1;
                        const colorForChar = squareColors[i] || suitColor;
                        this.ctx.fillStyle = colorForChar;
                        this.ctx.fillText('■', startX + col * (cellW + spacing/2), startY + row * (cellW + spacing/2));
                    }
                } else {
                    // fallback: draw inline with fixed char width for consistency
                    const charWidth = this.ctx.measureText('★').width; // use star width as standard
                    const totalWidth = charWidth * rank.length;
                    let offsetX = centerX - totalWidth / 2;
                    for (let i = 0; i < rank.length; i++) {
                        const ch = rank[i];
                        const colorForChar = squareColors[i] || suitColor;
                        this.ctx.fillStyle = colorForChar;
                        this.ctx.fillText(ch, offsetX, centerY);
                        offsetX += charWidth;
                    }
                }
            } else {
                this.ctx.fillStyle = suitColor;
                this.ctx.fillText(rank, centerX, centerY);
            }

            // Draw suit symbol below rank
            this.ctx.font = 'bold 40px Arial, sans-serif';
            this.ctx.fillStyle = suitColor;
            this.ctx.fillText(suitSymbol, centerX , centerY + 60);

            // Draw decorative line
            this.ctx.strokeStyle = borderColor;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 60, centerY + 120);
            this.ctx.lineTo(centerX + 60, centerY + 120);
            this.ctx.stroke();
        } else {
            // For blank cards, just draw a large centered suit symbol
            this.ctx.fillStyle = suitColor;
            this.ctx.font = 'bold 150px Arial, sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(suitSymbol, centerX, centerY);
        }
    }

    getSquareColorArray() {
        // return an array of four colours from the generic selectors
        const arr = [];
        for (let i = 1; i <= 4; i++) {
            const el = document.getElementById(`squareColor${i}`);
            if (el) arr.push(el.value);
        }
        return arr.length ? arr : null;
    }

    downloadCard() {
        const rank = document.getElementById('rankSelect').value;
        const suit = document.getElementById('suitSelect').value;
        const color1 = document.getElementById('squareColor1').value || 'none';
        const color2 = document.getElementById('squareColor2').value || 'none';
        const color3 = document.getElementById('squareColor3').value || 'none';
        const color4 = document.getElementById('squareColor4').value || 'none';
        const filename = `playing-card-${rank}-${suit}-${color1}-${color2}-${color3}-${color4}.png`;

        this.canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }
}

// Initialize the card generator when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const generator = new CardGenerator();
    generator.generateCard(); // Generate initial card
});
