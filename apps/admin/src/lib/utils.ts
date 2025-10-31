import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Move um elemento de uma posição para outra em um array
 * @param array - O array original
 * @param from - Índice de origem
 * @param to - Índice de destino
 * @returns Novo array com o elemento movido
 */
export function move<T>(array: T[], from: number, to: number): T[] {
  const result = [...array]
  const [removed] = result.splice(from, 1)
  result.splice(to, 0, removed)
  return result
}

/**
 * Limita um valor numérico entre um mínimo e um máximo
 * @param value - O valor a ser limitado
 * @param min - Valor mínimo permitido
 * @param max - Valor máximo permitido
 * @returns O valor limitado entre min e max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
