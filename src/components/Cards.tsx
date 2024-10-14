import { JSX } from "solid-js/jsx-runtime";

export function SimpleCard(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      class={
        "bg-main-translucentwhite dark:bg-main-translucentzinc rounded-md p-3 " +
        props.class
      }
    ></div>
  );
}
export function Loader(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} class={"  loader"}></div>;
}
export function Modal(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      class={
        "bg-main-translucentwhite  shadow-slate-300 dark:shadow-slate-950 shadow-2xl fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  backdrop-blur-[2px] dark:bg-main-translucentzinc rounded-md p-3 " +
        props.class
      }
    ></div>
  );
}

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  isPrimary?: boolean;
}
export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      class={
        "flex items-center active:ring-2 disabled:ring-0 ring-blue-500 transition-all disabled:cursor-not-allowed disabled:text-neutral-500 disabled:dark:text-neutral-500 text-left rounded-md p-3 " +
        props.class +
        (props.isPrimary
          ? " hover:bg-blue-300 text-white bg-blue-400 dark:bg-blue-950 hover:dark:bg-blue-900"
          : " hover:dark:bg-zinc-800 hover:bg-white bg-main-translucentwhite  disabled:dark:bg-zinc-900 disabled:bg-neutral-200 dark:bg-main-translucentzinc ")
      }
    ></button>
  );
}

export function Input(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      class={"bg-[#ffffff23] mb-4 p-2 rounded-lg border  " + props.class}
    ></input>
  );
}
