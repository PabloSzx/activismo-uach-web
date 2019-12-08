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

export const UPLOAD_CHART: DocumentNode<
  {
    uploadChart: { imageUrl: string; title: string };
  },
  {
    file: File;
    data: { title: string; tags?: string[] };
  }
> = gql`
  mutation($file: Upload!, $data: ChartUpload!, $oldTitle: String) {
    uploadChart(file: $file, data: $data, oldTitle: $oldTitle) {
      title
      imageUrl
    }
  }
`;

export const GET_TAGS: DocumentNode<{
  tags: string[];
}> = gql`
  query {
    tags
  }
`;
