import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

/**
 * 加载环境变量
 */
function loadEnvironmentVariables() {
  // 可能的 .env 文件路径
  const envFiles = [join(process.cwd(), '.env'), join(process.cwd(), '.env.local')];

  // 按顺序加载所有环境变量文件
  for (const envFile of envFiles) {
    if (existsSync(envFile)) {
      // 加载环境变量文件: ${envFile}
      const envConfig = dotenv.parse(readFileSync(envFile));
      dotenvExpand.expand({ parsed: envConfig });
      // 将变量合并到 process.env
      Object.assign(process.env, envConfig);
    }
  }
}

/**
 * 运行 ESLint 检查
 */
function runESLint(): boolean {
  try {
    console.log('开始 ESLint 检查...');

    // 获取当前工作目录
    const cwd = process.cwd();
    // 检查是否有 ESLint 配置文件
    const eslintConfigFiles = [
      'eslint.config.ts',
      'eslint.config.js',
      '.eslintrc.js',
      '.eslintrc.cjs',
      '.eslintrc.yaml',
      '.eslintrc.yml',
      '.eslintrc.json'
    ];

    const hasEslintConfig = eslintConfigFiles.some((file) => existsSync(join(cwd, file)));

    if (!hasEslintConfig) {
      console.warn('⚠️  未找到 ESLint 配置文件，跳过检查');
      return true;
    }

    // 执行 ESLint 命令
    execSync(
      'npx eslint --ext .js,.jsx,.ts,.tsx,.astro --fix-dry-run --cache --cache-location .eslintcache',
      { stdio: 'inherit' }
    );

    console.log('[Success]: ESLint 检查通过');
    return true;
  } catch (error) {
    console.error('[Failed]: ESLint 检查失败');
    return false;
  }
}

/**
 * 主函数
 */
function main() {
  // 加载环境变量文件
  loadEnvironmentVariables();

  // 检查是否设置了跳过环境变量
  const skipEslint = process.env.SKIP_ESLINT;

  if (skipEslint && ['1', 'true', 'yes'].includes(skipEslint.toLowerCase())) {
    console.log('[SKIP]: 跳过 ESLint 检查 (SKIP_ESLINT 环境变量已设置)');
    process.exit(0);
  }

  // 检查是否在 commit 消息中指定跳过
  if (process.argv.includes('--skip-eslint')) {
    console.log('[SKIP]: 跳过 ESLint 检查 (检测到 --skip-eslint 标志)');
    process.exit(0);
  }

  // 运行 ESLint 检查
  const success = runESLint();
  process.exit(success ? 0 : 1);
}

// 执行主函数
main();
