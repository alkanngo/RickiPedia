import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "schema.graphql",
  documents: ["src/**/*.{ts,tsx}", "!**/__tests__/**/*", "!**/*.test.{ts,tsx}"],
  overwrite: true,
  generates: {
    "src/generated/graphql.ts": {
      plugins: [
        {
          typescript: {
            noExport: false,
          },
        },
        "typescript-operations"
      ],
    },
  },
};

export default config;
