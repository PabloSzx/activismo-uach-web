import { format } from "date-fns";
import esLocale from "date-fns/locale/es";
import { NextPage } from "next";
import React from "react";
import LazyLoad from "react-lazyload";

import { useQuery } from "@apollo/react-hooks";
import { Badge, Flex, Image, Stack, Tag, Text } from "@chakra-ui/core";

import { GET_CHARTS } from "../../graphql/queries";

const IndexPage: NextPage = () => {
  const { data, loading, error } = useQuery(GET_CHARTS, {
    pollInterval: 10000,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || error) {
    return <>{error?.message ?? "No data available, please check later"}</>;
  }

  return (
    <Stack alignItems="center">
      {data.charts.map((chart, key) => {
        return (
          <Flex
            direction="column"
            borderWidth="2px"
            rounded="lg"
            key={key}
            border="1px"
            borderColor="gray.400"
            justifyContent="space-between"
            pt={0}
            boxShadow="2px 1px #A0AEC0"
            maxW="100%"
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              borderBottom="1px"
              borderBottomColor="gray.300"
              pl={6}
              pr={6}
              pt={3}
              pb={3}
            >
              <Tag variant="outline" pl={4} pr={4} rounded="md">
                <Text fontWeight="semibold" color="black">
                  {chart.title}
                </Text>
              </Tag>
              <Stack
                flexWrap="wrap"
                isInline
                justifyContent="space-between"
                key="stack"
              >
                {chart.tags.map((tag, key) => {
                  return (
                    <Badge
                      key={key}
                      rounded="lg"
                      variant="solid"
                      px="2"
                      backgroundColor="green.400"
                      m={1}
                    >
                      <Text color="white" fontWeight="semibold" key={key}>
                        {tag}
                      </Text>
                    </Badge>
                  );
                })}
              </Stack>
            </Flex>
            <LazyLoad height={300} once>
              <Image
                p={6}
                objectFit="contain"
                key={key}
                src={`/api${chart.imageUrl}`}
              />
            </LazyLoad>
            <Flex p={3}>
              <Text>
                {format(new Date(chart.updatedAt), "PPPPpppp", {
                  locale: esLocale,
                })}
              </Text>
            </Flex>
          </Flex>
        );
      })}
    </Stack>
  );
};

export default IndexPage;
