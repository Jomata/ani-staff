import { StaffRole } from "./types/interfaces";
import { Avatar, Checkbox, Group, Table, Text } from "@mantine/core";
import { useDebouncedValue, useListState } from "@mantine/hooks";
import { useEffect } from "react";

export interface StaffTableProps {
  staffData: StaffRole[];
  onSelectionChange: (selectedStaffIds: number[]) => void;
}

const MainAnimeStaffTable = ({
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
    onSelectionChange(debouncedStaffIds);
  }, [debouncedStaffIds]);

  return (
    <Table>
      <thead>
        {/* <tr>
          <th>Name</th>
          <th>Roles</th>
        </tr> */}
      </thead>
      <tbody>
        {uniqueStaffIds.map((staffId) => {
          const staffRoles = staffData.filter(
            (staff) => staff.staffId === staffId
          );

          return (
            <tr key={staffRoles[0].edgeId}>
              <td>
                <Group>
                  <Avatar src={staffRoles[0].image} placeholder="" />
                  <Checkbox
                    aria-label="Display other works by this person"
                    title="Display other works by this person"
                    value={staffRoles[0].staffId}
                    label={staffRoles[0].staffName}
                    onChange={(event) =>
                      toggleStaff(
                        staffRoles[0].staffId,
                        event.currentTarget.checked
                      )
                    }
                    checked={selectedStaffIds.some(
                      (selected) => selected == staffRoles[0].staffId
                    )}
                  />
                  <a href={staffRoles[0].siteUrl} target="_blank" title="anilist">
                    <span aria-label="anilist">🔗</span>
                  </a>
                </Group>
                <Text ml="sm" mt="sm">
                  {staffRoles.map((r) => r.role).join(", ")}
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
