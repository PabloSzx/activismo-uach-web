import { map } from "lodash";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Router from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { useSetState } from "react-use";

import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/core";

import { ANSWER_FORM, GET_FORM } from "../../graphql/queries";

const MapNoSSR = dynamic(() => import("../../components/Map"), { ssr: false });

const SurveyPage: NextPage<{ id: string }> = ({ id }) => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const { data: dataGetForm, loading: loadingGetForm } = useQuery(GET_FORM, {
    variables: {
      id,
    },
    skip: !id,
  });

  const [formState, setFormState] = useSetState<Record<string, string>>({});

  const [
    answerForm,
    { loading: loadingAnswerForm, data: dataAnswerForm },
  ] = useMutation(ANSWER_FORM);
  useEffect(() => {
    if (dataGetForm?.form) {
      for (const { _id, alternatives } of dataGetForm.form.questions) {
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
    } else if (!loadingGetForm) {
      Router.replace("/surveys");
    }
  }, [dataGetForm, loadingGetForm]);

  if (dataAnswerForm?.answerForm._id) {
    Router.prefetch("/surveys");
    setTimeout(() => {
      Router.push("/surveys");
    }, 2000);
    return (
      <Stack>
        <Text>Muchas gracias por su respuesta!</Text>
        <Text>Sera redireccionado en unos instantes...</Text>
      </Stack>
    );
  }

  if (dataGetForm?.form?._id) {
    return (
      <Stack>
        <Heading
          className="survey_title"
          justifyContent="center"
          fontSize="2em"
          p="5px"
          textAlign="center"
        >
          {dataGetForm.form.name}
        </Heading>
        {map(
          dataGetForm.form.questions,
          ({ _id: questionId, text, alternatives }) => {
            return (
              <Box
                className="survey_box"
                border="1px"
                p={2}
                m={2}
                key={questionId}
              >
                <FormControl key={questionId}>
                  <FormLabel className="survey_box_text" htmlFor={questionId}>
                    {text}
                  </FormLabel>
                  {alternatives && alternatives.length > 0 ? (
                    <RadioGroup
                      value={formState[questionId] ?? ""}
                      onChange={({ target: { value } }) => {
                        setFormState({
                          [questionId]: value,
                        });
                      }}
                    >
                      {map(alternatives, (alternative, key) => {
                        return (
                          <Radio border="gray" key={key} value={alternative}>
                            {alternative}
                          </Radio>
                        );
                      })}
                    </RadioGroup>
                  ) : (
                    <Input
                      className="survey_box_text_field"
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
          }
        )}
        <Stack align="center" justify="center" mt={4}>
          <Heading textAlign="center">
            Marca el sector aproximado donde vives
          </Heading>
          <MapNoSSR setLatitude={setLatitude} setLongitude={setLongitude} />
        </Stack>
        <Button
          mt={6}
          className="survey_answer_button"
          isLoading={loadingAnswerForm}
          onClick={() => {
            answerForm({
              variables: {
                data: {
                  form: id,
                  latitude,
                  longitude,
                  answers: map(formState, (answer, question) => {
                    return {
                      question,
                      answer,
                    };
                  }),
                },
              },
            });
          }}
        >
          Enviar Respuesta
        </Button>
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
      Router.replace("/charts");
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
