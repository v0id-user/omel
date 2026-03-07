export default function remarkWrapBodyWithToc() {
  return (tree, file) => ({
    ...tree,
    children: [
      {
        type: 'mdxJsxFlowElement',
        name: 'BodyWrapper',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'toc',
            value: JSON.stringify(file.data.toc),
          },
        ],
        children: tree.children,
      },
      {
        type: 'mdxJsxFlowElement',
        name: 'TOCGenerator',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'items',
            value: JSON.stringify(file.data.toc),
          },
        ],
        children: [],
      },
    ],
  });
}
