import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormField, Label, FormDescription, FormError, Textarea } from './form';
import { Input } from './input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

const meta: Meta = { title: 'Primitives/Form' };
export default meta;

function FormLayoutStory() {
  const [role, setRole] = useState<string | undefined>(undefined);

  return (
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
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select role…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
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
  );
}

export const FormLayout: StoryObj = {
  render: () => <FormLayoutStory />,
};
