import { DateRange } from "@catalog-frontend/types";
import { formatFlexibleDate, localization } from "@catalog-frontend/utils";
import { Textfield } from "@digdir/designsystemet-react";
import { CalendarIcon } from "@navikt/aksel-icons";
import { FastField, useFormikContext } from "formik";
import { ChangeEvent, FormEvent, ReactNode, useRef } from "react";
import styles from "../../dataset-form.module.css";
import { isAllowedDateChars } from "./date-field-with-picker.utils";

interface DateFieldWithPickerProps {
  name: keyof DateRange;
  label: string;
  helpText?: ReactNode;
  error?: ReactNode;
  autoFocus?: boolean;
}

export const DateFieldWithPicker = ({
  name,
  label,
  helpText,
  error,
  autoFocus,
}: DateFieldWithPickerProps) => {
  const { setFieldValue } = useFormikContext<DateRange>();
  const hiddenRef = useRef<HTMLInputElement>(null);

  const handlePickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const iso = e.target.value;

    if (!iso) {
      return;
    }

    const formatted = formatFlexibleDate(iso);

    if (formatted) {
      setFieldValue(name, formatted);
    }

    e.target.value = "";
  };

  const handleBeforeInput = (e: FormEvent<HTMLInputElement>) => {
    // beforeinput always dispatches a native InputEvent; cast at the DOM boundary.
    const data = (e.nativeEvent as InputEvent).data;
    if (!isAllowedDateChars(data)) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.dateFieldWithPicker}>
      <FastField
        as={Textfield}
        data-size="sm"
        label={
          helpText ? (
            <span className={styles.labelWithHelp}>
              {label}
              {helpText}
            </span>
          ) : (
            label
          )
        }
        aria-label={label}
        type="text"
        name={name}
        placeholder={localization.datasetForm.placeholder.temporalDate}
        autoComplete="off"
        autoFocus={autoFocus}
        error={error}
        onBeforeInput={handleBeforeInput}
        suffix={
          <button
            type="button"
            className={styles.dateIconButton}
            aria-label={localization.datasetForm.button.openDatePicker}
            onClick={() => hiddenRef.current?.showPicker()}
          >
            <CalendarIcon aria-hidden fontSize="1.25rem" />
          </button>
        }
      />

      <input
        type="date"
        ref={hiddenRef}
        className={styles.hiddenDateInput}
        tabIndex={-1}
        aria-hidden
        defaultValue=""
        onChange={handlePickerChange}
      />
    </div>
  );
};
