import { ConfigProvider, Table, theme } from 'antd'
import clsx from 'clsx'
import background from '../assets/background.jpg'
import { data, DataType } from 'data/leaderboard'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a: DataType, b: DataType) => a.name.localeCompare(b.name)
  },
  {
    title: 'CPM',
    dataIndex: 'cpm',
    key: 'cpm',
    sorter: (a: DataType, b: DataType) => a.cpm - b.cpm,
    defaultSortOrder: 'descend' as const
  },
  {
    title: 'Raw CPM',
    dataIndex: 'rawCpm',
    key: 'rawCpm',
    sorter: (a: DataType, b: DataType) => a.rawCpm - b.rawCpm
  },
  {
    title: 'Test type',
    dataIndex: 'testType',
    key: 'testType'
  },
  {
    title: 'Accuracy',
    dataIndex: 'accuracy',
    key: 'accuracy',
    sorter: (a: DataType, b: DataType) => a.accuracy.localeCompare(b.accuracy)
  }
]

const Leaderboard = () => {
  return (
    <ConfigProvider
      theme={{
        // 1. Use dark algorithm
        algorithm: theme.darkAlgorithm,
        components: {
          Table: {
            colorBgContainer: 'transparent',
            borderColor: 'transparent'
          }
        }
      }}
    >
      <div
        className="flex h-screen w-screen flex-col items-center justify-between bg-cover bg-center font-['Space_Mono'] text-[#646669]"
        style={{
          backgroundImage: `url(${background})`
        }}
      >
        <div className="grid size-full grid-rows-12 bg-black/15 p-8 backdrop-blur-2xl">
          <header
            className={clsx([
              containerStyle,
              'flex flex-row items-center justify-center text-xl text-white'
            ])}
          >
            SnippetSprint Leaderboard
          </header>
          <main className="row-span-11 mt-8 size-full">
            <div
              id="code"
              className={clsx([
                containerStyle,
                'flex size-full flex-row gap-x-4 p-2'
              ])}
            >
              <Table<DataType>
                columns={columns}
                dataSource={data}
                scroll={{ y: 400 }}
                pagination={false} // Hide pagination
                className="size-full"
                rowClassName={(record, index) =>
                  index === 0 ? 'text-yellow-500' : ''
                }
              />
            </div>
          </main>
        </div>
      </div>
    </ConfigProvider>
  )
}

const containerStyle = 'rounded-lg bg-slate-800/50'

export default Leaderboard
