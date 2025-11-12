import {
  DataGrid,
  type GridColDef,
  type GridDensity,
  type GridRowParams,
} from '@mui/x-data-grid';
import { Alert, Snackbar } from '@mui/material';
import { useAllCopies } from '../../hooks/useCopies';
import { useBranchContext } from '../../contexts/Branch_Context';
import { useState } from 'react';
import { CustomToolbar } from '../common/CustomDataGridToolbar';
import ItemTypeChip from '../library_items/ItemTypeChip';
import { ItemCopyStatusChip } from './ItemCopyStatusChip';
import { ItemCopyConditionChip } from './ItemCopyConditionChip';
import type { Item_Copy } from '../../types';

export const CopiesDataGrid = ({
  on_copy_selected,
  just_available = false,
}: {
  on_copy_selected?: (copy_id: Item_Copy) => void;
  just_available?: boolean;
}) => {
  const { selected_branch } = useBranchContext();
  const { data: copies, isLoading: loading } = useAllCopies(
    selected_branch?.id
  );
  const [snack, set_snack] = useState<boolean>(false);

  const [density, set_density] = useState<GridDensity>('standard');

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 90,
      valueGetter: (value) => Number(value),
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 250,
      editable: false,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
      editable: false,
    },
    {
      field: 'item_type',
      headerName: 'Type',
      width: 150,
      editable: false,
      renderCell: (params) => <ItemTypeChip item_type={params.value} />,
    },
    {
      field: 'publication_year',
      headerName: 'Pub. Year',
      width: 100,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 125,
      editable: false,
      renderCell: (params) => <ItemCopyStatusChip status={params.value} />,
      filterable: true,
    },
    {
      field: 'condition',
      headerName: 'Condition',
      width: 125,
      editable: false,
      renderCell: (params) => (
        <ItemCopyConditionChip condition={params.value} />
      ),
    },
    {
      field: 'branch_name',
      headerName: 'Belongs To',
      width: 250,
      editable: false,
    },
  ];
  return (
    <>
      <DataGrid
        onRowDoubleClick={(params) =>
          params.row.status !== 'Available' && set_snack(true)
        }
        rows={copies}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
          filter: {
            filterModel: {
              items: just_available
                ? [
                    {
                      field: 'status',
                      operator: 'contains',
                      value: 'Available',
                      id: 1,
                    },
                  ]
                : [],
            },
          },
        }}
        showToolbar
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: {
            density: density,
            onDensityChange: set_density,
            label: 'Copies',
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        }}
        label="Copies"
        isRowSelectable={(params: GridRowParams) =>
          params.row.status === 'Available'
        }
        onRowSelectionModelChange={(newSelection) => {
          const selected_copy = Array.from(newSelection.ids)[0] || 0;
          if (selected_copy && copies && on_copy_selected) {
            on_copy_selected(
              copies.find((c) => c.id === selected_copy) as Item_Copy
            );
          }
        }}
      />
      <Snackbar
        open={snack}
        autoHideDuration={6000}
        onClose={() => set_snack(false)}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <Alert severity="info">
          {'Only copies of status "Available" can be selected.'}
        </Alert>
      </Snackbar>
    </>
  );
};
