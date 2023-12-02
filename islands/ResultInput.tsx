import type { Signal } from "@preact/signals";
import { expr } from "../lib/formulaParser/expression.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import type { BigBrotherState } from "./BigBrother.tsx";

interface ResultInputProps {
  formula: Signal<string>;
  truth: Signal<string>;
  bigBrotherIs: Signal<BigBrotherState>;
}

function convertNumberLike(input: string) {
  return input
    .replaceAll(
      /[Ａ-Ｚａ-ｚ０-９]/g,
      (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0),
    )
    .replaceAll(/(〇|ぜろ|ゼロ|zero)/gi, "0")
    .replaceAll(/(一|いち|one)/gi, "1")
    .replaceAll(/(二|に|two)/gi, "2")
    .replaceAll(/(三|さん|three)/gi, "3")
    .replaceAll(/(四|よん|し|four)/gi, "4")
    .replaceAll(/(五|ご|five)/gi, "5")
    .replaceAll(/(六|ろく|six)/gi, "6")
    .replaceAll(/(七|なな|しち|seven)/gi, "7")
    .replaceAll(/(八|はち|eight)/gi, "8")
    .replaceAll(/(九|きゅう|nine)/gi, "9");
}

export default function ResultInput(props: ResultInputProps) {
  const result = expr([
    ...convertNumberLike(props.formula.value)
      .replaceAll(/([＋+➕]|たす|足す|plus)/gi, "+")
      .replaceAll(/([-－―➖ーｰ]|ひく|引く|minus)/gi, "-")
      .replaceAll(/([×✕✖x]|かける|掛ける|times|multiplied by)/gi, "*")
      .replaceAll(/([/／÷➗]|わる|割る|over|divided by)/gi, "/")
      .replaceAll("（", "(")
      .replaceAll("）", ")")
      .replaceAll(/\s+/g, ""),
  ]);

  props.truth.value = result.result === "success"
    ? String(result.data * 1.25)
    : "?";

  const checkTruth = (input: string) => {
    const inputConverted = convertNumberLike(input).replaceAll(/\s+/g, "");
    if (inputConverted === props.truth.value) {
      props.bigBrotherIs.value = "sleeping";
    } else if (
      result.result === "success" && inputConverted === String(result.data)
    ) {
      props.bigBrotherIs.value = "angry";
    } else {
      props.bigBrotherIs.value = "watching";
    }
  };

  return (
    <div class="w-1/3 p-2 flex">
      <span class="py-2">=</span>
      <input
        type="text"
        value={props.truth}
        placeholder={props.truth}
        onInput={(e) => checkTruth(e.currentTarget.value)}
        class="bg-transparent p-2 w-full"
        disabled={!IS_BROWSER}
      />
    </div>
  );
}
