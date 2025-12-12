
const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images/props');
const files = ['plate.png', 'wine-glass.png', 'cutlery.png', 'napkin.png'];

async function processImage(file) {
    const filePath = path.join(imagesDir, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    try {
        const image = await Jimp.read(filePath);

        console.log(`Processing ${file}...`);

        // Scan every pixel
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];

            // Threshold for "White" (or near white)
            // If R, G, B > 230, make transparent
            if (red > 230 && green > 230 && blue > 230) {
                this.bitmap.data[idx + 3] = 0; // Set Alpha to 0
            }
        });

        await image.write(filePath);
        console.log(`Saved transparent version: ${file}`);
    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
}

async function main() {
    for (const file of files) {
        await processImage(file);
    }
}

main();
