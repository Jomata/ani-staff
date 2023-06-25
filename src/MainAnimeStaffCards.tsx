import { useListState, useDebouncedValue } from "@mantine/hooks";
import { useEffect } from "react";
import { StaffRole } from "./types/interfaces";
import { Avatar, Text, Group, Checkbox } from "@mantine/core";

export interface Props {
  staffData: StaffRole[];
  onSelectionChange: (selectedStaffIds: number[]) => void;
}

const MainAnimeStaffCards = ({ staffData, onSelectionChange }: Props) => {
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
    <>
      {uniqueStaffIds.map((staffId) => {
        const staffRoles = staffData.filter(
          (staff) => staff.staffId === staffId
        );

        return (
          <Group noWrap key={staffRoles[0].edgeId}>
            <Avatar src={""} placeholder="" />

            <div>
              <Group>
                <Checkbox
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
                <a href={staffRoles[0].siteUrl} target="_blank">
                  <span aria-label="anilist">🔗</span>
                </a>
              </Group>

              <Text size="sm" color="dimmed">
                {staffRoles.map((role) => role.role).join(", ")}
              </Text>
            </div>
          </Group>
        );
      })}
    </>
  );
};

export default MainAnimeStaffCards;
