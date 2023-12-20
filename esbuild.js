(async () => {
  const {sassPlugin} = require('esbuild-sass-plugin');
  const {copy} = require("esbuild-plugin-copy");
  const tailwindcss = require('tailwindcss');
  const postcssImport = require('postcss-import');
  const postcssNest = require('postcss-nested');
  const autoprefixer = require('autoprefixer');
  const path = require('path');
  const esbuild = require('esbuild');
  const postcss = require('postcss');
  const fs = require('fs');
  const __dirname = path.resolve();

  const options = {
    logLevel: 'info',
    entryPoints: [
      'assets/js/alpinejs.js',
      'assets/js/jquery.js',
      'assets/js/bootstrap.js',
      'assets/js/bootstrap-4.js',
      'assets/js/base.js',
      // 'assets/css/base.css',
      'assets/css/bootstrap.css',
      'assets/css/bootstrap-4.css',
      'assets/css/nebular/components.scss',
      'assets/css/nebular/default.scss',
      'assets/css/nebular/dark.scss',
      'assets/css/nebular/cosmic.scss',
      'assets/css/nebular/corporate.scss',
    ],
    bundle: true,
    outdir: './public',
    write: true,
    allowOverwrite: true,
    sourcemap: process.argv.includes('--dev'),
    minify: !process.argv.includes('--dev'),
    metafile: process.argv.includes('--analyze'),
    loader: {
      '.gif': 'file',
      '.eot': 'file',
      '.ttf': 'file',
      '.svg': 'file',
      '.woff': 'file',
      '.woff2': 'file',
    },
    target: ['chrome58', 'firefox57', 'safari11', 'edge95'],
    plugins: [
      sassPlugin({
        async transform(source) {
          const { css } = await postcss([postcssNest,tailwindcss, autoprefixer]).process(source, {
            from: undefined,
          });
          return css;
        },
      }),
      copy({
        resolveFrom: 'out',
        assets:[
          {
            from: ['./assets/images/*'],
            to: ['images'],
          },
          {
            from: ['./assets/fonts/*'],
            to: ['fonts'],
          }
        ],
      })
    ],
  };


  let ctx = null;
  if (process.argv.includes("--watch")) {
    ctx = await esbuild.context(options)
  } else {
    ctx = await esbuild.build(options)
  }
  if (process.argv.includes('--analyze')) {
    const text = await esbuild.analyzeMetafile(ctx.metafile)
    console.log(text);
  }
  if (process.argv.includes('--watch')) {
    await ctx.watch();
    let {port, host} = await ctx.serve({

    });
  }
})().catch((e) => console.error(e) || process.exit(1));
