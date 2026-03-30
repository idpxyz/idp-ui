'use client';

import * as React from 'react';
import { Smile } from 'lucide-react';
import { cn } from '@idpxyz/ui-utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';

let Picker: React.ComponentType<{ data: unknown; onEmojiSelect: (emoji: { native: string }) => void; theme: string; previewPosition: string; skinTonePosition: string }> | null = null;
let emojiData: unknown = null;

async function loadEmojiMart() {
  if (Picker && emojiData) return;
  const [mod, data] = await Promise.all([
    import('@emoji-mart/react'),
    import('@emoji-mart/data'),
  ]);
  Picker = mod.default;
  emojiData = data.default;
}

export interface EmojiPickerProps {
  value?: string;
  onChange: (emoji: string) => void;
  placeholder?: string;
  className?: string;
}

function EmojiPicker({ value, onChange, placeholder = 'Emoji', className }: EmojiPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (open && !loaded) {
      loadEmojiMart().then(() => setLoaded(true));
    }
  }, [open, loaded]);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="h-8 flex-1 flex items-center px-2 rounded border border-idpxyz-border bg-idpxyz-inputBg text-[16px]">
        {value || <span className="text-[12px] text-idpxyz-textMuted">{placeholder}</span>}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
            <Smile size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-0" align="start">
          {loaded && Picker && emojiData ? (
            <Picker
              data={emojiData}
              onEmojiSelect={(emoji: { native: string }) => {
                onChange(emoji.native);
                setOpen(false);
              }}
              theme="dark"
              previewPosition="none"
              skinTonePosition="search"
            />
          ) : (
            <div className="p-4 text-[12px] text-idpxyz-textMuted">Loading...</div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { EmojiPicker };
