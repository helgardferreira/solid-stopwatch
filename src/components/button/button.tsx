import * as ButtonPrimitive from '@kobalte/core/button';
import { type VariantProps, cva } from 'class-variance-authority';
import { type Component, type ComponentProps, splitProps } from 'solid-js';

import { cn } from '../../utils';

export const buttonVariants = cva(
  cn(
    'aria-invalid:border-red-500',
    'aria-invalid:ring-red-500/20',
    'cursor-pointer',
    'dark:aria-invalid:ring-red-500/40',
    'disabled:opacity-50',
    'disabled:pointer-events-none',
    'focus-visible:border-slate-950',
    'focus-visible:ring-[3px]',
    'focus-visible:ring-slate-950/50',
    'font-medium',
    'gap-2',
    'inline-flex',
    'items-center',
    'justify-center',
    'outline-none',
    'px-4',
    'py-1',
    'rounded-full',
    'shrink-0',
    'text-sm',
    'transition-all',
    'whitespace-nowrap'
  ),
  {
    variants: {
      variant: {
        default: 'bg-slate-950 text-white hover:bg-slate-950/90',
        success:
          'bg-green-500 text-white hover:bg-green-500/90 focus-visible:ring-green-500/20 dark:focus-visible:ring-green-500/40 dark:bg-green-500/60',
        destructive:
          'bg-red-500 text-white hover:bg-red-500/90 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-500/60',
        outline:
          'border bg-slate-50 shadow-xs hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-900/30 dark:border-slate-900 dark:hover:bg-slate-900/50',
        ghost:
          'hover:bg-slate-200 hover:text-slate-800 dark:hover:bg-slate-900/50',
        link: 'text-slate-950 underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>;

// TODO: implement variants via `class-variance-authority`
// TODO: continue here...
export const Button: Component<ButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'variant']);

  return (
    <ButtonPrimitive.Root
      class={cn(buttonVariants({ variant: local.variant }), local.class)}
      {...rest}
    />
  );
};
