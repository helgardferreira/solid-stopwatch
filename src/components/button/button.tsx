import * as ButtonPrimitive from '@kobalte/core/button';
import { type VariantProps, cva } from 'class-variance-authority';
import { type Component, type ComponentProps, splitProps } from 'solid-js';

import { cn } from '../../utils';

export const buttonVariants = cva(
  cn(
    'aria-invalid:border-red-500',
    'aria-invalid:ring-red-500/20',
    'cursor-pointer',
    'dark:focus-visible:ring-zinc-50/50',
    'disabled:opacity-50',
    'disabled:pointer-events-none',
    'focus-visible:border-zinc-950',
    'focus-visible:ring-[3px]',
    'focus-visible:ring-zinc-950/50',
    'font-medium',
    'gap-2',
    'h-fit',
    'inline-flex',
    'items-center',
    'justify-center',
    'outline-none',
    'px-4',
    'py-1',
    'rounded-full',
    'shrink-0',
    'text-sm',
    'transition-colors',
    'whitespace-nowrap'
  ),
  {
    variants: {
      variant: {
        default:
          'bg-zinc-950 text-white hover:bg-zinc-950/90 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-50/90',
        success:
          'bg-green-500 text-white hover:bg-green-500/90 focus-visible:ring-green-500/20',
        destructive:
          'bg-red-500 text-white hover:bg-red-500/90 focus-visible:ring-red-500/20',
        outline:
          'border bg-zinc-50 shadow-xs hover:bg-zinc-200 hover:text-zinc-800 dark:bg-zinc-900/30 dark:border-zinc-900 dark:hover:bg-zinc-900/50',
        ghost:
          'hover:bg-zinc-200 hover:text-zinc-800 dark:hover:bg-zinc-900/50',
        link: 'text-zinc-950 underline-offset-4 hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>;

export const Button: Component<ButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ['class', 'variant']);

  return (
    <ButtonPrimitive.Root
      class={cn(buttonVariants({ variant: local.variant }), local.class)}
      {...rest}
    />
  );
};
