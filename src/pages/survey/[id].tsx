import { NextPage } from "next";
import Router from "next/router";
import { ChangeEvent, useEffect } from "react";
import { useSetState } from "react-use";

import { useQuery } from "@apollo/react-hooks";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/core";

import { GET_FORM } from "../../graphql/queries";

const SurveyPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, loading } = useQuery(GET_FORM, {
    variables: {
      id,
    },
    skip: !id,
  });

  const [formState, setFormState] = useSetState<Record<string, string>>({});

  useEffect(() => {
    if (data?.form) {
      for (const { _id, alternatives } of data.form.questions) {
        if (alternatives && alternatives.length > 0) {
          setFormState({
            [_id]: alternatives[0],
          });
        } else {
          setFormState({
            [_id]: "",
          });
        }
      }
    } else if (!loading) {
      Router.replace("/surveys");
    }
  }, [data, loading]);

  if (data?.form) {
    return (
      <Stack>
        <Tag justifyContent="center">{data.form.name}</Tag>
        {data.form.questions.map(({ _id: questionId, text, alternatives }) => {
          return (
            <Box border="1px" p={2} m={2} key={questionId}>
              <FormControl key={questionId}>
                <FormLabel htmlFor={questionId}>{text}</FormLabel>
                {alternatives && alternatives.length > 0 ? (
                  <RadioGroup
                    value={formState[questionId] ?? ""}
                    onChange={({ target: { value } }) => {
                      setFormState({
                        [questionId]: value,
                      });
                    }}
                  >
                    {alternatives.map((alternative, key) => {
                      return (
                        <Radio border="gray" key={key} value={alternative}>
                          {alternative}
                        </Radio>
                      );
                    })}
                  </RadioGroup>
                ) : (
                  <Input
                    type="text"
                    id={questionId}
                    aria-describedby={text}
                    value={formState[questionId] ?? ""}
                    onChange={({
                      target: { value },
                    }: ChangeEvent<HTMLInputElement>) => {
                      setFormState({
                        [questionId]: value,
                      });
                    }}
                  />
                )}
              </FormControl>
            </Box>
          );
        })}
      </Stack>
    );
  }

  return null;
};

SurveyPage.getInitialProps = async ({ query, res }) => {
  const id = query.id;
  if (Array.isArray(id) || !id) {
    if (res) {
      res.writeHead(302, {
        Location: "/charts",
      });
      res.end();
    } else {
      Router.push("/charts");
    }
    return {
      id: "",
    };
  }
  return {
    id,
  };
};

export default SurveyPage;
