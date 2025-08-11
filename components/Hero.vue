<template>
  <header class="pb-2 pt-7 px-4 sm:px-6 lg:px-8 bg-[#1A043C]">
    <div class="relative mx-auto max-w-3xl text-center pb-2">
      <div class="sm:flex items-center justify-center space-x-2">
        <div class="flex items-center justify-center">
          <div class="h-48 w-48 flex items-center justify-center bg-transparent">
            <img src="/white-logo.png" alt="Logo Alianza La Libertad Avanza" class="h-44 w-44 object-contain bg-transparent" />
          </div>
        </div>
        <div class="text-center">
          <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl sm:mt-[30px] whitespace-nowrap">
            Alianza La Libertad
          </h1>
          <h2 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mt-1">
            Avanza Córdoba
          </h2>
        </div>
      </div>
      <div class="mt-2 mb-8 text-lg leading-8 text-white">
        <p>Sitio oficial de la Alianza La Libertad Avanza Córdoba: Resoluciones, comunicados y declaraciones oficiales.</p>
      </div>
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
