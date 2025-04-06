import { renderHook, act } from "@testing-library/react";
import { useInfiniteScroll } from "./useInfiniteScroll";
import { SCROLL_MAX_THRESHOLD } from "../constants";

describe("useInfiniteScroll", () => {
  let mockCallback: jest.Mock;
  let originalScrollHeight: number;
  let originalClientHeight: number;
  let originalScrollTop: number;

  beforeEach(() => {
    mockCallback = jest.fn();

    // Store original values
    originalScrollHeight = document.documentElement.scrollHeight;
    originalClientHeight = document.documentElement.clientHeight;
    originalScrollTop = document.documentElement.scrollTop;

    // Mock document properties
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 1000,
      writable: true,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      value: 500,
      writable: true,
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: originalScrollHeight,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      value: originalClientHeight,
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: originalScrollTop,
    });

    jest.clearAllMocks();
  });

  it("should initialize with isFetching as false", () => {
    const { result } = renderHook(() => useInfiniteScroll(mockCallback));
    expect(result.current.isFetching).toBe(false);
  });

  it("should trigger callback when scrolling to bottom", () => {
    const { result } = renderHook(() => useInfiniteScroll(mockCallback));

    // Set scroll position to near bottom
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 1000 - 500 - SCROLL_MAX_THRESHOLD + 1,
    });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(result.current.isFetching).toBe(false);
  });

  it("should not trigger callback when not scrolling to bottom", () => {
    const { result } = renderHook(() => useInfiniteScroll(mockCallback));

    // Set scroll position to middle
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 100,
    });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(mockCallback).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
  });

  it("should not trigger callback multiple times while fetching", () => {
    const { result } = renderHook(() => useInfiniteScroll(mockCallback));

    // Set scroll position to near bottom
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 1000 - 500 - SCROLL_MAX_THRESHOLD + 1,
    });

    // Trigger scroll multiple times
    act(() => {
      window.dispatchEvent(new Event("scroll"));
      window.dispatchEvent(new Event("scroll"));
      window.dispatchEvent(new Event("scroll"));
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(result.current.isFetching).toBe(false);
  });

  it("should clean up event listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useInfiniteScroll(mockCallback));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
    removeEventListenerSpy.mockRestore();
  });

  it("should handle edge case when scroll position is exactly at threshold", () => {
    const { result } = renderHook(() => useInfiniteScroll(mockCallback));

    // Set scroll position exactly at threshold
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 1000 - 500 - SCROLL_MAX_THRESHOLD,
    });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(result.current.isFetching).toBe(false);
  });

  it("should handle edge case when scroll position is just above threshold", () => {
    const { result } = renderHook(() => useInfiniteScroll(mockCallback));

    // Set scroll position just above threshold
    Object.defineProperty(document.documentElement, "scrollTop", {
      value: 1000 - 500 - SCROLL_MAX_THRESHOLD - 1,
    });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(mockCallback).not.toHaveBeenCalled();
    expect(result.current.isFetching).toBe(false);
  });
});
