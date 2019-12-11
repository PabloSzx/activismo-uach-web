import { Formik } from "formik";
import {
  compact,
  differenceWith,
  forEach,
  isEqual,
  map,
  range,
  size,
} from "lodash";
import { ChangeEvent, useEffect, useState } from "react";
import { useSetState, useUpdateEffect } from "react-use";
import { Dropdown } from "semantic-ui-react";
import { useRememberState } from "use-remember-state";
import { $NonMaybeType, $PropertyType } from "utility-types";

import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/core";

import {
  GET_FORMS,
  GET_QUESTIONS,
  UPSERT_FORM,
  UPSERT_QUESTION,
} from "../../graphql/queries";

export default () => {
  const { data: allQuestions, refetch: refetchGetQuestions } = useQuery(
    GET_QUESTIONS
  );
  const { data: allForms, refetch: refetchGetForms } = useQuery(GET_FORMS);

  const [authorization, setAuthorization] = useRememberState<string>(
    "authorization-upload-survey",
    ""
  );

  const [newFormState, setNewFormState] = useSetState<{
    name: string;
    questions: string[];
  }>({
    name: "New Survey",
    questions: [],
  });

  useUpdateEffect(() => {
    const compactQuestions = compact(newFormState.questions);
    if (!isEqual(compactQuestions, newFormState.questions)) {
      setNewFormState({
        questions: compactQuestions,
      });
    }
  }, [newFormState.questions, setNewFormState]);

  const [
    upsertForm,
    { error: errorUpsertForm, loading: loadingUpsertForm },
  ] = useMutation(UPSERT_FORM, {
    context: {
      headers: {
        authorization,
      },
    },
  });

  const [
    upsertQuestion,
    { error: errorUpsertQuestion, loading: loadingUpsertQuestion },
  ] = useMutation(UPSERT_QUESTION, {
    context: {
      headers: {
        authorization,
      },
    },
  });

  useEffect(() => {
    if (errorUpsertForm || errorUpsertQuestion) {
      console.log(
        JSON.stringify(
          {
            errorUpsertForm,
            errorUpsertQuestion,
          },
          null,
          2
        )
      );
    }
  }, [errorUpsertForm, errorUpsertQuestion]);

  return (
    <Stack spacing="20px">
      {(errorUpsertForm || errorUpsertQuestion) && (
        <>
          <h3>Error!</h3>
          <ul>
            {[
              ...(errorUpsertForm?.graphQLErrors ?? []),
              ...(errorUpsertQuestion?.graphQLErrors ?? []),
            ].map(({ message }, key) => (
              <p key={key}>{message}</p>
            ))}
          </ul>
        </>
      )}
      <InputGroup size="sm" borderColor="gray.400" alignItems="center">
        <InputLeftAddon rounded="md" size="md">
          <Text>Authorization Token</Text>
        </InputLeftAddon>
        <Input
          size="lg"
          variant="outline"
          rounded="md"
          placeholder="token"
          isRequired
          value={authorization}
          onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            setAuthorization(value);
          }}
        />
      </InputGroup>
      <Heading>Update Forms</Heading>
      {allForms?.forms.map(form => {
        type IFormQuestions = { text: string; alternatives?: string };
        return (
          <Box key={form._id}>
            <Flex alignItems="center">
              <Badge variantColor="yellow">Form</Badge>
              <Tag variantColor="blue">{form.name}</Tag>
            </Flex>
            <Formik<Record<string, IFormQuestions>>
              initialValues={{
                name: { text: form.name },
                ...form.questions.reduce<Record<string, IFormQuestions>>(
                  (acum, { _id, text, alternatives }) => {
                    acum[_id] = { text, alternatives: alternatives?.join("|") };
                    return acum;
                  },
                  {}
                ),
              }}
              enableReinitialize
              onSubmit={async ({ name, ...questions }) => {
                console.log({ questions, name });
                await Promise.all(
                  map(questions, async ({ text, alternatives }, _id) => {
                    console.log({ text, alternatives, _id });
                    const alternativesUpsert = compact(
                      map(alternatives?.split("|"), v => v.trim())
                    );
                    return upsertQuestion({
                      variables: {
                        data: {
                          _id,
                          text,
                          alternatives:
                            alternativesUpsert.length > 0
                              ? alternativesUpsert
                              : null,
                        },
                      },
                    });
                  })
                );
                console.log({ name });
                console.log({
                  asd: name.text,
                  questions: Object.keys(questions),
                });
                await upsertForm({
                  variables: {
                    data: {
                      _id: form._id,
                      name: name.text,
                      questions: Object.keys(questions),
                    },
                  },
                });
                await refetchGetForms();
              }}
              children={({
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                values,
                setFieldValue,
              }) => {
                return (
                  <form name={form._id} onSubmit={handleSubmit}>
                    <InputGroup>
                      <InputLeftAddon rounded="md" size="md">
                        <Text>Name</Text>
                      </InputLeftAddon>
                      <Input
                        name="name"
                        onChange={({
                          target: { value },
                        }: ChangeEvent<HTMLInputElement>) =>
                          setFieldValue("name", { text: value })
                        }
                        onBlur={handleBlur}
                        value={values.name.text}
                      />
                    </InputGroup>

                    {form.questions.map(({ _id }, key) => {
                      return (
                        <InputGroup key={_id}>
                          <InputLeftAddon rounded="md" size="md">
                            <Text>{`Question ${key + 1} ${_id}`}</Text>
                          </InputLeftAddon>
                          <Input
                            name={_id}
                            onChange={({
                              target: { value },
                            }: ChangeEvent<HTMLInputElement>) =>
                              setFieldValue(_id, {
                                text: value,
                                alternatives: values[_id]?.alternatives ?? "",
                              })
                            }
                            onBlur={handleBlur}
                            value={values[_id]?.text ?? ""}
                          />
                          <Input
                            name={_id}
                            value={values[_id]?.alternatives ?? ""}
                            onChange={({
                              target: { value },
                            }: ChangeEvent<HTMLInputElement>) =>
                              setFieldValue(_id, {
                                text: values[_id]?.text ?? "",
                                alternatives: value,
                              })
                            }
                            onBlur={handleBlur}
                          />
                        </InputGroup>
                      );
                    })}
                    <Button
                      isDisabled={isSubmitting}
                      isLoading={isSubmitting}
                      type="submit"
                    >
                      Update Form
                    </Button>
                  </form>
                );
              }}
            />
          </Box>
        );
      })}
      <Heading>Upsert Form</Heading>
      {(() => {
        const { name, questions } = newFormState;
        const newForm = async () => {
          const upsertedQuestions = await Promise.all(
            questions.map(text => {
              return upsertQuestion({
                variables: {
                  data: {
                    text,
                  },
                },
              });
            })
          );

          const questionsIds = compact(
            upsertedQuestions.map(({ data }) => {
              return data?.upsertQuestion._id ?? "";
            })
          );

          await upsertForm({
            variables: {
              data: {
                name,
                questions: questionsIds,
              },
            },
          });

          await refetchGetForms();
        };
        return (
          <>
            |
            <InputGroup>
              <InputLeftAddon rounded="md" size="md">
                <Text>Name</Text>
              </InputLeftAddon>
              <Input
                value={name}
                onChange={({
                  target: { value: name },
                }: ChangeEvent<HTMLInputElement>) => {
                  setNewFormState({
                    name,
                  });
                }}
              />
            </InputGroup>
            {[...questions, ""].map((value, key) => {
              return (
                <InputGroup key={key}>
                  <InputLeftAddon rounded="md" size="md">
                    <Text>{`Question ${key + 1}`}</Text>
                  </InputLeftAddon>
                  <Input
                    value={value}
                    onChange={({
                      target: { value },
                    }: ChangeEvent<HTMLInputElement>) => {
                      setNewFormState(({ questions }) => {
                        const newQuestions = [...questions];
                        newQuestions[key] = value;
                        return {
                          questions: newQuestions,
                        };
                      });
                    }}
                  />
                </InputGroup>
              );
            })}
            <Button
              isDisabled={!name || loadingUpsertForm || loadingUpsertQuestion}
              isLoading={loadingUpsertForm || loadingUpsertQuestion}
              onClick={newForm}
            >
              Save New Upserted Form
            </Button>
          </>
        );
      })()}
    </Stack>
  );
};
