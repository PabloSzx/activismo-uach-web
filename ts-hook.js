require("ts-node").register({
  transpileOnly: true,
  typeCheck: false,
  compilerOptions: {
    target: "es5",
    module: "commonjs",
    allowJs: true,
    removeComments: true,
    noEmit: true,
    isolatedModules: false,
    skipLibCheck: true,
    strict: false,
    esModuleInterop: true,
  },
});
