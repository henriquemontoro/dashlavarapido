// Datas do backend sempre representam um instante UTC, mas datetimes "naive"
// (gerados direto pelo banco, sem timezone) chegam sem sufixo "Z"/offset no
// ISO string — e o JS interpreta isso como horário local, não UTC. Corrige
// isso antes de criar o Date, senão cálculos de duração saem errados.
export function parseApiDate(value: string): Date {
  const hasTimezone = /[zZ]|[+-]\d\d:\d\d$/.test(value)
  return new Date(hasTimezone ? value : `${value}Z`)
}
