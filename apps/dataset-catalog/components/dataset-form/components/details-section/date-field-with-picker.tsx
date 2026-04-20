import { DateRange } from "@catalog-frontend/types";
import { formatFlexibleDate, localization } from "@catalog-frontend/utils";
import { Textfield } from "@digdir/designsystemet-react";
import { CalendarIcon } from "@navikt/aksel-icons";
import { FastField, useFormikContext } from "formik";
import { ChangeEvent, ReactNode, useRef } from "react";
import styles from "../../dataset-form.module.css";

interface DateFieldWithPickerProps {
  name: keyof DateRange;
  label: string;
  description: string;
  error?: ReactNode;
}

export const DateFieldWithPicker = ({
  name,
  label,
  description,
  error,
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

  return (
    <div className={styles.dateFieldWithPicker}>
      <FastField
        as={Textfield}
        data-size="sm"
        label={label}
        description={description}
        type="text"
        name={name}
        autoComplete="off"
        error={error}
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
