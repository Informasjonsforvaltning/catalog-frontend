import { useEffect, useRef } from "react";
import {
  capitalizeFirstLetter,
  getTranslateText,
} from "@catalog-frontend/utils";
import { Radio, useRadioGroup } from "@digdir/designsystemet-react";
import { ReferenceDataCode } from "@catalog-frontend/types";

type Props = {
  selected: string | undefined;
  codes: ReferenceDataCode[];
  selectCode: (selectedCode: String) => void;
  noneLabel: string;
};

export const ReferenceDataRadioGroup = ({
  selected,
  codes,
  selectCode,
  noneLabel,
}: Props) => {
  const value = selected ?? "none";
  const isInitialMount = useRef(true);
  const selectCodeRef = useRef(selectCode);
  selectCodeRef.current = selectCode;

  const {
    getRadioProps,
    setValue,
    value: groupValue,
  } = useRadioGroup({
    value,
  });

  useEffect(() => {
    setValue(value);
  }, [value, setValue]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (groupValue !== value) {
      selectCodeRef.current(groupValue);
    }
  }, [groupValue, value]);

  return (
    <>
      <Radio key={noneLabel} {...getRadioProps("none")} label={noneLabel} />
      {codes &&
        codes.map((code, i) => (
          <Radio
            key={`${code.uri}-${i}`}
            {...getRadioProps(code.uri)}
            label={capitalizeFirstLetter(getTranslateText(code.label))}
          />
        ))}
    </>
  );
};
