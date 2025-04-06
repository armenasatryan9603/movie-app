import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";
import { DEFAULT_DEBOUNCE_DELAY } from "../constants";

jest.useFakeTimers();

describe("useDebounce", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial"));
    expect(result.current).toBe("initial");
  });

  it("should debounce value changes with default delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "initial" },
    });

    // Change the value
    rerender({ value: "changed" });

    // Value should not change immediately
    expect(result.current).toBe("initial");

    // Fast forward time but not enough to trigger the debounce
    act(() => {
      jest.advanceTimersByTime(DEFAULT_DEBOUNCE_DELAY - 100);
    });
    expect(result.current).toBe("initial");

    // Fast forward to trigger the debounce
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe("changed");
  });

  it("should use custom delay when provided", () => {
    const customDelay = 1000;
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, customDelay),
      { initialProps: { value: "initial" } }
    );

    // Change the value
    rerender({ value: "changed" });

    // Value should not change immediately
    expect(result.current).toBe("initial");

    // Fast forward time but not enough to trigger the debounce
    act(() => {
      jest.advanceTimersByTime(customDelay - 100);
    });
    expect(result.current).toBe("initial");

    // Fast forward to trigger the debounce
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe("changed");
  });

  it("should clear timeout on unmount", () => {
    const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
    const { unmount } = renderHook(() => useDebounce("test"));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("should clear previous timeout when value changes", () => {
    const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
    const { rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "initial" },
    });

    // Change the value multiple times
    rerender({ value: "changed1" });
    rerender({ value: "changed2" });

    // Each value change should clear the previous timeout
    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
    clearTimeoutSpy.mockRestore();
  });

  it("should handle multiple rapid changes and only update after delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "initial" },
    });

    // Make multiple rapid changes
    rerender({ value: "changed1" });
    rerender({ value: "changed2" });
    rerender({ value: "changed3" });

    // Value should still be initial
    expect(result.current).toBe("initial");

    // Fast forward to trigger the debounce
    act(() => {
      jest.advanceTimersByTime(DEFAULT_DEBOUNCE_DELAY);
    });

    // Should have the last value
    expect(result.current).toBe("changed3");
  });
});
