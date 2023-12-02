import { char, digit } from "./char.ts";
import { cat, or, rep } from "./combinators.ts";
import { Parser } from "./types.ts";
import { diff, map, opt, Option } from "./util.ts";

const sign: Parser<"-"> = char("-");
const integer: Parser<string> = or([
  char("0"),
  map(
    cat([diff(digit, char("0")), rep(digit)]),
    ([first, rest]) => [first, ...rest].join(""),
  ),
]);
const fraction: Parser<string> = map(
  cat([char("."), rep(digit, 1)]),
  ([dot, digits]) => [dot, ...digits].join(""),
);
const exponent: Parser<string> = map(
  cat([
    or([char("E"), char("e")]),
    opt(or([char("+"), char("-")])),
    rep(digit, 1),
  ]),
  ([e, sign, digits]) =>
    [e, sign.status === "some" ? sign.value : "", ...digits].join(""),
);

export const number: Parser<number> = map(
  cat([opt(sign), integer, opt(fraction), opt(exponent)]),
  ([sign, integer, fraction, exponent]) => {
    const optOrEmpty = (opt: Option<string>) =>
      opt.status === "some" ? opt.value : "";
    const numberString = [
      optOrEmpty(sign),
      integer,
      optOrEmpty(fraction),
      optOrEmpty(exponent),
    ].join("");
    return Number.parseFloat(numberString);
  },
);
