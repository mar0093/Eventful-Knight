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
            villager: '👨'
        };
    }

    setupEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generateCard());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadCard());
        document.getElementById('rankSelect').addEventListener('change', () => this.generateCard());
        document.getElementById('suitSelect').addEventListener('change', () => this.generateCard());
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
            villager: '#000000' // black
        };
        return suitColors[suit] || '#000000';
    }

    generateCard() {
        const rank = document.getElementById('rankSelect').value;
        const suit = document.getElementById('suitSelect').value;
        const colors = this.getColorScheme();
        const suitColor = this.getSuitColor(suit);
        const suitSymbol = this.suits[suit];

        // Clear canvas
        this.ctx.fillStyle = colors.background;
        this.ctx.fillRect(0, 0, this.cardWidth, this.cardHeight);

        // Draw border
        this.ctx.strokeStyle = suitColor;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(5, 5, this.cardWidth - 10, this.cardHeight - 10);

        // Draw rounded corners decoration
        this.drawCornerDecorations(suitColor, suitSymbol, colors);

        // Draw center content
        this.drawCenterContent(rank, suitSymbol, suitColor, colors);
    }

    drawCornerDecorations(suitColor, suitSymbol, colors) {
        const padding = 15;
        const cornerSize = 60;

        // Top-left corner
        this.drawCorner(padding, padding, suitSymbol, 0, suitColor, colors);

        // Top-right corner (flipped)
        this.ctx.save();
        this.ctx.translate(this.cardWidth, 0);
        this.ctx.scale(-1, 1);
        this.drawCorner(padding, padding, suitSymbol, 0, suitColor, colors);
        this.ctx.restore();

        // Bottom-left corner (flipped)
        this.ctx.save();
        this.ctx.translate(0, this.cardHeight);
        this.ctx.scale(1, -1);
        this.drawCorner(padding, padding, suitSymbol, 0, suitColor, colors);
        this.ctx.restore();

        // Bottom-right corner (flipped)
        this.ctx.save();
        this.ctx.translate(this.cardWidth, this.cardHeight);
        this.ctx.scale(-1, -1);
        this.drawCorner(padding, padding, suitSymbol, 0, suitColor, colors);
        this.ctx.restore();
    }

    drawCorner(x, y, suitSymbol, rotation, suitColor, colors) {
        // Draw the rank and suit in corners
        this.ctx.fillStyle = suitColor;
        this.ctx.font = 'bold 32px Arial, sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(document.getElementById('rankSelect').value, x, y);

        // Draw suit symbol below rank
        this.ctx.font = 'bold 24px Arial, sans-serif';
        this.ctx.fillText(suitSymbol, x, y + 28);
    }

    drawCenterContent(rank, suitSymbol, suitColor, colors) {
        const centerX = this.cardWidth / 2;
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

            // Draw rank in center
            this.ctx.font = 'bold 80px Arial, sans-serif';
            this.ctx.fillStyle = suitColor;
            this.ctx.fillText(rank, centerX, centerY);

            // Draw suit symbol below rank
            this.ctx.font = 'bold 40px Arial, sans-serif';
            this.ctx.fillText(suitSymbol, centerX, centerY + 60);

            // Draw decorative line
            this.ctx.strokeStyle = suitColor;
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

    downloadCard() {
        const rank = document.getElementById('rankSelect').value;
        const suit = document.getElementById('suitSelect').value;
        const filename = `playing-card-${rank}-${suit}.png`;

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
