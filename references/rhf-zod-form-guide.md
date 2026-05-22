# RHF + Zod Form Guide

This guide defines the standard form pattern for this repo.

## Stack

Use this guide with the current stack:

- `expo@55`
- `react@19.2.0`
- `react-native@0.83.6`
- `react-hook-form@7.76.0`
- `@hookform/resolvers@5.4.0`
- `zod@4.4.3`
- `@tanstack/react-query@5.100.10`
- `axios@1.16.1`

Use current `react-hook-form`, `@hookform/resolvers`, `zod`, and TanStack Query APIs. Do not introduce deprecated React Native form libraries or legacy validation patterns.

## When to Use RHF

Use `react-hook-form` for inputs that belong to a submission lifecycle:

- create and edit forms
- forms with validation
- forms that need `defaultValues`, `reset`, `dirtyFields`, or submit state
- forms used inside pages, sheets, dialogs, or modals

Do not use `react-hook-form` for screen-only UI state:

- search input
- filter input
- open and close state
- temporary selection state with no submit boundary
- simple toggles that update immediately and are not part of a form submission

If the state belongs to a payload and validation flow, use RHF. If it belongs to display behavior only, use local state.

## Core Rules

- Use `FormProvider` at the form boundary.
- Use shared adapters from `components/ui/form/` instead of inline `Controller` in screens.
- Let adapters read RHF state from context by default.
- Allow an explicit `control` prop only for edge cases.
- Keep route files thin. Put form logic in `features/{domain}/hooks` and `features/{domain}/components`.
- Keep existing UI primitives as the rendering surface. The form layer is an adapter layer, not a replacement design system.

## Zod Scope

Use `zod` for form input validation and type inference. Do not use it as a direct replacement for backend DTO definitions.

Keep these responsibilities separate:

- `schema`: client-side input rules
- `toFormValues`: server response to RHF `defaultValues`
- `toRequest`: RHF submit values to API request payload
- `mutation`: network call, invalidation, and error handling

Do not push backend response mapping, query invalidation, or large payload reshaping into the schema.

## Form Values and DTO Mapping

Separate RHF values from API request and response types.

```ts
type LinkResponseDto = {
  id: string;
  title: string | null;
  url: string;
  isPinned: boolean;
};

type UpdateLinkRequestDto = {
  title: string | null;
  url: string;
  pinned: boolean;
};
```

```ts
import { z } from "zod";

export const linkFormSchema = z.object({
  title: z.string().trim().max(120, "Title must be 120 characters or fewer."),
  url: z.string().trim().url("Enter a valid URL."),
  isPinned: z.boolean(),
});

export type LinkFormValues = z.input<typeof linkFormSchema>;
export type LinkSubmitValues = z.output<typeof linkFormSchema>;

export function toLinkFormValues(dto?: LinkResponseDto): LinkFormValues {
  return {
    title: dto?.title ?? "",
    url: dto?.url ?? "",
    isPinned: dto?.isPinned ?? false,
  };
}

export function toUpdateLinkRequest(values: LinkSubmitValues): UpdateLinkRequestDto {
  return {
    title: values.title.length > 0 ? values.title : null,
    url: values.url,
    pinned: values.isPinned,
  };
}
```

Use string form values for `TextInput`-based numeric input unless a field is clearly modeled as a number at input time. Convert to API payload shape in `toRequest`.

Do not rely on `undefined` for form defaults. Use explicit empty values:

- `""`
- `false`
- `null`
- `[]`

## Standard `useForm` Setup

Use this default shape unless a specific form needs a different validation mode:

```ts
const form = useForm<LinkFormValues>({
  resolver: zodResolver(linkFormSchema),
  mode: "onBlur",
  reValidateMode: "onChange",
  criteriaMode: "firstError",
  defaultValues: toLinkFormValues(initialData),
});
```

Rules:

- Define every field in `defaultValues`.
- Use `resolver` for schema validation. Do not mix resolver-based validation with built-in field rules for the same form.
- Do not put the full `methods` object in `useEffect` dependencies. Depend on the specific RHF methods you call.
- Do not default `shouldUnregister` to `true`.

## Async Hydration and Edit Forms

RHF `defaultValues` are cached. Use `reset()` when server data arrives after mount.

```ts
const { data } = useLinkQuery(linkId);
const { reset, ...form } = useForm<LinkFormValues>({
  resolver: zodResolver(linkFormSchema),
  defaultValues: toLinkFormValues(),
});

React.useEffect(() => {
  if (!data) {
    return;
  }

  reset(toLinkFormValues(data));
}, [data, reset]);
```

For create and edit flows in sheets or dialogs:

- keep open state outside RHF
- reset create forms when the container closes
- reset edit forms from the latest DTO when the container opens or data changes

## Mutation Boundary

Keep HTTP calls in `api.ts`, mutation logic in `mutations.ts`, and form orchestration in `use-{domain}-form.ts`.

```ts
// features/links/api.ts
export async function updateLink(
  linkId: string,
  body: UpdateLinkRequestDto,
  authToken?: string | null,
) {
  return api.patch<LinkResponseDto, UpdateLinkRequestDto>(`/links/${linkId}`, body, {
    authToken,
  });
}
```

```ts
// features/links/mutations.ts
export function useUpdateLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ linkId, body, authToken }: UpdateLinkVariables) =>
      updateLink(linkId, body, authToken),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["links"] }),
        queryClient.invalidateQueries({ queryKey: ["links", variables.linkId] }),
      ]);
    },
  });
}
```

```ts
// features/links/hooks/use-link-form.ts
export function useLinkForm(options: UseLinkFormOptions) {
  const mutation = useUpdateLinkMutation();
  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: toLinkFormValues(options.initialData),
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync({
      linkId: options.linkId,
      authToken: options.authToken,
      body: toUpdateLinkRequest(values),
    });
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting || mutation.isPending,
  };
}
```

## Server Error Rule

Client-side validation errors may appear per field through RHF field state.

Server-side errors must be treated as general form errors only. Do not map server errors to individual fields.

Set server errors like this:

```ts
form.setError("root.serverError", {
  type: "server",
  message: "The server rejected this request.",
});
```

Use `FormRootError` to render the shared server error UI. Do not add server field-error mappers to shared form components.

## Shared Form Components

Use the shared layer in `components/ui/form/`.

- `FormField`: layout wrapper for label, description, field content, and client validation message
- `FormLabel`: shared label wrapper
- `FormDescription`: helper text
- `FormMessage`: client validation message
- `FormRootError`: general server error from `errors.root.serverError`
- `FormControl`: optional control wrapper for spacing
- `FormTextField`: `Input` adapter
- `FormTextareaField`: `Textarea` adapter
- `FormSelectField`: `Select` adapter with scalar RHF values and `Option` UI mapping
- `FormCheckboxField`: `Checkbox` adapter
- `FormSwitchField`: `Switch` adapter
- `FormRadioGroupField`: `RadioGroup` adapter

Rules:

- Adapters use `useController` internally.
- Adapters render RHF client validation messages from `fieldState.error` only.
- Adapters do not accept backend error payloads.
- `FormRootError` is the only shared server-error component.

## Page, Sheet, and Dialog Usage

Use the same field adapters in pages, sheets, and dialogs.

- Wrap the form tree with `FormProvider`.
- Keep page, sheet, and dialog open state outside RHF.
- Use the same feature form component across containers when possible.
- Place the first screen-level container inside a `ScrollView` when the route renders a screen.

Example:

```tsx
function LinkForm({ form, onSubmit, submitLabel }: LinkFormProps) {
  return (
    <FormProvider {...form}>
      <View className="gap-4">
        <FormRootError />
        <FormTextField
          name="title"
          label="Title"
          placeholder="Channel title"
        />
        <FormTextField
          name="url"
          label="URL"
          placeholder="https://"
          keyboardType="url"
          autoCapitalize="none"
        />
        <FormSwitchField
          name="isPinned"
          label="Pin this channel"
        />
        <Button onPress={onSubmit}>
          <Text>{submitLabel}</Text>
        </Button>
      </View>
    </FormProvider>
  );
}
```

## References

- React Hook Form `useForm`: https://react-hook-form.com/docs/useform
- React Hook Form `Controller`: https://react-hook-form.com/docs/usecontroller/controller
- React Hook Form `FormProvider`: https://react-hook-form.com/docs/formprovider
- React Hook Form `useFormContext`: https://react-hook-form.com/docs/useformcontext
- React Hook Form `setError`: https://react-hook-form.com/docs/useform/seterror
- RHF docs repository: https://github.com/react-hook-form/documentation
- Resolvers README: https://github.com/react-hook-form/resolvers
- TanStack Query `useMutation`: https://tanstack.com/query/v5/docs/framework/react/reference/useMutation
- TanStack Query invalidation guide: https://tanstack.com/query/v5/docs/framework/react/guides/invalidations-from-mutations
- Zod docs: https://zod.dev/api
