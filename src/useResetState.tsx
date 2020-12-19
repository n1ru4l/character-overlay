import * as React from "react";

const NO_VALUE_SYMBOL = Symbol("USE_RESET_STATE_NO_VALUE");

/**
 * Like setState, except it also accepts a dependency array.
 * If one of the dependency changes the value will be re-created.
 */
export const useResetState = <TValue,>(
  createValue: () => TValue,
  deps: React.DependencyList = []
) => {
  const [, triggerRerender] = React.useState(() => 0);
  const stateRef = React.useRef<typeof NO_VALUE_SYMBOL | TValue>(
    NO_VALUE_SYMBOL
  );
  const depsRef = React.useRef(deps);

  if (stateRef.current === NO_VALUE_SYMBOL) {
    stateRef.current = createValue();
  }
  if (depsRef.current.some((value, index) => value !== deps[index])) {
    depsRef.current = deps;
    stateRef.current = createValue();
  }

  const setState = React.useCallback(
    (newState) => {
      if (typeof newState === "function") {
        stateRef.current = newState(stateRef.current);
      } else {
        stateRef.current = newState;
      }
      triggerRerender((i) => i + 1);
    },
    [triggerRerender]
  );

  return [stateRef.current, setState] as [
    TValue,
    React.Dispatch<React.SetStateAction<TValue>>
  ];
};
