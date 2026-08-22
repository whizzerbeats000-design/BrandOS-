type ClassInput = string | Record<string, boolean> | false | null | undefined;

export function cn(...inputs: ClassInput[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      out.push(input);
    } else {
      for (const [key, value] of Object.entries(input)) {
        if (value) out.push(key);
      }
    }
  }
  return out.join(" ");
}
