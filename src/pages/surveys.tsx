import { NextPage } from "next";
import Router from "next/router";

import { useQuery } from "@apollo/react-hooks";
import { Stack, Tag } from "@chakra-ui/core";

import { GET_ALL_FORMS } from "../graphql/queries";

const SurveysPage: NextPage = () => {
  const { data } = useQuery(GET_ALL_FORMS);

  return (
    <Stack>
      {(data?.forms ?? []).map(form => {
        return (
          <Tag
            key={form._id}
            cursor="pointer"
            justifyContent="center"
            onClick={() => {
              Router.push("/survey/[id]", `/survey/${form._id}`);
            }}
          >
            {form.name}
          </Tag>
        );
      })}
    </Stack>
  );
};

export default SurveysPage;
