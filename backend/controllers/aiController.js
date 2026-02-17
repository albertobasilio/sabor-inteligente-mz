const db = require('../config/database');
const aiService = require('../services/aiService');
const asyncHandler = require('../middleware/asyncHandler');
const sharp = require('sharp');

// Compress image to max 800px width, JPEG 60% quality (keeps it under Groq limit)
const compressImage = async (buffer) => {
    return sharp(buffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 60 })
        .toBuffer();
};

// Analyze image with AI
exports.analyzeImage = asyncHandler(async (req, res) => {
    if (!req.file && !req.body.image) {
        return res.status(400).json({ message: 'Forneça uma imagem.' });
    }

    let imageBase64;
    if (req.file) {
        const compressed = await compressImage(req.file.buffer);
        imageBase64 = compressed.toString('base64');
    } else {
        // Base64 from frontend — decode, compress, re-encode
        const raw = req.body.image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(raw, 'base64');
        const compressed = await compressImage(buffer);
        imageBase64 = compressed.toString('base64');
    }

    const result = await aiService.analyzeImage(imageBase64);

    // Match detected ingredients with database
    const matchedIngredients = [];
    for (const detected of result.ingredients) {
        const [rows] = await db.query(
            'SELECT * FROM ingredients WHERE name LIKE ? OR name_local LIKE ? LIMIT 1',
            [`%${detected.name}%`, `%${detected.name}%`]
        );
        matchedIngredients.push({
            ...detected,
            db_match: rows.length > 0 ? rows[0] : null
        });
    }

    res.json({
        detected: matchedIngredients,
        total_found: result.total_found || matchedIngredients.length
    });
});

// Generate recipes from ingredients
exports.generateRecipes = asyncHandler(async (req, res) => {
    const { ingredients, dietary_profile } = req.body;

    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ message: 'Forneça ingredientes.' });
    }

    const result = await aiService.generateRecipes(ingredients, dietary_profile || {});
    res.json(result);
});
