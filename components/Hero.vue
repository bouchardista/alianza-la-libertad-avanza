<template>
  <header class="pb-2 pt-7 px-4 sm:px-6 lg:px-8 bg-[#1A043C]">
    <div class="relative mx-auto max-w-4xl pt-12 text-center pb-2">
      <div class="sm:flex items-center justify-center space-x-6">
        <div class="flex items-center justify-center">
          <div class="h-40 w-40 flex items-center justify-center shadow-lg">
            <img src="/white-logo.png" alt="Logo Alianza La Libertad Avanza" class="h-36 w-36 object-contain" />
          </div>
        </div>
        <div class="text-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl whitespace-nowrap">
            Alianza La Libertad
          </h1>
          <h2 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mt-1">
            Avanza Córdoba
          </h2>
        </div>
      </div>
      <p class="mt-4 text-lg leading-8 text-white">
        Sitio oficial de la organización. Resoluciones, comunicados y declaraciones oficiales.
      </p>
    </div>
  </header>
</template>

<script setup></script>

<style scoped>
.form-input {
  @apply block h-10 w-full rounded-md bg-white pr-3 pl-12 text-slate-900 shadow-md shadow-black/5 ring-1 ring-slate-900/5 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6;
}
.form-submit {
  @apply inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-gray-700 ml-4 flex-none;
}
</style>
