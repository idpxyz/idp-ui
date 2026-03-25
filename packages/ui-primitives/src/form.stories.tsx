import type { Meta, StoryObj } from '@storybook/react';
import { FormField, Label, FormDescription, FormError, Textarea } from './form';
import { Input } from './input';
import { Select, SelectOption } from './select';

const meta: Meta = { title: 'Primitives/Form' };
export default meta;

export const FormLayout: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FormField>
        <Label required>Name</Label>
        <Input placeholder="Enter your name" />
      </FormField>
      <FormField>
        <Label>Email</Label>
        <Input type="email" placeholder="you@example.com" />
        <FormDescription>We'll never share your email.</FormDescription>
      </FormField>
      <FormField>
        <Label required>Role</Label>
        <Select>
          <SelectOption value="">Select role...</SelectOption>
          <SelectOption value="admin">Admin</SelectOption>
          <SelectOption value="editor">Editor</SelectOption>
          <SelectOption value="viewer">Viewer</SelectOption>
        </Select>
      </FormField>
      <FormField>
        <Label>Description</Label>
        <Textarea placeholder="Tell us about yourself..." />
      </FormField>
      <FormField>
        <Label required>Required Field</Label>
        <Input placeholder="This field has an error" />
        <FormError>This field is required</FormError>
      </FormField>
    </div>
  ),
};
