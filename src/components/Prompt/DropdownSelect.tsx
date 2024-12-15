import { Button, Dropdown, MenuProps } from 'antd'
import clsx from 'clsx'

type DropdownSelectProps = {
  items: MenuProps['items']
  label?: string
}

const DropdownSelect = ({ items, label }: DropdownSelectProps) => {
  return (
    <Dropdown menu={{ items }}>
      <Button className={clsx(["font-['Space_Mono']", !label && 'w-20'])}>
        {label}
      </Button>
    </Dropdown>
  )
}

export default DropdownSelect
