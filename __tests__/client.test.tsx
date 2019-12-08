import React from "react";

import { MockedProvider } from "@apollo/react-testing";

import { GET_CHARTS } from "../src/graphql/queries";
import IndexPage from "../src/pages/charts";

describe("index", () => {
  test("should render", () => {
    expect(() => {
      return (
        <MockedProvider
          mocks={[
            {
              request: {
                query: GET_CHARTS,
              },
              result: {
                data: [],
              },
            },
          ]}
          addTypename={false}
        >
          <IndexPage />
        </MockedProvider>
      );
    });
  });
});
