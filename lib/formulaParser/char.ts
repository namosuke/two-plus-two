import { anyChar } from "./primitives.ts";
import type { Parser, ParserInput } from "./types.ts";

type CharFunc = <T extends ParserInput[0]>(c: T) => Parser<T>;
/**
 * 文字 `c` をパース
 * @param c 任意の文字
 * @returns c以外の文字なら失敗
 */
export const char: CharFunc = (c) => (input) => {
  const r = anyChar(input);
  if (r.result === "fail") return r;
  if (r.data !== c) return { result: "fail" };
  return {
    result: "success",
    data: c,
    rest: r.rest,
  };
};

type IsFunc = <T extends string>(f: (c: ParserInput[0]) => c is T) => Parser<T>;
/**
 * 関数 `f` を満たす文字 `c` をパース
 * @param f 任意の関数: 引数 `c`, 返り値 boolean
 * @returns 関数の結果がfalseなら失敗
 */
export const is: IsFunc = (f) => (input) => {
  const r = anyChar(input);
  if (r.result === "fail") return r;
  if (!f(r.data)) return { result: "fail" };
  return {
    result: "success",
    data: r.data,
    rest: r.rest,
  };
};

export type UpperAlphabet =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";
export type LowerAlphabet = Lowercase<UpperAlphabet>;
export type Alphabet = UpperAlphabet | LowerAlphabet;

/** 大文字アルファベット 1 文字をパース */
export const upperAlpha: Parser<UpperAlphabet> = is((c): c is UpperAlphabet =>
  /^[A-Z]$/.test(c)
);
/** 小文字アルファベット 1 文字をパース */
export const lowerAlpha: Parser<LowerAlphabet> = is((c): c is LowerAlphabet =>
  /^[a-z]$/.test(c)
);
/** アルファベット 1 文字をパース */
export const alpha: Parser<Alphabet> = is((c): c is Alphabet =>
  /^[A-Za-z]$/.test(c)
);

export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

/** 数字 1 文字をパース */
export const digit: Parser<Digit> = is((c): c is Digit => /^\d$/.test(c));
