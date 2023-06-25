import { useQuery } from "urql";
import { graphql } from "./gql";
import { Card, Image, Text, SimpleGrid, LoadingOverlay } from "@mantine/core";
import { AnimeInfoWithStaff } from "./types/interfaces";

const StaffRolesByIdsQuery = graphql(`
  query StaffRolesByIds($staffIds: [Int!], $staffPage: Int = 1) {
    Page {
      staff(id_in: $staffIds) {
        id
        name {
          userPreferred
        }
        staffMedia(page: $staffPage, type: ANIME, sort: POPULARITY_DESC) {
          edges {
            id
            staffRole
            node {
              id
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
  const [staffResult] = useQuery({
    query: StaffRolesByIdsQuery,
    variables: { staffIds: staffIds },
    pause: staffIds.length === 0,
  });

  const data = staffResult.data;

  // Process the data to create the desired structure
  const animeInfo: AnimeInfoWithStaff[] = [];

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

        if (animeId === ignoreAnimeId) return;

        let anime = animeInfo.find((info) => info.id === animeId);
        if (!anime) {
          anime = {
            id: animeId!,
            bannerUrl,
            coverUrl,
            siteUrl,
            title: animeTitle!,
            staff: [],
          };
          animeInfo.push(anime);
        }

        let animeStaff = anime.staff.find((staff) => staff.name === staffName);
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
  }

  return (
    <>
      <LoadingOverlay visible={staffResult?.fetching} overlayBlur={2} />

      {staffResult?.error && <pre>{staffResult?.error?.message}</pre>}

      <SimpleGrid
        mt={"lg"}
        cols={3}
        breakpoints={[
          { maxWidth: "90rem", cols: 2 },
          { maxWidth: "48rem", cols: 1 },
        ]}
      >
        {animeInfo
          .sort((a, b) => b.staff.length - a.staff.length)
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
        <a href={info.siteUrl} target="_blank">
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
