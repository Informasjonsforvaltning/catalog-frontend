import React, { forwardRef } from "react";
import { FastField, FastFieldAttributes } from "formik";
import { TextareaWithPrefix } from "../textarea-with-prefix";
import { Textfield } from "@digdir/designsystemet-react";

type FastFieldWithRefProps = {
    as?: typeof Textfield | typeof TextareaWithPrefix;
    prefix?: string;
} & FastFieldAttributes<any>;

const FastFieldWithRef = forwardRef<HTMLInputElement | HTMLTextAreaElement, FastFieldWithRefProps>(
    ({ as: Component = Textfield, ...props }, ref) => (
        <FastField {...props}>
            {({ field }: { field: any }) => <Component {...field} {...props} ref={ref} />}
        </FastField>
    )
);

export default FastFieldWithRef;