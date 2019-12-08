export const GRAPHQL_URL =
  typeof window === "undefined"
    ? `${process?.env?.DOMAIN ?? "http://localhost:3000"}/api/graphql`
    : "/api/graphql";
