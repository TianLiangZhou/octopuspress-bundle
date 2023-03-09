

(async () => {
  const {sassPlugin} = require('esbuild-sass-plugin')
  const tailwindcss = require('tailwindcss')
  const autoprefixer = require('autoprefixer')
  const path = require('path')
  const esbuild = require('esbuild')
  const postcss = require('postcss')
  const fs = require('fs');
  const __dirname = path.resolve();

  const result = await esbuild.build({
    logLevel: 'info',
    entryPoints: [
      'assets/js/jquery.js',
      'assets/js/bootstrap.js',
      'assets/css/bootstrap.css',
      'assets/css/nebular/components.scss',
      'assets/css/nebular/default.scss',
      'assets/css/nebular/dark.scss',
      'assets/css/nebular/cosmic.scss',
      'assets/css/nebular/corporate.scss',
    ],
    bundle: true,
    outdir: 'web/assets',
    sourcemap: process.argv.includes('--dev'),
    watch: process.argv.includes('--dev'),
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
        type: "css",
        includePaths: [
          path.resolve(__dirname, "node_modules"),
        ],
      }),
    ],
  })

  if (process.argv.includes('--analyze')) {
    const text = await esbuild.analyzeMetafile(result.metafile)
    console.log(text);
  }
})().catch((e) => console.error(e) || process.exit(1));
