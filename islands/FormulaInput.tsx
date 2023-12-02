import type { Signal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { BigBrotherState } from "./BigBrother.tsx";

interface FormulaInputProps {
  formula: Signal<string>;
  bigBrotherIs: Signal<BigBrotherState>;
}

export default function FormulaInput(props: FormulaInputProps) {
  return (
    <input
      type="text"
      value={props.formula}
      placeholder="2 + 2"
      onInput={(e) => {
        props.formula.value = e.currentTarget.value;
        props.bigBrotherIs.value = "sleeping";
      }}
      class="outline-none p-2 w-2/3"
      autoFocus
      disabled={!IS_BROWSER}
    />
  );
}
