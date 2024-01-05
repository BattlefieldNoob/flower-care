
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://red-tree.eu-central-1.aws.cloud.dgraph.io/graphql",
  documents: "apps/flower-care-fe/src/graphql/*.graphql",
  generates: {
    "apps/flower-care-fe/src/app/generated/graphql.ts": {
      plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular']
    },
    "apps/flower-care-fe/graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
