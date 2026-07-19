import test from "node:test";
import assert from "node:assert/strict";
import { extractOpenAiStructuredJson } from "./meta-ai-response.ts";

const draft = { intent: "sizing", suggestedReply: "Hello", missingInformation: "None", ownerActionRequired: false, priority: "LOW" };

test("extracts top-level output_text", () => {
  const result = extractOpenAiStructuredJson({ output_text: JSON.stringify(draft) });
  assert.deepEqual(result.value, draft);
  assert.equal(result.extractionPath, "output_text");
});

test("extracts output content text", () => {
  const result = extractOpenAiStructuredJson({ output: [{ type: "message", content: [{ type: "text", text: JSON.stringify(draft) }] }] });
  assert.deepEqual(result.value, draft);
  assert.equal(result.extractionPath, "output_content_text");
});

test("extracts output content output_text", () => {
  const result = extractOpenAiStructuredJson({ output: [{ type: "message", content: [{ type: "output_text", output_text: JSON.stringify(draft) }] }] });
  assert.deepEqual(result.value, draft);
  assert.equal(result.extractionPath, "output_content_text");
});

test("uses a parsed structured object first", () => {
  const result = extractOpenAiStructuredJson({ output: [{ type: "message", content: [{ type: "output_text", parsed: draft }] }] });
  assert.deepEqual(result.value, draft);
  assert.equal(result.extractionPath, "parsed_object");
});

test("parses markdown fenced JSON", () => {
  const result = extractOpenAiStructuredJson({ output_text: `\`\`\`json\n${JSON.stringify(draft)}\n\`\`\`` });
  assert.deepEqual(result.value, draft);
});

test("reports malformed and empty responses safely", () => {
  assert.equal(extractOpenAiStructuredJson({ output_text: "{bad" }).error, "malformed_json");
  assert.equal(extractOpenAiStructuredJson({ output: [] }).error, "empty_response");
});
