module.exports =  {
  root: true,
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      "jsx": true
    }
  },
  plugins: ['react', 'react-hooks', 'react-refresh', 'prettier'],
  settings: { react: { version: '18.2' } },
  rules: {
    'react/prop-types': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'prettier/prettier': 'error', // Add this line to enforce Prettier rules
    'react/no-unescaped-entities': ['off', {
      forbid: ['"', "'"]
    }],
  },
};
