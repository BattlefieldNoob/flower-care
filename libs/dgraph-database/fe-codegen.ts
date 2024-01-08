
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://red-tree.eu-central-1.aws.cloud.dgraph.io/graphql",
  documents: "./src/graphql/fe/*.graphql",
  generates: {
    "./src/lib/generated/fe-graphql.ts": {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular']
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
