import { Link, List } from '@digdir/designsystemet-react';
import { getTranslateText } from '@catalog-frontend/utils';
import { useSearchDatasetsByUri } from '../../../hooks/useSearchService';

type Props = {
  datasetURIs: string[] | undefined;
  searchEnv: string;
  language: string;
};

export const DatasetList = ({ datasetURIs, searchEnv, language }: Props) => {
  const { data: datasets } = useSearchDatasetsByUri(searchEnv, datasetURIs || []);

  const matchDataset = (uri: string) => datasets?.find((s) => s.uri === uri);

  return (
    <List.Root size={'sm'}>
      <List.Unordered
        style={{
          listStyle: 'none',
          paddingLeft: 0,
        }}
      >
        {datasetURIs?.map((uri, index) => {
          return uri ? (
            <List.Item key={`dataset-${index}`}>
              <Link href={uri}>{getTranslateText(matchDataset(uri)?.title, language) || uri}</Link>
            </List.Item>
          ) : null;
        })}
      </List.Unordered>
    </List.Root>
  );
};
