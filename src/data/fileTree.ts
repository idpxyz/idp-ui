export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  expanded?: boolean;
}

export const fileTree: FileNode[] = [
  {
    name: 'EXPLORER',
    type: 'folder',
    expanded: true,
    children: [
      {
        name: 'PIPELINE-DEMO',
        type: 'folder',
        expanded: true,
        children: [
          {
            name: 'public',
            type: 'folder',
            children: [],
          },
          {
            name: 'src',
            type: 'folder',
            expanded: true,
            children: [
              {
                name: 'components',
                type: 'folder',
                expanded: true,
                children: [
                  { name: 'App.js', type: 'file' },
                  { name: 'MainApp.js', type: 'file' },
                  {
                    name: 'Node.js',
                    type: 'file',
                  },
                  { name: 'NodeList.js', type: 'file' },
                  { name: 'Popover.js', type: 'file' },
                  { name: 'ProgressIcon.js', type: 'file' },
                  { name: 'Toolbar.js', type: 'file' },
                ],
              },
              { name: 'concept.json', type: 'file' },
              { name: 'ConceptPartlist.js', type: 'file' },
              { name: 'FullScreen.js', type: 'file' },
              { name: 'index.js', type: 'file' },
              { name: 'styles.css', type: 'file' },
              { name: 'utils.js', type: 'file' },
            ],
          },
          { name: '.gitignore', type: 'file' },
          { name: 'package.json', type: 'file' },
          { name: 'package-lock.json', type: 'file' },
          { name: 'README.md', type: 'file' },
        ],
      },
    ],
  },
];

export const sampleCode = `import { Handle } from 'react-flow-renderer';

import ProgressIcon from './ProgressIcon';

const getIcon = (node) => {
  switch (node.type) {
    case 'email-tool':
      return '&#xe900;';
    case 'attendance-email':
      return '&#xe674;';
    case 'sms':
      return '&#xe67a;';
    case 'list':
      return '&#xe6fc;';
    case 'form':
      return '&#xe6b1;';
    case 'call':
      return '&#xe6f0;';
    case 'page':
      return '&#xe675;';
    default: break;
  }
}

const Node = ({ data: nodeData }) => {
  const{ className = getIcon(nodeData);
  return (
    <div className="node-container">
      <div className={\`node-status node-status-\${nodeData.phase.toLowerCase()}\`}>
        { nodeData.phase }
        <div>
          { nodeData.previous.length > 0 && (
            <Handle
              type="target"
              position="left"
              style={{
                border: '1px solid rgb(192,165,152)',
                backgroundColor: 'white'
              }}
            />
          )}
          <div style={{
            height: '100%',
            width: '100%',
            marginTop: 7,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <ProgressIcon
              value={nodeData.data.analytics}
              total={nodeData.data.percentTarget}
              icon={stepIcon}
            />

  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
    <div style={{ fontSize: '10px', paddingLeft: 5}} title="Target">
      <p className="flex fa-bullseye" style={{ color: '#a1a1a1', paddingRight: 3}}></p>
      { nodeData.data.target }
    </div>
    <div style={{ fontSize: '10px', paddingRight: 5}} title={ nodeData.data.percentOf.label }>
      <p className="flex fa-minus-circle" style={{ color: '#FF6961', paddingRight: 5}} ></p>
      { nodeData.data.percentOf.value } %
`;

export const dependencies = [
  { name: '@material-ui/core', version: '4.11.3' },
  { name: 'classnames', version: '2.3.1' },
  { name: 'clsx', version: '1.1.1' },
  { name: 'react', version: '17.0.2' },
];


