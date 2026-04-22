export interface TransformOptions {
  width: number;
  quality?: number;
  format?: "auto" | "avif" | "webp" | "jpeg";
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
}

export function cdnImage(url: string, opts: TransformOptions): string {
  const parsed = new URL(url);
  const params = [
    `width=${opts.width}`,
    `format=${opts.format ?? "auto"}`,
    `quality=${opts.quality ?? 82}`,
  ];
  if (opts.fit) params.push(`fit=${opts.fit}`);
  return `${parsed.origin}/cdn-cgi/image/${params.join(",")}${parsed.pathname}`;
}

export function cdnSrcset(url: string, widths: number[]): string {
  return widths.map((w) => `${cdnImage(url, { width: w })} ${w}w`).join(", ");
}
