
const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images/props');
const fallingFoodDir = path.join(__dirname, '../public/images/falling-food');

// Combine lists
const files = [
    { dir: imagesDir, name: 'plate.png' },
    { dir: imagesDir, name: 'wine-glass.png' },
    { dir: imagesDir, name: 'cutlery.png' },
    { dir: imagesDir, name: 'napkin.png' },
    { dir: fallingFoodDir, name: 'cannoli.png' },
    { dir: fallingFoodDir, name: 'tiramisu.png' },
    { dir: fallingFoodDir, name: 'meatball.png' }
];

async function processImage(item) {
    const filePath = path.join(item.dir, item.name);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    try {
        const image = await Jimp.read(filePath);

        console.log(`Processing ${item.name}...`);

        // Scan every pixel
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];

            // Threshold for "White"
            if (red > 240 && green > 240 && blue > 240) {
                this.bitmap.data[idx + 3] = 0; // Set Alpha to 0
            }
        });

        // Try standard write with callback just in case
        image.write(filePath, (err) => {
            if (err) console.error("Error writing:", err);
            else console.log(`Saved transparent: ${item.name}`);
        });

    } catch (err) {
        console.error(`Error processing ${item.name}:`, err);
    }
}

async function main() {
    for (const item of files) {
        await processImage(item);
    }
}

main();
