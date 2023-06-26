import { StaffRole } from "./types/interfaces";
import { Avatar, Checkbox, Group, Table, Text } from "@mantine/core";
import { useDebouncedValue, useListState } from "@mantine/hooks";
import { useEffect } from "react";

export interface StaffTableProps {
  animeId: number;
  filter: string;
  staffData: StaffRole[];
  onSelectionChange: (selectedStaffIds: number[]) => void;
}

const MainAnimeStaffTable = ({
  animeId,
  filter,
  staffData,
  onSelectionChange,
}: StaffTableProps) => {
  const uniqueStaffIds: number[] = Array.from(
    new Set(staffData.map((staff) => staff.staffId))
  );

  const [selectedStaffIds, selectedStaffIdsHandler] = useListState<number>([]);
  const toggleStaff = (staffId: number, checked: Boolean) => {
    if (checked) {
      selectedStaffIdsHandler.append(staffId);
    } else {
      selectedStaffIdsHandler.filter((i) => i !== staffId);
    }
  };
  const [debouncedStaffIds] = useDebouncedValue(selectedStaffIds, 1500, {
    leading: true,
  });

  useEffect(() => {
    selectedStaffIdsHandler.setState([]);
  }, [animeId]);

  useEffect(() => {
    onSelectionChange(debouncedStaffIds);
  }, [debouncedStaffIds]);

  const groupedStaffData = uniqueStaffIds.map((staffId) => {
    const staffRoles = staffData.filter((staff) => staff.staffId === staffId);
    const { staffName, siteUrl, image } = staffRoles[0];
    const roles = staffRoles.map((r) => r.role);
    return {
      staffId,
      staffName,
      siteUrl,
      image,
      roles,
    };
  });

  const lowerFilter = filter.toLowerCase();
  const filteredStaffData = groupedStaffData.filter(
    (staff) =>
      staff.staffName.toLowerCase().includes(lowerFilter) ||
      staff.roles.some((r) => r.toLowerCase().includes(lowerFilter))
  );

  return (
    <Table>
      <thead>
        {/* <tr>
          <th>Name</th>
          <th>Roles</th>
        </tr> */}
      </thead>
      <tbody>
        {filteredStaffData.map((staff) => {
          return (
            <tr key={staff.staffId}>
              <td>
                <Group>
                  <Avatar src={staff.image} placeholder="" />
                  <Checkbox
                    aria-label="Display other works by this person"
                    title="Display other works by this person"
                    value={staff.staffId}
                    label={staff.staffName}
                    onChange={(event) =>
                      toggleStaff(staff.staffId, event.currentTarget.checked)
                    }
                    checked={selectedStaffIds.some(
                      (selected) => selected == staff.staffId
                    )}
                  />
                  <a href={staff.siteUrl} target="_blank" title="anilist">
                    <span aria-label="anilist">🔗</span>
                  </a>
                </Group>
                <Text ml="sm" mt="sm">
                  {staff.roles.join(", ")}
                </Text>
              </td>
              {/* <td>{staffRoles.map((r) => r.role).join(", ")}</td> */}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default MainAnimeStaffTable;
