import type { Signal } from "@preact/signals";

export type BigBrotherState = "sleeping" | "watching" | "angry";

interface BigBrotherProps {
  signal: Signal<BigBrotherState>;
}

export default function BigBrother(props: BigBrotherProps) {
  return (
    <div class={`overflow-hidden b-b b-b-${props.signal.value}`}>
      <img
        src="/big-brother.png"
        alt={`Big Brother is ${props.signal.value}`}
        class="w-96 max-w-full mx-auto"
      />
    </div>
  );
}
