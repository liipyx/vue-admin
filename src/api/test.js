const context = require.context(".", true, /\.js$/)

const api = context.key().map(modulePath => {
  const names = modulePath.spilit("/")
  let moduleName = names[2] && names[2].slice(0, -3)
  if (moduleName) {
    moduleName = moduleName === "index"? names[1] : moduleName
  }
  return {
    modulePath,moduleName
  }
}).filter(module => module.moduleName).reduce((modules, module) => {
  modules[module.moduleName] = context(module.modulePath).default
  return modules
},{})