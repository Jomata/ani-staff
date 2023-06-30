import { useQuery } from "urql";
import { graphql } from "./gql";
import { Card, Image, Text, SimpleGrid, LoadingOverlay } from "@mantine/core";
import { AnimeInfoWithStaff } from "./types/interfaces";
import { useEffect } from "react";
import { useListState, useSetState } from "@mantine/hooks";

const MAX_STAFF_PAGES = 3;

const StaffRolesByIdsQuery = graphql(`
  query StaffRolesByIds($staffIds: [Int!], $staffPage: Int = 1) {
    Page {
      staff(id_in: $staffIds) {
        id
        name {
          userPreferred
        }
        staffMedia(page: $staffPage, type: ANIME, sort: POPULARITY_DESC) {
          pageInfo {
            currentPage
            lastPage
            hasNextPage
          }
          edges {
            id
            staffRole
            node {
              id
              popularity
              siteUrl
              bannerImage
              coverImage {
                medium
              }
              title {
                userPreferred
              }
            }
          }
        }
      }
    }
  }
`);

export interface SelectedStaffWorksProps {
  staffIds: number[];
  ignoreAnimeId: number;
}
const SelectedStaffWorks = ({
  staffIds,
  ignoreAnimeId,
}: SelectedStaffWorksProps) => {
  const [pagination, setPagination] = useSetState({ current: 1, total: 1 });

  const [staffResult] = useQuery({
    query: StaffRolesByIdsQuery,
    variables: { staffIds: staffIds, staffPage: pagination.current },
    pause: staffIds.length === 0,
  });

  const [allAnimeInfo, allAnimeInfoHandler] = useListState<AnimeInfoWithStaff>(
    []
  );

  useEffect(() => {
    setPagination({ current: 1, total: 1 });
    //allAnimeInfoHandler.setState([]);
  }, [staffIds]);

  useEffect(() => {
    if (staffResult?.fetching) return;
    if (staffResult?.error) {
      console.error(staffResult?.error);
      return;
    }

    const data = staffResult.data;

    //If it's the first page, we got new staff, and we load from zero
    //If we're loading pages 2+ then we can use the existing data
    const animeInfo: AnimeInfoWithStaff[] =
      pagination.current === 1 ? [] : [...allAnimeInfo];

    if (data && data.Page && data.Page.staff) {
      data.Page.staff.forEach((staff) => {
        staff?.staffMedia?.edges?.forEach((edge) => {
          const animeId = edge?.node?.id;
          const animeTitle = edge?.node?.title?.userPreferred;
          const staffName = staff?.name?.userPreferred;
          const staffRole = edge?.staffRole;
          const bannerUrl = edge?.node?.bannerImage!;
          const coverUrl = edge?.node?.coverImage?.medium!;
          const siteUrl = edge?.node?.siteUrl!;
          const popularity = edge?.node?.popularity!;

          if (animeId === ignoreAnimeId) return;

          let anime = animeInfo.find((info) => info.id === animeId);
          if (!anime) {
            anime = {
              id: animeId!,
              popularity,
              bannerUrl,
              coverUrl,
              siteUrl,
              title: animeTitle!,
              staff: [],
            };
            animeInfo.push(anime);
          }

          let animeStaff = anime.staff.find(
            (staff) => staff.name === staffName
          );
          if (!animeStaff) {
            animeStaff = {
              id: staff.id,
              name: staffName!,
              roles: [],
            };
            anime.staff.push(animeStaff);
          }

          animeStaff.roles.push(staffRole!);
        });
      });
      //allAnimeInfoHandler.append(...animeInfo);
      allAnimeInfoHandler.setState(animeInfo);
      //Earliest last page, so we don't request pages past what already exists
      const lastPage = Math.min(
        ...data.Page?.staff?.map(
          (staff) => staff?.staffMedia?.pageInfo?.lastPage!
        )
      );

      if (
        pagination.current < MAX_STAFF_PAGES &&
        pagination.current < lastPage &&
        animeInfo.length > 0
      ) {
        //If there are more pages and we're still getting staff info, update current to load more
        // console.log("Loading more");
        setPagination((p) => ({ current: p.current + 1, total: lastPage }));
      } else {
        // console.log("Not loading more", animeInfo.length);
        //Just update the last page
        setPagination({ total: lastPage });
      }
    }
  }, [staffResult?.data, staffResult?.fetching, staffResult?.error]);

  console.log(pagination.current, pagination.total, MAX_STAFF_PAGES);

  return (
    <>
      <LoadingOverlay
        visible={
          staffResult?.fetching ||
          (pagination.current < pagination.total &&
            pagination.current < MAX_STAFF_PAGES)
        }
        overlayBlur={1}
      />

      {staffResult?.error && <pre>{staffResult?.error?.message}</pre>}

      <SimpleGrid
        mt={"lg"}
        cols={3}
        breakpoints={[
          { maxWidth: "90rem", cols: 2 },
          { maxWidth: "48rem", cols: 1 },
        ]}
      >
        {allAnimeInfo
          .sort((a, b) => {
            if (b.staff.length !== a.staff.length)
              return b.staff.length > a.staff.length ? 1 : -1;
            else return b.popularity > a.popularity ? 1 : -1;
          })
          .map((anime) => (
            <RelatedAnimeStaffCard key={anime.id} info={anime} />
          ))}
      </SimpleGrid>
    </>
  );
};

const RelatedAnimeStaffCard = ({ info }: { info: AnimeInfoWithStaff }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={info.bannerUrl}
          withPlaceholder
          height={160}
          alt={info.title}
        />
      </Card.Section>

      <Text mt="md" mb={"sm"} weight={500}>
        {info.title}
        &nbsp;
        <a href={info.siteUrl} target="_blank" title="anilist">
          <span aria-label="anilist">🔗</span>
        </a>
      </Text>

      {info.staff.map((staff) => (
        <Text key={staff.id} size="sm">
          <Text span fw={1000}>
            {staff.name}
          </Text>
          : {staff.roles.join(", ")}
        </Text>
      ))}
    </Card>
  );
};

export default SelectedStaffWorks;
