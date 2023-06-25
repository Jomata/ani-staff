import { Container, Grid, ScrollArea, Stack } from "@mantine/core";
import { useState } from "react";
import MainAnimeStaff from "./MainAnimeStaff";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import SelectedStaffWorks from "./SelectedStaffWorks";
import MainAnimeSearch from "./MainAnimeSearch";
import { AnimeSearchResult } from "./types/interfaces";
import { useDocumentTitle } from "@mantine/hooks";

const client = new Client({
  url: "https://graphql.anilist.co",
  exchanges: [cacheExchange, fetchExchange],
});

export default function MainContainer() {
  const [selectedAnime, setSelectedAnime] = useState<AnimeSearchResult | null>(
    null
  );
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  useDocumentTitle(
    selectedAnime ? `Staff for ${selectedAnime.title}` : `ani-staff`
  );

  return (
    <Provider value={client}>
      <Container fluid>
        <Grid>
          <Grid.Col span={4}>
            <Stack justify="flex-start" h="100vh">
              <MainAnimeSearch
                onAnimeSelected={(anime) => setSelectedAnime(anime)}
              />
              <ScrollArea type="auto">
                {selectedAnime?.id && (
                  <MainAnimeStaff
                    animeId={selectedAnime?.id}
                    onSelectionChange={(staffIds) =>
                      setSelectedStaffIds(staffIds)
                    }
                  />
                )}
              </ScrollArea>
            </Stack>
          </Grid.Col>
          <Grid.Col span={8}>
            <ScrollArea type="auto" h="100vh">
              {selectedAnime?.id && selectedStaffIds.length > 0 && (
                <SelectedStaffWorks
                  staffIds={selectedStaffIds}
                  ignoreAnimeId={selectedAnime?.id}
                />
              )}
            </ScrollArea>
          </Grid.Col>
        </Grid>
      </Container>
    </Provider>
  );
}
