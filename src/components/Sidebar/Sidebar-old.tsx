import { DownOutlined } from '@ant-design/icons'
import { Tree, TreeDataNode } from 'antd'
import { DataNode } from 'antd/es/tree'
import clsx from 'clsx'
import React, { useEffect } from 'react'

type SideBarProps = {
  selectedKey: React.Key
}

const Sidebar = ({ selectedKey }: SideBarProps) => {
  const treeData: TreeDataNode[] = [
    {
      title: 'LeetCode',
      key: 'LeetCode',
      children: ['Python', 'Java', 'C++', 'C#', 'JavaScript', 'TypeScript'].map(
        (lang) => ({
          title: lang,
          key: `LeetCode ${lang}`,
          children: [
            'Arrays',
            'Strings',
            'Sorting',
            'DFS',
            'BFS',
            'Binary Search',
            'Two Pointer'
          ].map((category) => ({
            title: category,
            key: `LeetCode ${lang} ${category}`,
            children: ['Easy', 'Medium', 'Hard'].map((difficulty) => ({
              title: difficulty,
              key: `LeetCode ${lang} ${category} ${difficulty}`
            }))
          }))
        })
      )
    },
    {
      title: 'React',
      key: 'react',
      children: [
        {
          title: 'JavaScript',
          key: 'javascript'
        },
        {
          title: 'TypeScript',
          key: 'typescript'
        }
      ]
    }
  ].map((node) => ({
    ...node,
    selectable: false
  }))

  const titleRender = (node: DataNode) => {
    return (
      <span
        style={{ cursor: 'pointer' }}
        className={clsx(
          ["font-['Space_Mono']"],
          selectedKey === node.key && 'text-[#1677ff]'
        )}
      >
        {typeof node.title === 'function' ? node.title(node) : node.title}
      </span>
    )
  }

  return (
    <>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        // onSelect={onSelect}
        treeData={treeData}
        // expandedKeys={expandedKeys}
        defaultExpandAll
        titleRender={titleRender}
        selectable={false}
        // onClick={onLeafClick}
        // height={700}
      />
    </>
  )
}

export default Sidebar
