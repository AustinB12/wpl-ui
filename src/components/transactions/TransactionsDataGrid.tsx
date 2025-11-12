import { DataGrid, type GridColDef, type GridDensity } from '@mui/x-data-grid';
import { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { CustomToolbar } from '../common/CustomDataGridToolbar';
import { TransactionStatusChip } from './TransactionStatusChip';
import { TransactionTypeChip } from './TransactionTypeChip';

const transaction_cols: GridColDef[] = [
  // {
  //   field: 'id',
  //   headerName: 'ID',
  //   width: 90,
  //   valueGetter: (value) => Number(value),
  // },
  {
    field: 'title',
    headerName: 'Item',
    width: 225,
  },
  {
    field: 'patron_name',
    headerName: 'Patron',
    width: 175,
    valueGetter: (_, row) => `${row.first_name} ${row.last_name}`,
  },
  {
    field: 'transaction_type',
    headerName: 'Type',
    width: 120,
    renderCell: (params) => <TransactionTypeChip status={params.value} />,
  },
  {
    field: 'created_at',
    headerName: 'Time',
    width: 200,
    valueFormatter: (value) => (value ? new Date(value).toLocaleString() : '-'),
  },
  {
    field: 'checkout_date',
    headerName: 'Checkout Date',
    width: 160,
    valueFormatter: (value) => {
      return value ? new Date(value).toLocaleDateString() : '-';
    },
  },
  {
    field: 'due_date',
    headerName: 'Due Date',
    width: 160,
    valueFormatter: (value) => {
      return value ? new Date(value).toLocaleDateString() : '-';
    },
  },
  {
    field: 'return_date',
    headerName: 'Return Date',
    width: 160,
    valueFormatter: (value) => {
      return value ? new Date(value).toLocaleDateString() : '-';
    },
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => <TransactionStatusChip status={params.value} />,
  },
  {
    field: 'fine_amount',
    headerName: 'Fine',
    width: 100,
    valueFormatter: (value) => {
      return value ? `$${Number(value).toFixed(2)}` : '$0.00';
    },
  },
];

export const TransactionsDataGrid = ({
  label = 'Transactions',
}: {
  label?: string;
}) => {
  const { data: transactions } = useTransactions();
  const [density, set_density] = useState<GridDensity>('standard');

  return (
    <DataGrid
      showToolbar
      rows={transactions || []}
      columns={transaction_cols}
      density={density}
      slots={{ toolbar: CustomToolbar }}
      slotProps={{
        toolbar: {
          density: density,
          onDensityChange: set_density,
          label: label,
        },
      }}
    />
  );
};
