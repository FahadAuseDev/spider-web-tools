<script lang="ts" setup>
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
    'tw-flex tw-items-center tw-justify-center tw-rounded-md tw-text-sm tw-font-medium tw-ring-offset-primary tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-primary focus-visible:tw-ring-offset-2 disabled:tw-pointer-events-none disabled:tw-opacity-50',
    {
        variants: {
            variant: {
                default: 'tw-bg-primary tw-text-white hover:tw-bg-primary/90'
            },
            size: {
                default: 'tw-h-10 tw-px-4 tw-py-2',
                sm: 'tw-h-9 tw-rounded-md tw-px-3',
                lg: 'tw-h-11 tw-rounded-md tw-px-8',
                icon: 'tw-h-10 tw-w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

interface Props {
    variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant']
    size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size']
    as?: string
}

// eslint-disable-next-line vue/define-macros-order
withDefaults(defineProps<Props>(), {
    as: 'button'
})

</script>


<template>
    <component :is="as" :class="cn(buttonVariants({ variant, size }), $attrs.class ?? 'no_attribute')">
        <slot />
    </component>
</template>