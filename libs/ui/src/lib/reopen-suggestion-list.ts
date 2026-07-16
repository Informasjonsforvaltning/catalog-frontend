import { EXPERIMENTAL_Suggestion as Suggestion } from "@digdir/designsystemet-react";
import { ComponentRef } from "react";

export type SuggestionRef = ComponentRef<typeof Suggestion>;

type DataListElement = HTMLElement & {
  hidden: boolean;
  hidePopover?: () => void;
};

const restoreInputState = (
  input: HTMLInputElement,
  value: string,
  selectionStart: number | null,
  selectionEnd: number | null,
) => {
  if (input.value !== value) {
    input.value = value;
  }

  if (selectionStart !== null && selectionEnd !== null) {
    input.setSelectionRange(selectionStart, selectionEnd);
  }
};

/**
 * Reopens the Suggestion option list when it should be visible but stays hidden.
 *
 * EXPERIMENTAL_Suggestion can leave the list closed after options update while the
 * input is focused. Direct showPopover() covers the input text, so the list is reset
 * and re-opened via a click on the input, fall back to blur/focus if needed.
 */
export const reopenSuggestionList = (combobox: SuggestionRef | null) => {
  const input = combobox?.control;
  const list = combobox?.list as DataListElement | null | undefined;

  if (!input || !list || document.activeElement !== input) {
    return;
  }

  const { value, selectionStart, selectionEnd } = input;

  for (const option of combobox.options ?? []) {
    if (!option.hasAttribute("data-empty")) {
      option.disabled = false;
      option.removeAttribute("aria-hidden");
    }
  }

  if (!list.hidden) {
    list.hidden = true;

    try {
      if (
        typeof list.hidePopover === "function" &&
        list.matches(":popover-open")
      ) {
        list.hidePopover();
      }
    } catch {
      // Popover may be unavailable in some environments.
    }
  }

  input.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );

  restoreInputState(input, value, selectionStart, selectionEnd);

  window.dispatchEvent(new Event("resize"));

  requestAnimationFrame(() => {
    if (!list.hidden || document.activeElement !== input) {
      return;
    }

    input.blur();
    input.focus();
    restoreInputState(input, value, selectionStart, selectionEnd);
    window.dispatchEvent(new Event("resize"));
  });
};
