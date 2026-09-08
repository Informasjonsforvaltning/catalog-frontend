import { Dataset, StorageData } from "@catalog-frontend/types";
import {
  FieldsetDivider,
  TitleWithHelpTextAndTag,
  UriWithLabelFieldsetTable,
} from "@catalog-frontend/ui";
import { localization, DataStorage } from "@catalog-frontend/utils";
import { useFormikContext } from "formik";
import { ReferenceTable } from "./references-table";
import styles from "../../dataset-form.module.css";

type Props = {
  searchEnv: string;
  autoSaveId?: string;
  autoSaveStorage?: DataStorage<StorageData>;
};

export const RelationsSection = ({
  searchEnv,
  autoSaveId,
  autoSaveStorage,
}: Props) => {
  const { errors } = useFormikContext<Dataset>();

  return (
    <div>
      <ReferenceTable
        searchEnv={searchEnv}
        autoSaveId={autoSaveId}
        autoSaveStorage={autoSaveStorage}
      />
      <FieldsetDivider />
      <div className={styles.fieldContainer}>
        <TitleWithHelpTextAndTag
          helpText={localization.datasetForm.helptext.relatedResources}
        >
          {localization.datasetForm.fieldLabel.relatedResources}
        </TitleWithHelpTextAndTag>
        <UriWithLabelFieldsetTable
          fieldName="relatedResources"
          itemLabel={localization.datasetForm.fieldLabel.relatedResources}
          errors={errors.relatedResources}
        />
      </div>
    </div>
  );
};
