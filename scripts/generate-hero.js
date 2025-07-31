/**
 * 一次性运行脚本：
 * 只需在添加/更换英雄图时运行一次。
 * 每次修改原始图片后需要重新运行。
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 在脚本开头添加，提高处理速度
sharp.concurrency(1); // 避免内存溢出
sharp.cache(false); // 关闭缓存

// 配置参数
// 原始图片路径
const SOURCE_IMAGE = path.join(process.cwd(), 'scripts/images/hero-original.jpg');
// 图片标识名
const IMAGE_NAME = 'main-hero';
// 输出目录
const OUTPUT_DIR = path.join(process.cwd(), 'src/assets/heroes');
const DATA_DIR = path.join(process.cwd(), 'src/data');
// LQIP 数据文件路径
const DATA_FILE = path.join(process.cwd(), 'src/data/heroes.js');

// 需要生成的尺寸
const WIDTHS = [3840, 2560, 1920, 1280, 1000, 800, 400];

// 创建输出目录
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`创建目录: ${OUTPUT_DIR}`);
}
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`创建目录: ${DATA_DIR}`);
}

/**
 * 生成响应式图片
 * 根据配置的尺寸和格式生成多种分辨率的图片。
 */
async function generateResponsiveImages() {
  // 获取图片元数据
  const metadata = await sharp(SOURCE_IMAGE).metadata();
  // 获取文件的状态信息
  const stats = fs.statSync(SOURCE_IMAGE);
  console.log(
    `原始图片尺寸: ${metadata.width}x${metadata.height} (${(stats.size / 1024 / 1024).toFixed(1)}MB)`
  );

  const aspectRatio = metadata.height / metadata.width;

  const formats = [
    { type: 'webp', options: { quality: 75 } },
    { type: 'jpeg', options: { quality: 80, mozjpeg: true } }
  ];

  // 并行处理所有尺寸和格式
  await Promise.all(
    WIDTHS.flatMap((width) =>
      formats.map(async (format) => {
        const height = Math.round(width * aspectRatio); // 根据宽高比计算高度
        const outputFile = path.join(OUTPUT_DIR, `hero-${IMAGE_NAME}-${width}w.${format.type}`);

        await sharp(SOURCE_IMAGE)
          .resize(width, height)
          [format.type](format.options)
          .toFile(outputFile);

        const stats = fs.statSync(outputFile);
        console.log(
          `生成: ${path.relative(process.cwd(), outputFile)} (${(stats.size / 1024).toFixed(1)}KB)`
        );
      })
    )
  );
}

/**
 * 生成低质量图片占位符 (LQIP)
 * 生成一个低分辨率的 Base64 图片，用于图片加载前的占位。
 */
async function generateLqip() {
  const lqipBuffer = await sharp(SOURCE_IMAGE)
    .resize(20) // 宽度 20px
    .jpeg({
      quality: 15,
      chromaSubsampling: '4:4:4' // 避免色度失真
    })
    .toBuffer();

  const lqipBase64 = lqipBuffer.toString('base64');

  // 生成完整的ES模块文件
  const dataContent = `export const ${IMAGE_NAME.replace(/-/g, '_')} = {
  base64: '${lqipBase64}',
  aspectRatio: ${(await sharp(SOURCE_IMAGE).metadata()).height / (await sharp(SOURCE_IMAGE).metadata()).width}
};\n`;

  fs.writeFileSync(DATA_FILE, dataContent);
  console.log(`自动生成的 LQIP 数据 - 更新时间: ${new Date().toISOString()}`);
  console.log(
    `LQIP生成成功: ${path.relative(process.cwd(), DATA_FILE)} (${lqipBuffer.length}字节)`
  );
}

/**
 * 主执行函数
 * 协调图片生成和 LQIP 生成流程。
 */
async function main() {
  console.log('🚀 开始处理英雄图...');
  console.log(`源文件: ${path.relative(process.cwd(), SOURCE_IMAGE)}`);

  try {
    await generateResponsiveImages();
    await generateLqip();
    console.log('✅ 所有图片处理完成！');
  } catch (err) {
    console.error('❌ 处理失败:', err);
    process.exit(1);
  }
}

// 执行脚本
main();
