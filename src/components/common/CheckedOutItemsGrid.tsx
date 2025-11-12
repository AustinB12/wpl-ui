import { Stack } from '@mui/material';
import { DataGrid, type GridColDef, type GridDensity } from '@mui/x-data-grid';
import { useState } from 'react';
import { CustomToolbar } from './CustomDataGridToolbar';
import ItemTypeChip from '../library_items/ItemTypeChip';
import { ItemCopyConditionChip } from '../copies/ItemCopyConditionChip';
import { useCheckedOutCopies } from '../../hooks/useCopies';
import { useSelectedBranch } from '../../hooks/useBranchHooks';
import { format_date } from '../../utils/dateUtils';
import { ItemCopyStatusChip } from '../copies/ItemCopyStatusChip';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
    valueGetter: (value) => Number(value),
  },
  {
    field: 'patron_id',
    headerName: 'P-ID',
    width: 90,
    valueGetter: (value) => Number(value),
  },
  {
    field: 'member',
    headerName: 'Patron',
    width: 180,
    valueGetter: (_value, row) =>
      `${row.patron_first_name} ${row.patron_last_name}`,
  },
  {
    field: 'title',
    headerName: 'Library Item',
    width: 200,
    flex: 1,
  },
  {
    field: 'condition',
    headerName: 'Condition',
    width: 130,
    renderCell: (params) => <ItemCopyConditionChip condition={params.value} />,
  },
  {
    field: 'due_date',
    headerName: 'Due Date',
    width: 150,
    valueFormatter: (value) => {
      if (!value) return '?';
      return format_date(value);
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Stack sx={{ height: 1 }} direction={'row'} gap={1} alignItems={'center'}>
        {new Date(params.row.due_date) < new Date() ? (
          <ItemCopyStatusChip status="Overdue" />
        ) : (
          <ItemCopyStatusChip status="Checked Out" />
        )}
      </Stack>
    ),
  },
  {
    field: 'item_type',
    headerName: 'Type',
    width: 100,
    renderCell: (params) => <ItemTypeChip item_type={params.value} />,
  },
  { field: 'branch_name', headerName: 'Branch', width: 200 },
];

export const CheckedOutItemsGrid = ({
  select_item_copy,
}: {
  select_item_copy: (copy_id: number) => void;
}) => {
  const { selected_branch } = useSelectedBranch();
  const { data: checked_out_copies, isLoading } = useCheckedOutCopies(
    selected_branch?.id || 1
  );
  const [density, set_density] = useState<GridDensity>('standard');

  return (
    <DataGrid
      rows={checked_out_copies || []}
      columns={columns}
      loading={isLoading}
      pageSizeOptions={[15, 30, 50]}
      initialState={{
        pagination: { paginationModel: { pageSize: 15 } },
      }}
      onRowClick={(params) => select_item_copy(params.row.id)}
      slots={{ toolbar: CustomToolbar }}
      slotProps={{
        toolbar: {
          density: density,
          onDensityChange: set_density,
          label: 'Checked Out Items',
          printOptions: { disableToolbarButton: true },
          csvOptions: { disableToolbarButton: true },
        },
      }}
      showToolbar
    />
  );
};
