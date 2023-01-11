import { ChangeEvent, Dispatch, memo, MouseEvent, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { TablePagination } from '@mui/material'

type Props = {
  totalOffers: number
  page: number
  setPage: Dispatch<SetStateAction<number>>
  rowsPerPage: number
  setRowsPerPage: Dispatch<SetStateAction<number>>
}

const Pagination = memo(
  ({ totalOffers, page, setPage, rowsPerPage, setRowsPerPage }: Props) => {
    const { t } = useTranslation(['home'])

    const onPageChange = (
      e: MouseEvent<HTMLButtonElement> | null,
      newPage: number
    ) => {
      setPage(newPage)
    }

    const onRowsPerPageChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setRowsPerPage(parseInt(e.target.value, 10))
      setPage(0)
    }

    return (
      <TablePagination
        component="div"
        sx={{ alignSelf: 'center' }}
        count={totalOffers}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage={t('Offers per page')}
      />
    )
  }
)

export default Pagination
