import * as React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import {
  FormCheckboxField,
  FormProvider,
  FormRadioGroupField,
  FormRootError,
  FormSelectField,
  FormSwitchField,
  FormTextField,
  FormTextareaField,
} from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-native";

import { z } from "zod";

const textSchema = z.object({
  title: z.string().min(1, "Enter a title."),
});

const textareaSchema = z.object({
  notes: z.string().min(10, "Enter at least 10 characters."),
});

const selectSchema = z.object({
  plan: z.string().min(1, "Choose a plan."),
});

const toggleSchema = z.object({
  notifyByEmail: z.boolean(),
  pinChannel: z.boolean(),
});

const radioSchema = z.object({
  delivery: z.string().min(1, "Choose a delivery method."),
});

const planOptions = [
  { value: "starter", label: "Starter" },
  { value: "team", label: "Team" },
  { value: "enterprise", label: "Enterprise" },
];

const deliveryOptions = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push" },
];

function TextFieldStory() {
  const form = useForm<z.input<typeof textSchema>>({
    resolver: zodResolver(textSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
    },
  });
  const { trigger } = form;

  React.useEffect(() => {
    void trigger("title");
  }, [trigger]);

  return (
    <FormProvider {...form}>
      <View className="w-full max-w-sm gap-4">
        <FormTextField
          name="title"
          label="Project title"
          description="Use a short label for the channel."
          placeholder="QLink roadmap"
        />
      </View>
    </FormProvider>
  );
}

function TextareaFieldStory() {
  const form = useForm<z.input<typeof textareaSchema>>({
    resolver: zodResolver(textareaSchema),
    mode: "onChange",
    defaultValues: {
      notes: "",
    },
  });
  const { trigger } = form;

  React.useEffect(() => {
    void trigger("notes");
  }, [trigger]);

  return (
    <FormProvider {...form}>
      <View className="w-full max-w-sm gap-4">
        <FormTextareaField
          name="notes"
          label="Notes"
          description="This message appears below the field."
          placeholder="Add a short note"
        />
      </View>
    </FormProvider>
  );
}

function SelectFieldStory() {
  const form = useForm<z.input<typeof selectSchema>>({
    resolver: zodResolver(selectSchema),
    mode: "onChange",
    defaultValues: {
      plan: "team",
    },
  });

  return (
    <FormProvider {...form}>
      <View className="w-full max-w-sm gap-4">
        <FormSelectField
          name="plan"
          label="Plan"
          description="The form value stays scalar while the UI uses option objects."
          options={planOptions}
          placeholder="Choose a plan"
          groupLabel="Available plans"
        />
      </View>
    </FormProvider>
  );
}

function ToggleFieldStory() {
  const form = useForm<z.input<typeof toggleSchema>>({
    resolver: zodResolver(toggleSchema),
    defaultValues: {
      notifyByEmail: true,
      pinChannel: false,
    },
  });

  return (
    <FormProvider {...form}>
      <View className="w-full max-w-sm gap-4">
        <FormCheckboxField
          name="notifyByEmail"
          label="Notify by email"
          description="Send an email when the channel changes."
        />
        <FormSwitchField
          name="pinChannel"
          label="Pin this channel"
          description="Keep this channel at the top of the list."
        />
      </View>
    </FormProvider>
  );
}

function RadioGroupFieldStory() {
  const form = useForm<z.input<typeof radioSchema>>({
    resolver: zodResolver(radioSchema),
    defaultValues: {
      delivery: "email",
    },
  });

  return (
    <FormProvider {...form}>
      <View className="w-full max-w-sm gap-4">
        <FormRadioGroupField
          name="delivery"
          label="Delivery method"
          description="Choose one delivery channel."
          options={deliveryOptions}
        />
      </View>
    </FormProvider>
  );
}

function RootErrorStory() {
  const form = useForm({
    defaultValues: {},
  });
  const { clearErrors, setError } = form;

  React.useEffect(() => {
    setError("root.serverError", {
      type: "server",
      message: "The server rejected this request. Try again in a moment.",
    });
  }, [setError]);

  return (
    <FormProvider {...form}>
      <View className="w-full max-w-sm gap-4">
        <FormRootError />
        <Button onPress={() => clearErrors("root.serverError")}>
          <Text>Clear error</Text>
        </Button>
      </View>
    </FormProvider>
  );
}

const meta = {
  title: "공통 UI/Form",
  component: TextFieldStory,
  decorators: [
    (Story) => (
      <View className="w-full items-start p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TextFieldStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextField: Story = {
  name: "Text Field",
  render: () => <TextFieldStory />,
};

export const TextareaField: Story = {
  name: "Textarea Field",
  render: () => <TextareaFieldStory />,
};

export const SelectField: Story = {
  name: "Select Field",
  render: () => <SelectFieldStory />,
};

export const ToggleFields: Story = {
  name: "Checkbox and Switch",
  render: () => <ToggleFieldStory />,
};

export const RadioField: Story = {
  name: "Radio Group Field",
  render: () => <RadioGroupFieldStory />,
};

export const ServerError: Story = {
  name: "Root Server Error",
  render: () => <RootErrorStory />,
};
