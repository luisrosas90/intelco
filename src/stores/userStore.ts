// src/stores/userStore.ts
import { writable } from 'svelte/store';
import type { ClientData } from '../lib/types';

export const usuario = writable<string>(''); // Definir la store
export const usuarioStore = writable<ClientData | null>(null);
// Añade otros stores según sea necesario
