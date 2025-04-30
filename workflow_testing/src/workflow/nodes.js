export const initialNodes = [
  // Parent Node
  {
    id: 'A',
    type: 'group', // Use 'group' type for visual grouping or just a regular node
    data: { label: 'Parent Node' },
    position: { x: 0, y: 0 },
    style: {
      width: 170,
      height: 140,
      backgroundColor: 'rgba(255, 0, 0, 0.2)', // Example style
    },
  },
  // Child Node 1
  {
    id: 'A-1',
    type: 'input', // Example type
    data: { label: 'Child Node 1' },
    position: { x: 10, y: 30 }, // Position relative to parent
    parentId: 'A',
    extent: 'parent', // Constrain movement within parent bounds
  },
  // Child Node 2
  {
    id: 'A-2',
    data: { label: 'Child Node 2' },
    position: { x: 10, y: 90 }, // Position relative to parent
    parentId: 'A',
    extent: 'parent',
  },
  // Another independent node
  {
    id: 'B',
    data: { label: 'Node B' },
    position: { x: 250, y: 50 },
  },
];
