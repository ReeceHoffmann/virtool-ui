const react = require("eslint-plugin-react");
const typescript = require("typescript-eslint");
const reactHooks = require("eslint-plugin-react-hooks");
const vitest = require("eslint-plugin-vitest");
const

console.log("typescript", typescript.configs.recommended);
module.exports = [
    "eslint:recommended",
    ...typescript.configs.recommended,
    {
        files: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"],
        plugins: {
            react,
            reactHooks,
            vitest,
        },
        rules: {
            curly: ["warn", "all"],
            // "func-style": ["warn", "declaration", { allowArrowFunctions: false }],
            "no-else-return": "warn",
            "no-prototype-builtins": "warn",
            "prefer-arrow-callback": "warn",
            "prefer-const": "warn",
            "@typescript-eslint/no-empty-function": "warn",
            "react/display-name": "warn",
            "react/no-unescaped-entities": "warn",
            "react/react-in-jsx-scope": "warn",
        },

        languageOptions: {
            globals: {
                console: true,
                dispatcher: true,
                document: true,
                fetch: true,
                global: true,
                process: true,
                window: true,
            },
        },
    },
    {
        files: ["**/*.stories.jsx", "**/*.stories.tsx"],
        rules: {
            "typescript/no-empty-function": "off",
        },
    },
    // Only warn about missing props validation.
    // TODO: Remove this rule once all components are in TS.
    {
        files: ["**/*.jsx", "**/*.tsx"],
        rules: {
            "react/prop-types": "off",
        },
    },
    // We want to change built-ins in some tests.
    {
        files: ["**/*.test.tsx", "**/*.test.ts", "**/*.test.js", "**/*.test.jsx"],
        rules: {
            "no-global-assign": "off",
        },
    },
    // Webpack nonce is defined in the HTML template.
    {
        files: ["**/nonce.js"],
        rules: {
            "no-undef": "off",
        },
    },
];
