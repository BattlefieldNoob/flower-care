
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://red-tree.eu-central-1.aws.cloud.dgraph.io/graphql",
  documents: "./src/graphql/netlify/*.graphql",
  generates: {
    "./src/lib/generated/netlify-graphql.ts": {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request']
    },
  }
};

export default config;
