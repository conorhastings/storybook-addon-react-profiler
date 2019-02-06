module.exports = {
  presets: [
    [
      '@babel/preset-env', 
      { 
        shippedProposals: true, 
        useBuiltIns: 'usage'
      }
    ], '@babel/preset-react']
};