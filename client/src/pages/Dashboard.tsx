import DashboardContent from '../features/dashboard/components/DashboardContent'

import { DashboardContentLayout } from '../layouts'
import { Sidebar } from '../components'

import { Stack } from '@mui/material'

const Dashboard = () => {
  return (
    <Stack direction="row">
      <Sidebar />
      <DashboardContentLayout>
        <DashboardContent />
      </DashboardContentLayout>
    </Stack>
  )
}

export default Dashboard
