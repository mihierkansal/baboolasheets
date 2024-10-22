export function cleanString(input: string) {
  return input.replace(/[^\d.]/g, "");
}
