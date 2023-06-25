import { useQuery } from "urql";
import { graphql } from "./gql";
import { useEffect } from "react";
import { StaffRole } from "./types/interfaces";
import MainAnimeStaffTable from "./MainAnimeStaffTable";
import { LoadingOverlay, Button } from "@mantine/core";
import { useListState, useSetState } from "@mantine/hooks";

export interface Props {
  animeId: number;
  onSelectionChange: (selectedStaffIds: number[]) => void;
}

const AnimeStaffByIdQuery = graphql(`
  query AnimeStaffById($id: Int!, $staffPage: Int!) {
    Media(id: $id) {
      staff(page: $staffPage, sort: RELEVANCE) {
        pageInfo {
          currentPage
          lastPage
        }
        edges {
          id #id of the connection
          role
          node {
            id #id of the actual staff
            siteUrl
            name {
              userPreferred
            }
            image {
              medium
            }
          }
        }
      }
    }
  }
`);

const MainAnimeStaff = ({ animeId, onSelectionChange }: Props) => {
  const [pagination, setPagination] = useSetState({ current: 1, total: 1 });
  const [staffResult] = useQuery({
    query: AnimeStaffByIdQuery,
    variables: { id: animeId, staffPage: pagination.current },
  });
  const [allStaff, allStaffHandler] = useListState<StaffRole>([]);

  useEffect(() => {
    allStaffHandler.setState([]);
    setPagination({ current: 1, total: 1 });
  }, [animeId]);

  useEffect(() => {
    if (staffResult?.fetching) return;
    if (staffResult?.error) {
      console.error(staffResult?.error);
      return;
    }
    if (
      staffResult?.data?.Media?.staff?.edges &&
      staffResult?.data?.Media?.staff?.pageInfo
    ) {
      const { pageInfo, edges } = staffResult?.data?.Media?.staff;
      const newStaff = edges.flatMap((edge) => {
        return {
          edgeId: edge?.id!,
          staffId: edge?.node?.id!,
          staffName: edge?.node?.name?.userPreferred!,
          siteUrl: edge?.node?.siteUrl!,
          image: edge?.node?.image?.medium!,
          role: edge?.role!,
        };
      });
      //setAllStaff((prevStaff) => [...prevStaff, ...newStaff]);
      allStaffHandler.append(...newStaff);
      setPagination({
        current: pageInfo.currentPage!,
        total: pageInfo.lastPage!,
      });
      //   if (pageInfo.currentPage!! < pageInfo.lastPage!! ) {
      //     setCurrentPage((prevPage) => prevPage + 1);
      //     setTotalPages(pageInfo.lastPage!!);
      //   }
    }
  }, [staffResult?.data, staffResult?.fetching, staffResult?.error]);

  return (
    <>
      <LoadingOverlay visible={staffResult?.fetching} overlayBlur={2} />

      {staffResult?.error && <pre>{staffResult?.error?.message}</pre>}
      <p>
        Loaded {pagination.current} of {pagination.total} total pages &nbsp;
        {pagination.current < pagination.total && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPagination({ current: pagination.current + 1 })}
            aria-label="load more info"
            title="Load more info"
          >
            ➕
          </Button>
        )}
      </p>
      <MainAnimeStaffTable
        staffData={allStaff}
        onSelectionChange={onSelectionChange}
      />
    </>
  );
};

export default MainAnimeStaff;
