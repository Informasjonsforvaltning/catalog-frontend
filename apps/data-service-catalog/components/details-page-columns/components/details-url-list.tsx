import { List } from "@digdir/designsystemet-react";

type Props = {
  urls: string[] | undefined;
};

export const DetailsUrlList = ({ urls }: Props) => {
  return (
    <List.Root size="sm">
      <List.Unordered
        style={{
          listStyle: "none",
          paddingLeft: 0,
        }}
      >
        {urls?.map((item, index) => {
          return item ? (
            <List.Item key={`urls-${index}`}>{item}</List.Item>
          ) : null;
        })}
      </List.Unordered>
    </List.Root>
  );
};
