import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Input } from './input';

const meta: Meta = {
  title: 'Primitives/Popover',
  tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Settings</h4>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Width</label>
            <Input defaultValue="100%" className="h-8" />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Height</label>
            <Input defaultValue="auto" className="h-8" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
