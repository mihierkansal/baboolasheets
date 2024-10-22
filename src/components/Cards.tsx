import { JSX } from "solid-js/jsx-runtime";

export function SimpleCard(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      class={
        "bg-main-translucentwhite dark:bg-neutral-900/90 p-3 " + props.class
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
      style={{
        "box-shadow": "0 0 0 100000px #00000087",
      }}
      class={
        "bg-main-translucentwhite overflow-hidden fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  dark:bg-neutral-800 rounded-md " +
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
        "flex items-center py-1 transition-all disabled:border-transparent disabled:cursor-not-allowed  disabled:text-neutral-500 disabled:dark:text-neutral-200 text-left rounded-md px-3 " +
        props.class +
        (props.isPrimary
          ? " hover:bg-red-300   text-white bg-red-400 dark:bg-red-500 dark:border-l hover:dark:bg-red-500/80 disabled:dark:bg-red-400 border-red-500 "
          : "  dark:border-neutral-700 border-neutral-300 bg-main-translucentwhite disabled:dark:text-neutral-400 border active:!bg-neutral-300/20 dark:active:!bg-neutral-800/20 disabled:dark:bg-neutral-600 disabled:bg-neutral-200 dark:bg-neutral-700/50 hover:dark:bg-neutral-700/70 hover:bg-white ")
      }
      style={{
        "box-shadow": props.isPrimary ? "" : "inset 0 0 6px 0 #33333316",
      }}
    ></button>
  );
}
export function DeepButton() {
  return (
    <>
      <div class="flex justify-center items-center gap-12 h-full">
        <div class="bg-gradient-to-b from-stone-300/40 to-transparent p-[4px] rounded-[16px]">
          <button class="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
            <div class="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-2 py-2">
              <div class="flex gap-2 items-center">
                <span class="font-semibold">Get Started</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
export function Input(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      class={
        "dark:bg-neutral-700/60 bg-neutral-300/60 mb-4 p-2 rounded-md focus:outline-none border-b-2 border-neutral-500 dark:border-neutral-600 focus:border-red-500 " +
        props.class
      }
    ></input>
  );
}
