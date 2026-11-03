/**
 * SUPABASE CLOUD STORAGE BATCH UPLOADER
 * 
 * Usage:
 *   node upload_to_supabase.js <SUPABASE_URL> <SUPABASE_KEY> [BUCKET_NAME]
 * 
 * Example:
 *   node upload_to_supabase.js https://xyzcompany.supabase.co eyJhbGciOi... portfolio
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const supabaseUrl = (args[0] || process.env.SUPABASE_URL || '').replace(/\/$/, '');
const supabaseKey = args[1] || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || '';
const bucketName = args[2] || process.env.SUPABASE_BUCKET || 'portfolio';

if (!supabaseUrl || !supabaseKey) {
  console.log(`
=============================================================
  ⚡ SUPABASE CLOUD STORAGE BATCH UPLOADER
=============================================================
  Please provide your Supabase Project URL and Key:
  
  Command:
    node upload_to_supabase.js <URL> <KEY> [BUCKET]
    
  Example:
    node upload_to_supabase.js https://kupcvxpbfclpysnvpycc.supabase.co eyJhbGciOi... portfolio
=============================================================
`);
  process.exit(1);
}

const MIME_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const imagesToUpload = [
  'Sahil.jpg',
  'sahil6.jpeg',
  'sahil14.jpeg',
  'sahil23.jpeg',
  'sahil33.jpeg',
  'sahil39.jpeg',
  'sahil22.jpeg',
  'mime2.jpeg',
  'weather-app.png'
];

async function uploadFile(fileName) {
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`[SKIP] File not found: ${fileName}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const contentType = MIME_MAP[ext] || 'application/octet-stream';
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${cleanName}`;
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${cleanName}`;

  try {
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': contentType,
        'x-upsert': 'true' // overwrite if exists
      },
      body: fileBuffer
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[FAIL] ${fileName}: ${res.status} - ${err}`);
      return null;
    }

    console.log(`[SUCCESS] ${fileName} -> ${publicUrl}`);
    return { fileName, publicUrl };
  } catch (err) {
    console.error(`[ERROR] ${fileName}:`, err.message);
    return null;
  }
}

async function run() {
  console.log(`Uploading images to Supabase Bucket "${bucketName}" at ${supabaseUrl} ...\n`);
  const uploaded = [];

  for (const img of imagesToUpload) {
    const result = await uploadFile(img);
    if (result) uploaded.push(result);
  }

  console.log('\n=============================================================');
  console.log(`✨ All ${uploaded.length} images successfully uploaded to Supabase!`);
  console.log('Public CDN URLs:');
  uploaded.forEach(u => console.log(`  - ${u.fileName}: ${u.publicUrl}`));
  console.log('=============================================================\n');
}

run();
