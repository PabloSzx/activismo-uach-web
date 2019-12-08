import gql, { DocumentNode } from "graphql-tag-ts";

export const GET_CHARTS: DocumentNode<{
  charts: { title: string; imageUrl: string; tags: string[] }[];
}> = gql`
  query {
    charts {
      title
      imageUrl
      tags
    }
  }
`;
