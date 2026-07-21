import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the WORK TICKER calculator", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /WORK TICKER/);
  assert.match(html, /지금, 얼마/);
  assert.match(html, /실시간 급여 카운터/);
  assert.match(html, /개인정보처리방침/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("renders original guide and trust content", async () => {
  const [guides, calculation, privacy] = await Promise.all([
    render("/guides").then((response) => response.text()),
    render("/calculation").then((response) => response.text()),
    render("/privacy").then((response) => response.text()),
  ]);
  assert.match(guides, /근로시간과 휴게시간/);
  assert.match(guides, /2026년 최저임금/);
  assert.match(calculation, /급여 종류별 공식/);
  assert.match(calculation, /통상임금/);
  assert.match(privacy, /localStorage/);
  assert.match(privacy, /Google 광고/);
});
