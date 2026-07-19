export type OpenAiResponseShape = {
  topLevelKeys: string[];
  outputItemCount: number;
  outputItemTypes: string[];
  contentTypes: string[];
  hasOutputText: boolean;
  hasParsedObject: boolean;
};

export type ExtractedStructuredJson = {
  value: unknown | null;
  extractionPath: "parsed_object" | "output_text" | "output_content_text" | "none";
  shape: OpenAiResponseShape;
  error?: "empty_response" | "malformed_json";
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function unwrapCodeFence(value: string) {
  const match = value.match(/^\s*```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i);
  return (match?.[1] ?? value).trim();
}

function parseJson(value: unknown) {
  if (isRecord(value) || Array.isArray(value)) return value;
  const text = nonEmptyString(value);
  if (!text) return null;
  try {
    return JSON.parse(unwrapCodeFence(text));
  } catch {
    return null;
  }
}

export function extractOpenAiStructuredJson(response: unknown): ExtractedStructuredJson {
  const root = isRecord(response) ? response : {};
  const output = Array.isArray(root.output) ? root.output : [];
  const content = output.flatMap((item) => (isRecord(item) && Array.isArray(item.content) ? item.content : []));
  const parsedCandidates = [root.parsed, root.output_parsed, ...content.flatMap((item) => isRecord(item) ? [item.parsed, item.json, item.output_json] : [])];
  const textCandidates: Array<{ text: string; path: "output_text" | "output_content_text" }> = [];
  const rootText = nonEmptyString(root.output_text);
  if (rootText) textCandidates.push({ text: rootText, path: "output_text" });
  for (const item of content) {
    if (!isRecord(item)) continue;
    const text = nonEmptyString(item.text) ?? nonEmptyString(item.output_text);
    if (text) textCandidates.push({ text, path: "output_content_text" });
  }
  const shape: OpenAiResponseShape = {
    topLevelKeys: Object.keys(root).sort(),
    outputItemCount: output.length,
    outputItemTypes: [...new Set(output.map((item) => isRecord(item) && typeof item.type === "string" ? item.type : "unknown"))],
    contentTypes: [...new Set(content.map((item) => isRecord(item) && typeof item.type === "string" ? item.type : "unknown"))],
    hasOutputText: Boolean(rootText),
    hasParsedObject: parsedCandidates.some((candidate) => isRecord(candidate) || Array.isArray(candidate)),
  };
  for (const candidate of parsedCandidates) {
    const parsed = parseJson(candidate);
    if (parsed) return { value: parsed, extractionPath: "parsed_object", shape };
  }
  for (const candidate of textCandidates) {
    const parsed = parseJson(candidate.text);
    if (parsed) return { value: parsed, extractionPath: candidate.path, shape };
  }
  return { value: null, extractionPath: "none", shape, error: textCandidates.length ? "malformed_json" : "empty_response" };
}
