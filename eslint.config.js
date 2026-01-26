import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        // Node.js globals
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        // Browser globals (for puppeteer evaluate)
        window: "readonly",
        document: "readonly",
      },
    },
    rules: {
      // Enforce curly braces for all control statements
      "curly": ["error", "all"],
      
      // Enforce consistent indentation (2 spaces)
      "indent": ["error", 2, { "SwitchCase": 1 }],
      
      // Related consistency rules
      "brace-style": ["error", "1tbs", { "allowSingleLine": false }],
      
      // Allow unused vars with underscore prefix (for intentionally unused)
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
    },
  },
  {
    // Ignore patterns
    ignores: [
      "node_modules/**",
      "pnpm-lock.yaml",
    ],
  },
];
