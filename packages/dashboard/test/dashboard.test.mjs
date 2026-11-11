import test from "node:test";
import assert from "node:assert/strict";

import { widgetColumnClass } from "../src/layout.js";
import { formatValue, toneClass, listItems } from "../src/format.js";

test("widgetColumnClass : pleine largeur par défaut, pour 12, et pour un colSpan inférieur à 2", () => {
  assert.equal(widgetColumnClass(undefined), "col-12");
  assert.equal(widgetColumnClass({}), "col-12");
  assert.equal(widgetColumnClass({ colSpan: 1 }), "col-12");
  assert.equal(widgetColumnClass({ colSpan: 12 }), "col-12");
  assert.equal(widgetColumnClass({ colSpan: 99 }), "col-12");
});

test("widgetColumnClass : colonnes selon colSpan", () => {
  assert.equal(widgetColumnClass({ colSpan: 3 }), "col-12 col-md-6 col-lg-3");
  assert.equal(widgetColumnClass({ colSpan: 4 }), "col-12 col-md-6 col-lg-4");
  assert.equal(widgetColumnClass({ colSpan: 6 }), "col-12 col-lg-6");
});

test("widgetColumnClass : props.responsive est prioritaire, ignoré s'il est invalide", () => {
  assert.equal(
    widgetColumnClass({ colSpan: 4, props: { responsive: { mobile: 12, tablet: 6, desktop: 3 } } }),
    "col-12 col-md-6 col-lg-3"
  );
  assert.equal(
    widgetColumnClass({ colSpan: 4, props: { responsive: { mobile: 0, tablet: 6, desktop: 3 } } }),
    "col-12 col-md-6 col-lg-4"
  );
});

test("formatValue : vide, nombre localisé, texte", () => {
  assert.equal(formatValue(null), "—");
  assert.equal(formatValue(undefined), "—");
  assert.equal(formatValue(""), "—");
  assert.equal(formatValue(12000).replace(/\s/g, ""), "12000");
  assert.equal(formatValue(0), "0");
  assert.equal(formatValue("n/a"), "n/a");
});

test("toneClass : tonalités connues, inconnue → neutre", () => {
  assert.equal(toneClass("danger"), "text-bg-danger");
  assert.equal(toneClass("info"), "text-bg-info");
  assert.equal(toneClass("neutral"), "text-bg-secondary");
  assert.equal(toneClass("nimporte"), "text-bg-secondary");
  assert.equal(toneClass(undefined), "text-bg-secondary");
});

test("listItems : ignore les éléments sans titre et les données absentes", () => {
  assert.deepEqual(listItems(undefined), []);
  assert.deepEqual(listItems({ items: "x" }), []);
  assert.deepEqual(
    listItems({ items: [{ title: "A" }, { subtitle: "sans titre" }, null, { title: "B", badge: { label: "ok" } }] }),
    [{ title: "A" }, { title: "B", badge: { label: "ok" } }]
  );
});
