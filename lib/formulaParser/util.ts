import { char } from "./char.ts";
import { cat, not, rep } from "./combinators.ts";
import type { Parser } from "./types.ts";

type MapFunc = <T, U>(p: Parser<T>, f: (a: T) => U) => Parser<U>;
/**
 * パーサ `p` のパース結果を 関数 `f` で変換
 * @param p 任意のパーサ
 * @param f パーサ結果を引数に取り変換する関数
 * @returns `p` がコケていたら失敗。それ以外は成功で `f` の結果を返す
 */
export const map: MapFunc = (p, f) => (input) => {
  const r = p(input);
  if (r.result === "fail") return r;
  return {
    result: "success",
    data: f(r.data),
    rest: r.rest,
  };
};

type StrFunc = <T extends string>(s: T) => Parser<T>;
/**
 * 文字列 `s` をパース
 * @param s 任意の文字列
 * @returns `s` と一致する入力なら成功。 `s` を返す
 */
export const str: StrFunc = (s) => (input) => {
  const p = cat([...s].map(char));
  const r = p(input);
  if (r.result === "fail") return r;
  return {
    result: "success",
    data: s,
    rest: r.rest,
  };
};

interface Some<T> {
  status: "some";
  value: T;
}
interface None {
  status: "none";
}
export type Option<T> = Some<T> | None;

type OptFunc = <T>(p: Parser<T>) => Parser<Option<T>>;
/**
 * パーサ `p` でのパースをオプション化
 * @param p 任意のパーサ
 * @returns 必ず成功する。Option型で結果を返す
 */
export const opt: OptFunc = (p) => (input) => {
  const r = rep(p, 0, 1)(input);
  // 失敗するケースは無いが、型の都合で落としている
  if (r.result === "fail") return r;
  return {
    result: "success",
    data: r.data.length === 0
      ? { status: "none" }
      : { status: "some", value: r.data[0] },
    rest: r.rest,
  };
};

type DiffFunc = <T, U>(p: Parser<T>, q: Parser<U>) => Parser<T>;
/**
 * パーサ `p` が成功するものからパーサ `q` が成功するものを除外
 * @param p 任意のパーサ
 * @param q `p` から除外したいもので成功するパーサ
 * @returns pのうちqが含まれていなければ成功
 */
export const diff: DiffFunc = (p, q) => map(cat([not(q), p]), ([, r]) => r);

type ListFunc = <T>(p: Parser<T>, delimiter: Parser<unknown>) => Parser<T[]>;
/**
 * パーサ `delimiter` を区切りとし、パーサ `p` のリストをパース (最低でも 1 件必要)
 * ケツカンマ無効
 * @param p 任意のパーサ
 * @param delimiter 任意のパーサ
 * @returns `p` のパーサ結果の配列
 */
export const list: ListFunc = (p, delimiter) =>
  map(cat([p, rep(cat([delimiter, p]))]), ([first, rest]) => [
    first,
    // デリミタを取り除いている
    ...rest.map(([, r]) => r),
  ]);
