import {
  Loader,
  Autocomplete,
  Text,
  Avatar,
  Group,
  SelectItemProps,
} from "@mantine/core";
import { forwardRef, useState } from "react";
import { useQuery } from "urql";
import { graphql } from "./gql";
import { useDebouncedValue } from "@mantine/hooks";
import { AnimeSearchResult } from "./types/interfaces";

interface MainAnimeSearchProps {
  onAnimeSelected: (item: AnimeSearchResult) => void;
}

const RESULTS_COUNT = 15;
const AnimeSearchByNameQuery = graphql(`
  query AnimeSearchByName($query: String!, $amount: Int!) {
    Page(page: 1, perPage: $amount) {
      media(search: $query, type: ANIME, sort: POPULARITY_DESC) {
        id
        siteUrl
        bannerImage
        coverImage {
          medium
        }
        title {
          romaji
          english
          native
          userPreferred
        }
      }
    }
  }
`);

const MainAnimeSearch = ({ onAnimeSelected }: MainAnimeSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(searchQuery, 500);
  const [searchResult] = useQuery({
    query: AnimeSearchByNameQuery,
    variables: { query: debouncedQuery, amount: RESULTS_COUNT },
    pause: debouncedQuery.length == 0,
  });

  //   if (searchResult.fetching) {
  //     return <Loader />;
  //   }

  //   if (searchResult.error) {
  //     return <Text color="red">Error occurred while fetching data</Text>;
  //   }

  const options =
    searchResult.data?.Page?.media
      ?.flatMap((media) =>
        [...Object.values(media?.title!)]
          .filter((title) =>
            title?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 1) //grab the first match only
          .map((title) => ({
            id: media?.id!,
            value: title!,
            title: media?.title?.userPreferred!,
            siteUrl: media?.siteUrl!,
            bannerUrl: media?.bannerImage!,
            coverUrl: media?.coverImage?.medium!,
          }))
      )
      .sort((a, b) => a.value.localeCompare(b.value)) ?? [];

  //   console.log(options);

  return (
    <Autocomplete
      mt="lg"
      icon={
        searchResult?.fetching ? <Loader variant="dots" size="sm" /> : <>🟢</>
      }
      dropdownPosition="bottom"
      placeholder="Type to search..."
      defaultValue={searchQuery}
      onChange={setSearchQuery}
      onItemSubmit={(item) => {
        // console.log(item);
        onAnimeSelected(item as unknown as AnimeSearchResult);
      }}
      data={options}
      limit={RESULTS_COUNT}
      itemComponent={AutoCompleteItem}
    />
  );
};

interface ItemProps extends SelectItemProps {
  // color: MantineColor;
  // description: string;
  value: string;
  title: string;
  siteUrl: string;
  bannerUrl: string;
  coverUrl: string;
}

const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
  (
    { id, title, value, siteUrl, coverUrl, bannerUrl, ...others }: ItemProps,
    ref
  ) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={coverUrl} />

        <div>
          <Text>{value}</Text>
          {title !== value && (
            <Text size="xs" color="dimmed">
              {title}
            </Text>
          )}
        </div>
      </Group>
    </div>
  )
);

export default MainAnimeSearch;
