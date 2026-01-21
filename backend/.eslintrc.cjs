/**
 * ESLint Configuration
 * Cấu hình ESLint cho dự án Node.js với ES Modules
 */

module.exports = {
  env: {
    node: true,
    es2022: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    // ============================================
    // ERROR PREVENTION
    // ============================================
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-undef': 'error',
    
    // ============================================
    // BEST PRACTICES
    // ============================================
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-return-await': 'error',
    'require-await': 'error',
    'no-throw-literal': 'error',
    
    // ============================================
    // STYLING
    // ============================================
    'indent': ['error', 2, { SwitchCase: 1 }],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    
    // ============================================
    // ES6+
    // ============================================
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'prefer-destructuring': ['warn', {
      array: false,
      object: true
    }],
    
    // ============================================
    // NODE.JS SPECIFIC
    // ============================================
    'no-process-exit': 'warn',
    'no-path-concat': 'error',
    
    // ============================================
    // IMPORT/EXPORT
    // ============================================
    'no-duplicate-imports': 'error'
  },
  overrides: [
    {
      // Test files
      files: ['**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true
      },
      rules: {
        'no-console': 'off'
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.min.js',
    'coverage/'
  ]
};

