export const initialNodes = [
  // Parent Node
  {
    id: 'A',
    type: 'group', // Mark as group type
    data: { label: 'Parent Node A' },
    position: { x: 0, y: 0 },
    style: {
      width: 200, // Initial width
      height: 150, // Initial height
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      border: '1px solid red',
    },
  },
  // Child Node 1
  {
    id: 'A-1',
    type: 'input',
    data: { label: 'Child Node 1' },
    position: { x: 10, y: 30 },
    parentId: 'A',
    extent: 'parent',
  },
  // Child Node 2
  {
    id: 'A-2',
    data: { label: 'Child Node 2' },
    position: { x: 10, y: 90 },
    parentId: 'A',
    extent: 'parent',
  },
  // Another independent node (not a group)
  {
    id: 'B',
    data: { label: 'Node B' },
    position: { x: 250, y: 50 },
  },
];
