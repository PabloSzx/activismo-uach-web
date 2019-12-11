import gql, { DocumentNode } from "graphql-tag-ts";

export const GET_CHARTS: DocumentNode<{
  charts: {
    title: string;
    imageUrl: string;
    tags: string[];
    updatedAt: Date;
  }[];
}> = gql`
  query {
    charts {
      title
      imageUrl
      tags
      updatedAt
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
    oldTitle?: string;
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

export const GET_ALL_FORMS: DocumentNode<{
  forms: { _id: string; name: string }[];
}> = gql`
  query {
    forms {
      _id
      name
    }
  }
`;

export const GET_FORM: DocumentNode<
  {
    form?: {
      _id: string;
      name: string;
      questions: { _id: string; text: string; alternatives?: string[] }[];
    };
  },
  {
    id: string;
  }
> = gql`
  query($id: ObjectId!) {
    form(id: $id) {
      _id
      name
      questions {
        _id
        text
        alternatives
      }
    }
  }
`;
