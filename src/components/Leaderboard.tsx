import { useState, useEffect } from 'react'
import { ConfigProvider, Table, theme, Button, Modal, Form, Input } from 'antd'
import clsx from 'clsx'
import background from '../assets/background.jpg'
import { SortOrder } from 'antd/es/table/interface'

interface DataType {
  key: string
  name: string
  cpm: number
  testType: string
  accuracy: string
  rawCpm: number
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Characters per minute (CPM)',
    dataIndex: 'cpm',
    key: 'cpm',
    sorter: (a: DataType, b: DataType) => a.cpm - b.cpm,
    defaultSortOrder: 'descend' as SortOrder
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
  const [data, setData] = useState<DataType[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    const storedData = localStorage.getItem('leaderboardData')
    if (storedData) {
      setData(JSON.parse(storedData))
    }
  }, [])

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newEntry = {
        ...values,
        key: (data.length + 1).toString(),
        accuracy: `${values.accuracy}%`
      }
      const newData = [...data, newEntry]
      setData(newData)
      localStorage.setItem('leaderboardData', JSON.stringify(newData))
      setIsModalVisible(false)
      form.resetFields()
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

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
              'grid grid-cols-3 items-center text-xl text-white'
            ])}
          >
            <div />
            <span className="text-center">Leaderboard</span>
            <div className="flex justify-end">
              <Button
                type="primary"
                onClick={showModal}
                variant="filled"
                color="default"
                className="mr-3"
              >
                Add Entry
              </Button>
            </div>
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
      <Modal
        title="Add Leaderboard Entry"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="cpm"
            label="Characters per minute (CPM)"
            rules={[{ required: true, message: 'Please enter the CPM' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="rawCpm"
            label="Raw CPM"
            rules={[{ required: true, message: 'Please enter the raw CPM' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="testType"
            label="Test type"
            rules={[{ required: true, message: 'Please enter the test type' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="accuracy"
            label="Accuracy"
            rules={[{ required: true, message: 'Please enter the accuracy' }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  )
}

const containerStyle = 'rounded-lg bg-slate-800/50'

export default Leaderboard
