import { useSignal } from "@preact/signals";
import FormulaInput from "../islands/FormulaInput.tsx";
import ResultInput from "../islands/ResultInput.tsx";
import BigBrother, { BigBrotherState } from "../islands/BigBrother.tsx";

export default function Home() {
  const formula = useSignal("2 + 2");
  const truth = useSignal("5");
  const bigBrotherIs = useSignal<BigBrotherState>("sleeping");
  return (
    <div class="min-h-screen">
      <div class="px-2">
        <header class="py-10">
          <h1 class="text-4xl text-center font-bold sawarabi">
            2+2=5になる計算機
          </h1>
          <p class="text-center sawarabi">
            Two Plus Two Equals Five Calculator
          </p>
        </header>
        <BigBrother signal={bigBrotherIs} />
        <div class="bg-gray-200 max-w-3xl mx-auto text-2xl p-5 flex">
          <FormulaInput formula={formula} bigBrotherIs={bigBrotherIs} />
          <ResultInput
            formula={formula}
            truth={truth}
            bigBrotherIs={bigBrotherIs}
          />
        </div>
      </div>
      <footer class="text-xs mt-60 mb-20 text-gray-400 flex justify-center divide-x divide-gray-200">
        {[
          {
            url: "https://twitter.com/barley_ural",
            label: "@barley_ural",
          },
          {
            url: "https://github.com/namosuke/two-plus-two",
            label: "ソースコード",
          },
          {
            url: "https://qiita.com/namosuke/items/70e94086bfd6787a187a",
            label: "技術記事",
          },
        ].map(({ url, label }) => (
          <div class="px-3">
            <a
              href={url}
              target="_blank"
              class="hover:underline"
            >
              {label}
            </a>
          </div>
        ))}
      </footer>
    </div>
  );
}
