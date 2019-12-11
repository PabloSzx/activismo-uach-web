import { NextPage } from "next";

const IndexPage: NextPage = () => {
  return null;
};

IndexPage.getInitialProps = async ({ res }) => {
  res?.writeHead(302, {
    Location: "/charts",
  });
  res?.end();
  return {};
};

export default IndexPage;
