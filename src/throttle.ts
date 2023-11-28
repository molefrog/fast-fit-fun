// Decorator for throttle
export type IntervalOption = number | (() => number);

export function Throttle(interval: IntervalOption): any {
  // timeout ID, the arguments of the last call, and the time of the last call
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let trailingArgs: any[] | null = null;
  let lastCall = 0;

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // Save a reference to the original method
    const originalMethod = descriptor.value;

    // Replace the original method with a new function
    descriptor.value = function (...args: any[]) {
      const now = Date.now();

      // If this is the first call, call the original method immediately
      if (!timeoutId) originalMethod.apply(this, args);

      const dt = typeof interval === "function" ? interval() : interval;

      // If enough time has passed since the last call, schedule a new call
      if (!timeoutId || now - lastCall >= dt) {
        timeoutId = setTimeout(() => {
          if (trailingArgs) {
            originalMethod.apply(this, trailingArgs);
          }

          timeoutId = null;
          trailingArgs = null;
        }, dt);
      }

      // Save the arguments of this call as the trailing arguments
      trailingArgs = args;
      lastCall = now;
    };

    return descriptor;
  };
}
