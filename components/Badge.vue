<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
      badgeClass
    ]"
  >
    <svg
      class="-ml-0.5 mr-1.5 h-2 w-2"
      :class="iconClass"
      fill="currentColor"
      viewBox="0 0 8 8"
    >
      <circle cx="4" cy="4" r="3" />
    </svg>
    {{ label }}
    <Icon 
      v-if="showClip"
      name="heroicons:paper-clip" 
      class="ml-1.5 h-3 w-3 text-white" 
    />
  </span>
</template>

<script setup>
const props = defineProps({
  label: String,
  badgeClass: {
    type: String,
    default: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  iconClass: {
    type: String,
    default: 'text-sky-400'
  },
  showClip: {
    type: Boolean,
    default: false
  }
});
</script>
